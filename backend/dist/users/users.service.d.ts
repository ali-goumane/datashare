import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
export declare class UsersService {
    private readonly users;
    constructor(users: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(userId: number): Promise<User | null>;
    create(email: string, password: string): Promise<User>;
}
