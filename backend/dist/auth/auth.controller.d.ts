import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: AuthDto): Promise<{
        access_token: string;
        user: {
            userId: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    login(dto: AuthDto): Promise<{
        access_token: string;
        user: {
            userId: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    me(req: Request & {
        user: {
            userId: number;
            email: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }): {
        userId: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
