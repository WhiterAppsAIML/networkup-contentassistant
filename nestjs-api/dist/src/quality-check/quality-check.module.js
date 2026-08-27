"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityCheckModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_module_1 = require("../ai/ai.module");
const quality_check_service_1 = require("./quality-check.service");
const quality_check_controller_1 = require("./quality-check.controller");
let QualityCheckModule = class QualityCheckModule {
};
exports.QualityCheckModule = QualityCheckModule;
exports.QualityCheckModule = QualityCheckModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, ai_module_1.AiModule],
        controllers: [quality_check_controller_1.QualityCheckController],
        providers: [quality_check_service_1.QualityCheckService],
        exports: [quality_check_service_1.QualityCheckService],
    })
], QualityCheckModule);
//# sourceMappingURL=quality-check.module.js.map