import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}
  private publicUser(user: { userId: number; email: string; createdAt: Date; updatedAt: Date }) {
    return { userId: user.userId, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt };
  }
  private response(user: { userId: number; email: string; createdAt: Date; updatedAt: Date }) {
    return { access_token: this.jwt.sign({ sub: user.userId, email: user.email }), user: this.publicUser(user) };
  }
  async register(dto: AuthDto) {
    if (await this.users.findByEmail(dto.email)) throw new ConflictException('Cet email est déjà utilisé');
    const user = await this.users.create(dto.email, await bcrypt.hash(dto.password, 10));
    return this.response(user);
  }
  async login(dto: AuthDto) {
    const user = await this.users.findByEmail(dto.email);
    const valid = await bcrypt.compare(dto.password, user?.password ?? '$2b$10$7EqJtq98hPqEX7fNZaFWoO5l3p2nM7Z1J8bY2pQ4sL8W5iE9aR0xK');
    if (!user || !valid) throw new UnauthorizedException('Identifiants invalides');
    return this.response(user);
  }
}
