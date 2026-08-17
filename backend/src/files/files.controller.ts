import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';
import type { Request, Response } from 'express';
import { FilesService } from './files.service';
import { UploadDto } from './dto/upload.dto';
import { DownloadDto } from './dto/download.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

const uploadOptions = {
  limits: { fileSize: 1073741824 },
  storage: diskStorage({
    destination: async (_request: Request, _file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
      const directory = process.env.STORAGE_PATH ?? join(process.cwd(), 'storage');
      await mkdir(directory, { recursive: true });
      callback(null, directory);
    },
    filename: (_request: Request, _file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => callback(null, uuid()),
  }),
  fileFilter: (_request: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
    callback(null, !['.exe', '.bat', '.cmd', '.sh', '.msi', '.com', '.scr', '.ps1'].includes(extension));
  },
};

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, password: { type: 'string' }, expireDays: { type: 'integer' }, tags: { type: 'string' } }, required: ['file'] } })
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  upload(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadDto, @Req() request: Request & { user?: { userId: number } }) {
    return this.files.upload(file, dto, request.user?.userId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  history(@Req() request: Request & { user: { userId: number } }) { return this.files.history(request.user.userId); }

  @Get('token/:token') metadata(@Param('token') token: string) { return this.files.metadata(token); }

  @Post('token/:token/download')
  download(@Param('token') token: string, @Body() dto: DownloadDto, @Res() response: Response) {
    return this.files.download(token, dto.password).then(({ file, physical }) => {
      response.setHeader('Content-Type', file.type || 'application/octet-stream');
      response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"; filename*=UTF-8''${encodeURIComponent(file.name)}`);
      return response.sendFile(physical);
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() request: Request & { user: { userId: number } }) {
    const fileId = Number(id);
    if (!Number.isInteger(fileId)) throw new BadRequestException('Identifiant de fichier invalide');
    return this.files.remove(fileId, request.user.userId);
  }
}
