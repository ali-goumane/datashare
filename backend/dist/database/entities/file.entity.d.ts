import { User } from './user.entity';
import { Tag } from './tag.entity';
export declare class FileEntity {
    fileId: number;
    token: string;
    name: string;
    type: string | null;
    size: number | null;
    path: string | null;
    accessPassword: string | null;
    uploadedAt: Date;
    expireAt: Date | null;
    userId: number | null;
    user: User | null;
    tags: Tag[];
}
