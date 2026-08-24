"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = void 0;
const common_1 = require("@nestjs/common");
exports.Public = (0, common_1.createParamDecorator)((data, ctx) => {
    return true;
});
//# sourceMappingURL=public.decorator.js.map