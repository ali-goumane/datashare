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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UploadDto {
    password;
    expireDays;
    tags;
}
exports.UploadDto = UploadDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Le mot de passe du lien doit contenir au moins 6 caractères' }),
    __metadata("design:type", String)
], UploadDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === '' ? undefined : Number(value)),
    (0, class_validator_1.IsInt)({ message: 'La durée doit être un nombre entier' }),
    (0, class_validator_1.Min)(1, { message: 'La durée minimale est de 1 jour' }),
    (0, class_validator_1.Max)(7, { message: 'La durée maximale est de 7 jours' }),
    __metadata("design:type", Number)
], UploadDto.prototype, "expireDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tags séparés par des virgules' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDto.prototype, "tags", void 0);
//# sourceMappingURL=upload.dto.js.map