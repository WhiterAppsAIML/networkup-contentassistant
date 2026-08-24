"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const framework_service_1 = require("./framework.service");
const framework_controller_1 = require("./framework.controller");
let FrameworkModule = class FrameworkModule {
};
exports.FrameworkModule = FrameworkModule;
exports.FrameworkModule = FrameworkModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [framework_controller_1.FrameworkController],
        providers: [framework_service_1.FrameworkService],
        exports: [framework_service_1.FrameworkService],
    })
], FrameworkModule);
//# sourceMappingURL=framework.module.js.map