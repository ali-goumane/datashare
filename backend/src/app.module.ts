import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from './database/entities/user.entity';
import { FileEntity } from './database/entities/file.entity';
import { Tag } from './database/entities/tag.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', host: config.get<string>('DB_HOST', 'localhost'), port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'postgres'), password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'datashare'), entities: [User, FileEntity, Tag], synchronize: false,
      }),
    }),
    ScheduleModule.forRoot(), ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]), AuthModule, UsersModule, FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
