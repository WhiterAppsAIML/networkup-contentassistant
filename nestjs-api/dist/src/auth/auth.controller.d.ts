import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            tier: import("@prisma/client").$Enums.UserTier;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            tier: import("@prisma/client").$Enums.UserTier;
            createdAt: Date;
        };
    }>;
    me(user: any): Promise<any>;
    refresh(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
