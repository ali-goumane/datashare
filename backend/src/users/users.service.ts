import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}
  findByEmail(email: string) { return this.users.findOne({ where: { email: email.toLowerCase() } }); }
  findById(userId: number) { return this.users.findOne({ where: { userId } }); }
  create(email: string, password: string) { return this.users.save(this.users.create({ email: email.toLowerCase(), password })); }
}
