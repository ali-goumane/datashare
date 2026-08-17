"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const user_entity_1 = require("./database/entities/user.entity");
const file_entity_1 = require("./database/entities/file.entity");
const tag_entity_1 = require("./database/entities/tag.entity");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const files_module_1 = require("./files/files.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres', host: config.get('DB_HOST', 'localhost'), port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USER', 'postgres'), password: config.get('DB_PASSWORD', ''),
                    database: config.get('DB_NAME', 'datashare'), entities: [user_entity_1.User, file_entity_1.FileEntity, tag_entity_1.Tag], synchronize: false,
                }),
            }),
            schedule_1.ScheduleModule.forRoot(), throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]), auth_module_1.AuthModule, users_module_1.UsersModule, files_module_1.FilesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map