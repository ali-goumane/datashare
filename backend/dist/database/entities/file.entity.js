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
exports.FileEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const tag_entity_1 = require("./tag.entity");
let FileEntity = class FileEntity {
    fileId;
    token;
    name;
    type;
    size;
    path;
    accessPassword;
    uploadedAt;
    expireAt;
    userId;
    user;
    tags;
};
exports.FileEntity = FileEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'file_id' }),
    __metadata("design:type", Number)
], FileEntity.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], FileEntity.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], FileEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'access_password', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "accessPassword", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'uploaded_at', type: 'timestamptz' }),
    __metadata("design:type", Date)
], FileEntity.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expire_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "expireAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], FileEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.files, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", Object)
], FileEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => tag_entity_1.Tag, (tag) => tag.files),
    (0, typeorm_1.JoinTable)({ name: 'file_tag', joinColumn: { name: 'file_id', referencedColumnName: 'fileId' }, inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'tagId' } }),
    __metadata("design:type", Array)
], FileEntity.prototype, "tags", void 0);
exports.FileEntity = FileEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'file' })
], FileEntity);
//# sourceMappingURL=file.entity.js.map