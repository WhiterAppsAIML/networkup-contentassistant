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
exports.HooksListQueryDto = exports.ContentListQueryDto = exports.HookCategoryEnum = exports.ContentStatusEnum = void 0;
const class_validator_1 = require("class-validator");
var ContentStatusEnum;
(function (ContentStatusEnum) {
    ContentStatusEnum["DRAFT"] = "DRAFT";
    ContentStatusEnum["ANGLES_GENERATED"] = "ANGLES_GENERATED";
    ContentStatusEnum["HOOKS_GENERATED"] = "HOOKS_GENERATED";
    ContentStatusEnum["HOOK_SELECTED"] = "HOOK_SELECTED";
    ContentStatusEnum["CONTENT_GENERATED"] = "CONTENT_GENERATED";
    ContentStatusEnum["IMPROVED"] = "IMPROVED";
    ContentStatusEnum["PUBLISHED"] = "PUBLISHED";
    ContentStatusEnum["ARCHIVED"] = "ARCHIVED";
})(ContentStatusEnum || (exports.ContentStatusEnum = ContentStatusEnum = {}));
var HookCategoryEnum;
(function (HookCategoryEnum) {
    HookCategoryEnum["CURIOSITY"] = "CURIOSITY";
    HookCategoryEnum["CONTRARIAN"] = "CONTRARIAN";
    HookCategoryEnum["STORY"] = "STORY";
    HookCategoryEnum["QUESTION"] = "QUESTION";
})(HookCategoryEnum || (exports.HookCategoryEnum = HookCategoryEnum = {}));
class ContentListQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.ContentListQueryDto = ContentListQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ContentStatusEnum),
    __metadata("design:type", String)
], ContentListQueryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ContentListQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ContentListQueryDto.prototype, "limit", void 0);
class HooksListQueryDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
    }
}
exports.HooksListQueryDto = HooksListQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(HookCategoryEnum),
    __metadata("design:type", String)
], HooksListQueryDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], HooksListQueryDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], HooksListQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=library.dto.js.map