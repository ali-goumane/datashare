import { BadRequestException, ConflictException, ForbiddenException, GoneException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import { resolve, join, basename, relative, isAbsolute } from 'path';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { FileEntity } from '../database/entities/file.entity';
import { Tag } from '../database/entities/tag.entity';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly storageRoot: string;
  private readonly forbidden = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.com', '.scr', '.ps1'];
  constructor(@InjectRepository(FileEntity) private readonly files: Repository<FileEntity>, @InjectRepository(Tag) private readonly tags: Repository<Tag>, config: ConfigService) {
    this.storageRoot = resolve(config.get<string>('STORAGE_PATH', './storage'));
  }
  private tagsFromInput(input?: string) {
    if (!input) return [];
    const values = [...new Set(input.split(',').map((tag) => tag.trim()).filter(Boolean))];
    if (values.some((tag) => tag.length > 30)) throw new BadRequestException('Un tag ne peut pas dépasser 30 caractères');
    return values;
  }
  private safePath(file: FileEntity) {
    if (!file.path || basename(file.path) !== file.path) throw new ForbiddenException('Fichier introuvable');
    const physical = resolve(this.storageRoot, file.path);
    const outside = relative(this.storageRoot, physical).startsWith('..') || isAbsolute(relative(this.storageRoot, physical));
    if (outside) throw new ForbiddenException('Fichier introuvable');
    return physical;
  }
  private toDto(file: FileEntity) {
    return { fileId: file.fileId, token: file.token, name: file.name, type: file.type, size: Number(file.size ?? 0), expireAt: file.expireAt, hasPassword: Boolean(file.accessPassword), tags: (file.tags ?? []).map((tag) => tag.tagName) };
  }
  async upload(uploaded: Express.Multer.File, dto: UploadDto, userId?: number) {
    if (!uploaded) throw new BadRequestException('Le fichier est obligatoire');
    const extension = (uploaded.originalname.match(/\.[^./\\]+$/)?.[0] ?? '').toLowerCase();
    if (this.forbidden.includes(extension)) { await this.removeTemporary(uploaded.path); throw new BadRequestException('Ce type de fichier est interdit'); }
    const token = uploaded.filename;
    const expireAt = new Date(Date.now() + (dto.expireDays ?? 7) * 86400000);
    try {
      const tagEntities: Tag[] = [];
      for (const tagName of this.tagsFromInput(dto.tags)) {
        let tag = await this.tags.findOne({ where: { tagName } });
        if (!tag) tag = await this.tags.save(this.tags.create({ tagName }));
        tagEntities.push(tag);
      }
      const entity = this.files.create({ token, name: uploaded.originalname, type: uploaded.mimetype || null, size: uploaded.size, path: token, accessPassword: dto.password ? await bcrypt.hash(dto.password, 10) : null, expireAt, userId: userId ?? null, tags: tagEntities });
      const saved = await this.files.save(entity);
      return this.toDto(saved);
    } catch (error) {
      await this.removeTemporary(uploaded.path);
      if (error instanceof ConflictException) throw error;
      throw error;
    }
  }
  private async removeTemporary(path?: string) { if (path) await fs.rm(path, { force: true }).catch(() => undefined); }
  async history(userId: number) {
    const files = await this.files.find({ where: { userId }, relations: { tags: true }, order: { uploadedAt: 'DESC' } });
    return files.map((file) => ({ ...this.toDto(file), uploadedAt: file.uploadedAt, status: file.expireAt && file.expireAt < new Date() ? 'expired' : 'valid' }));
  }
  async metadata(token: string) {
    const file = await this.files.findOne({ where: { token }, relations: { tags: true } });
    if (!file) throw new NotFoundException('Fichier introuvable');
    return { name: file.name, type: file.type, size: Number(file.size ?? 0), expire_at: file.expireAt, hasPassword: Boolean(file.accessPassword), expired: Boolean(file.expireAt && file.expireAt < new Date()) };
  }
  async download(token: string, password?: string) {
    const file = await this.files.findOne({ where: { token } });
    if (!file) throw new NotFoundException('Fichier introuvable');
    if (file.expireAt && file.expireAt < new Date()) throw new GoneException('Ce lien a expiré');
    if (file.accessPassword && (!password || !(await bcrypt.compare(password, file.accessPassword)))) throw new UnauthorizedException('Mot de passe incorrect');
    const physical = this.safePath(file);
    await fs.access(physical).catch(() => { throw new NotFoundException('Fichier introuvable'); });
    return { file, physical };
  }
  async remove(fileId: number, userId: number) {
    const file = await this.files.findOne({ where: { fileId } });
    if (!file || file.userId !== userId) throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer ce fichier");
    await this.removeTemporary(this.safePath(file));
    await this.files.delete(fileId);
    return { message: 'Fichier supprimé avec succès' };
  }
  @Cron('0 1 * * *')
  async purgeExpired() {
    const expired = await this.files.find({ where: { expireAt: LessThan(new Date()) } });
    for (const file of expired) { await this.removeTemporary(this.safePath(file)).catch(() => undefined); await this.files.delete(file.fileId); }
    this.logger.log(`${expired.length} fichier(s) expiré(s) purgé(s)`);
  }
}
