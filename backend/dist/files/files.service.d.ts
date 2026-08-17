import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { Tag } from '../database/entities/tag.entity';
import { UploadDto } from './dto/upload.dto';
export declare class FilesService {
    private readonly files;
    private readonly tags;
    private readonly logger;
    private readonly storageRoot;
    private readonly forbidden;
    constructor(files: Repository<FileEntity>, tags: Repository<Tag>, config: ConfigService);
    private tagsFromInput;
    private safePath;
    private toDto;
    upload(uploaded: Express.Multer.File, dto: UploadDto, userId?: number): Promise<{
        fileId: number;
        token: string;
        name: string;
        type: string | null;
        size: number;
        expireAt: Date | null;
        hasPassword: boolean;
        tags: string[];
    }>;
    private removeTemporary;
    history(userId: number): Promise<{
        uploadedAt: Date;
        status: string;
        fileId: number;
        token: string;
        name: string;
        type: string | null;
        size: number;
        expireAt: Date | null;
        hasPassword: boolean;
        tags: string[];
    }[]>;
    metadata(token: string): Promise<{
        name: string;
        type: string | null;
        size: number;
        expire_at: Date | null;
        hasPassword: boolean;
        expired: boolean;
    }>;
    download(token: string, password?: string): Promise<{
        file: FileEntity;
        physical: string;
    }>;
    remove(fileId: number, userId: number): Promise<{
        message: string;
    }>;
    purgeExpired(): Promise<void>;
}
