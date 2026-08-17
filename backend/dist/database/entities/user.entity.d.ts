import { FileEntity } from './file.entity';
export declare class User {
    userId: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    files: FileEntity[];
}
