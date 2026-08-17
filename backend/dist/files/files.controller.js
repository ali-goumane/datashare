"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const uuid_1 = require("uuid");
const files_service_1 = require("./files.service");
const upload_dto_1 = require("./dto/upload.dto");
const download_dto_1 = require("./dto/download.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const uploadOptions = {
    limits: { fileSize: 1073741824 },
    storage: (0, multer_1.diskStorage)({
        destination: async (_request, _file, callback) => {
            const directory = process.env.STORAGE_PATH ?? (0, path_1.join)(process.cwd(), 'storage');
            await (0, promises_1.mkdir)(directory, { recursive: true });
            callback(null, directory);
        },
        filename: (_request, _file, callback) => callback(null, (0, uuid_1.v4)()),
    }),
    fileFilter: (_request, file, callback) => {
        const extension = file.originalname.slice(file.originalname.lastIndexOf('.')).toLowerCase();
        callback(null, !['.exe', '.bat', '.cmd', '.sh', '.msi', '.com', '.scr', '.ps1'].includes(extension));
    },
};
let FilesController = class FilesController {
    files;
    constructor(files) {
        this.files = files;
    }
    upload(file, dto, request) {
        return this.files.upload(file, dto, request.user?.userId);
    }
    history(request) { return this.files.history(request.user.userId); }
    metadata(token) { return this.files.metadata(token); }
    download(token, dto, response) {
        return this.files.download(token, dto.password).then(({ file, physical }) => {
            response.setHeader('Content-Type', file.type || 'application/octet-stream');
            response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"; filename*=UTF-8''${encodeURIComponent(file.name)}`);
            return response.sendFile(physical);
        });
    }
    remove(id, request) {
        const fileId = Number(id);
        if (!Number.isInteger(fileId))
            throw new common_1.BadRequestException('Identifiant de fichier invalide');
        return this.files.remove(fileId, request.user.userId);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, password: { type: 'string' }, expireDays: { type: 'integer' }, tags: { type: 'string' } }, required: ['file'] } }),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', uploadOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_dto_1.UploadDto, Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "history", null);
__decorate([
    (0, common_1.Get)('token/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "metadata", null);
__decorate([
    (0, common_1.Post)('token/:token/download'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, download_dto_1.DownloadDto, Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "download", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "remove", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)('files'),
    (0, common_1.Controller)('files'),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map