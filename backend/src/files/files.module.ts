import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../database/entities/file.entity';
import { Tag } from '../database/entities/tag.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
@Module({ imports: [TypeOrmModule.forFeature([FileEntity, Tag])], controllers: [FilesController], providers: [FilesService] })
export class FilesModule {}
