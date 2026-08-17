"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const fs_1 = require("fs");
const path_1 = require("path");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const file_entity_1 = require("../database/entities/file.entity");
const tag_entity_1 = require("../database/entities/tag.entity");
let FilesService = FilesService_1 = class FilesService {
    files;
    tags;
    logger = new common_1.Logger(FilesService_1.name);
    storageRoot;
    forbidden = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.com', '.scr', '.ps1'];
    constructor(files, tags, config) {
        this.files = files;
        this.tags = tags;
        this.storageRoot = (0, path_1.resolve)(config.get('STORAGE_PATH', './storage'));
    }
    tagsFromInput(input) {
        if (!input)
            return [];
        const values = [...new Set(input.split(',').map((tag) => tag.trim()).filter(Boolean))];
        if (values.some((tag) => tag.length > 30))
            throw new common_1.BadRequestException('Un tag ne peut pas dépasser 30 caractères');
        return values;
    }
    safePath(file) {
        if (!file.path || (0, path_1.basename)(file.path) !== file.path)
            throw new common_1.ForbiddenException('Fichier introuvable');
        const physical = (0, path_1.resolve)(this.storageRoot, file.path);
        const outside = (0, path_1.relative)(this.storageRoot, physical).startsWith('..') || (0, path_1.isAbsolute)((0, path_1.relative)(this.storageRoot, physical));
        if (outside)
            throw new common_1.ForbiddenException('Fichier introuvable');
        return physical;
    }
    toDto(file) {
        return { fileId: file.fileId, token: file.token, name: file.name, type: file.type, size: Number(file.size ?? 0), expireAt: file.expireAt, hasPassword: Boolean(file.accessPassword), tags: (file.tags ?? []).map((tag) => tag.tagName) };
    }
    async upload(uploaded, dto, userId) {
        if (!uploaded)
            throw new common_1.BadRequestException('Le fichier est obligatoire');
        const extension = (uploaded.originalname.match(/\.[^./\\]+$/)?.[0] ?? '').toLowerCase();
        if (this.forbidden.includes(extension)) {
            await this.removeTemporary(uploaded.path);
            throw new common_1.BadRequestException('Ce type de fichier est interdit');
        }
        const token = uploaded.filename;
        const expireAt = new Date(Date.now() + (dto.expireDays ?? 7) * 86400000);
        try {
            const tagEntities = [];
            for (const tagName of this.tagsFromInput(dto.tags)) {
                let tag = await this.tags.findOne({ where: { tagName } });
                if (!tag)
                    tag = await this.tags.save(this.tags.create({ tagName }));
                tagEntities.push(tag);
            }
            const entity = this.files.create({ token, name: uploaded.originalname, type: uploaded.mimetype || null, size: uploaded.size, path: token, accessPassword: dto.password ? await bcrypt.hash(dto.password, 10) : null, expireAt, userId: userId ?? null, tags: tagEntities });
            const saved = await this.files.save(entity);
            return this.toDto(saved);
        }
        catch (error) {
            await this.removeTemporary(uploaded.path);
            if (error instanceof common_1.ConflictException)
                throw error;
            throw error;
        }
    }
    async removeTemporary(path) { if (path)
        await fs_1.promises.rm(path, { force: true }).catch(() => undefined); }
    async history(userId) {
        const files = await this.files.find({ where: { userId }, relations: { tags: true }, order: { uploadedAt: 'DESC' } });
        return files.map((file) => ({ ...this.toDto(file), uploadedAt: file.uploadedAt, status: file.expireAt && file.expireAt < new Date() ? 'expired' : 'valid' }));
    }
    async metadata(token) {
        const file = await this.files.findOne({ where: { token }, relations: { tags: true } });
        if (!file)
            throw new common_1.NotFoundException('Fichier introuvable');
        return { name: file.name, type: file.type, size: Number(file.size ?? 0), expire_at: file.expireAt, hasPassword: Boolean(file.accessPassword), expired: Boolean(file.expireAt && file.expireAt < new Date()) };
    }
    async download(token, password) {
        const file = await this.files.findOne({ where: { token } });
        if (!file)
            throw new common_1.NotFoundException('Fichier introuvable');
        if (file.expireAt && file.expireAt < new Date())
            throw new common_1.GoneException('Ce lien a expiré');
        if (file.accessPassword && (!password || !(await bcrypt.compare(password, file.accessPassword))))
            throw new common_1.UnauthorizedException('Mot de passe incorrect');
        const physical = this.safePath(file);
        await fs_1.promises.access(physical).catch(() => { throw new common_1.NotFoundException('Fichier introuvable'); });
        return { file, physical };
    }
    async remove(fileId, userId) {
        const file = await this.files.findOne({ where: { fileId } });
        if (!file || file.userId !== userId)
            throw new common_1.ForbiddenException("Vous n'êtes pas autorisé à supprimer ce fichier");
        await this.removeTemporary(this.safePath(file));
        await this.files.delete(fileId);
        return { message: 'Fichier supprimé avec succès' };
    }
    async purgeExpired() {
        const expired = await this.files.find({ where: { expireAt: (0, typeorm_2.LessThan)(new Date()) } });
        for (const file of expired) {
            await this.removeTemporary(this.safePath(file)).catch(() => undefined);
            await this.files.delete(file.fileId);
        }
        this.logger.log(`${expired.length} fichier(s) expiré(s) purgé(s)`);
    }
};
exports.FilesService = FilesService;
__decorate([
    (0, schedule_1.Cron)('0 1 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilesService.prototype, "purgeExpired", null);
exports.FilesService = FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.FileEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeorm_2.Repository, config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map