import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly users;
    constructor(config: ConfigService, users: UsersService);
    validate(payload: {
        sub: number;
    }): Promise<import("../database/entities/user.entity").User | null>;
}
export {};
