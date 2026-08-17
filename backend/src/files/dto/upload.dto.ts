import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(6, { message: 'Le mot de passe du lien doit contenir au moins 6 caractères' }) password?: string;
  @ApiPropertyOptional({ default: 7 }) @IsOptional() @Transform(({ value }) => value === '' ? undefined : Number(value)) @IsInt({ message: 'La durée doit être un nombre entier' }) @Min(1, { message: 'La durée minimale est de 1 jour' }) @Max(7, { message: 'La durée maximale est de 7 jours' }) expireDays?: number;
  @ApiPropertyOptional({ description: 'Tags séparés par des virgules' }) @IsOptional() @IsString() tags?: string;
}
