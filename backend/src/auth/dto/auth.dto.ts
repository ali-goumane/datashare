import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AuthDto {
  @ApiProperty() @IsEmail({}, { message: 'Adresse email invalide' }) email: string;
  @ApiProperty() @IsString({ message: 'Le mot de passe est obligatoire' }) @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }) password: string;
}
