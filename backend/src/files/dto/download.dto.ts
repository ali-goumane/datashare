import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class DownloadDto { @ApiPropertyOptional() @IsOptional() @IsString() password?: string; }
