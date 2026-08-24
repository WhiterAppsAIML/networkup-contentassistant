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
exports.GeneratedContentDto = exports.HookResponseDto = exports.AngleResponseDto = exports.ContentQueryDto = exports.ImproveContentDto = exports.SelectHookDto = exports.SelectAngleDto = exports.CreateContentDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateContentDto {
}
exports.CreateContentDto = CreateContentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "contentGoal", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "postType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "topic", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "audience", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "experienceNotes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "tone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateContentDto.prototype, "cta", void 0);
class SelectAngleDto {
}
exports.SelectAngleDto = SelectAngleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SelectAngleDto.prototype, "angleId", void 0);
class SelectHookDto {
}
exports.SelectHookDto = SelectHookDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SelectHookDto.prototype, "hookId", void 0);
class ImproveContentDto {
}
exports.ImproveContentDto = ImproveContentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImproveContentDto.prototype, "action", void 0);
class ContentQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.ContentQueryDto = ContentQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ContentStatus),
    __metadata("design:type", String)
], ContentQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ContentQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ContentQueryDto.prototype, "limit", void 0);
class AngleResponseDto {
}
exports.AngleResponseDto = AngleResponseDto;
class HookResponseDto {
}
exports.HookResponseDto = HookResponseDto;
class GeneratedContentDto {
}
exports.GeneratedContentDto = GeneratedContentDto;
//# sourceMappingURL=content.dto.js.map