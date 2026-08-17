import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    private publicUser;
    private response;
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
}
