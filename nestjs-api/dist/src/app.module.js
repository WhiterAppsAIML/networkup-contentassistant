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
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const vector_module_1 = require("./vector/vector.module");
const ai_module_1 = require("./ai/ai.module");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const content_module_1 = require("./content/content.module");
const lead_magnet_module_1 = require("./lead-magnet/lead-magnet.module");
const library_module_1 = require("./library/library.module");
const schedule_module_1 = require("./schedule/schedule.module");
const framework_module_1 = require("./framework/framework.module");
const cta_module_1 = require("./cta/cta.module");
const rag_module_1 = require("./rag/rag.module");
const quality_check_module_1 = require("./quality-check/quality-check.module");
const tier_rate_limit_guard_1 = require("./common/guards/tier-rate-limit.guard");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                cache: true,
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 100,
                    },
                ],
            }),
            prisma_module_1.PrismaModule,
            vector_module_1.VectorModule,
            ai_module_1.AiModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            content_module_1.ContentModule,
            lead_magnet_module_1.LeadMagnetModule,
            library_module_1.LibraryModule,
            schedule_module_1.ScheduleModule,
            framework_module_1.FrameworkModule,
            cta_module_1.CtaModule,
            rag_module_1.RagModule,
            quality_check_module_1.QualityCheckModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: tier_rate_limit_guard_1.TierRateLimitGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map