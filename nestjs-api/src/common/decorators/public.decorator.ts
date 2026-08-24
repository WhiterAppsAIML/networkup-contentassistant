import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Public = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return true;
  },
);