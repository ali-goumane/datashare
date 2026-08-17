import type { Request, Response } from 'express';
import { FilesService } from './files.service';
import { UploadDto } from './dto/upload.dto';
import { DownloadDto } from './dto/download.dto';
export declare class FilesController {
    private readonly files;
    constructor(files: FilesService);
    upload(file: Express.Multer.File, dto: UploadDto, request: Request & {
        user?: {
            userId: number;
        };
    }): Promise<{
        fileId: number;
        token: string;
        name: string;
        type: string | null;
        size: number;
        expireAt: Date | null;
        hasPassword: boolean;
        tags: string[];
    }>;
    history(request: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
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
    download(token: string, dto: DownloadDto, response: Response): Promise<void>;
    remove(id: string, request: Request & {
        user: {
            userId: number;
        };
    }): Promise<{
        message: string;
    }>;
}
