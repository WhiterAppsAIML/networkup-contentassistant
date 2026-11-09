import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserTier } from '../common/decorators/require-tier.decorator';
import { verifyFirebaseToken, mapFirebaseTierToBackend } from './firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async verifyFirebaseToken(idToken: string) {
    if (!idToken) {
      throw new BadRequestException('idToken required');
    }

    const decoded = await verifyFirebaseToken(idToken);
    const firebaseUid = decoded.uid;
    const email = decoded.email;

    if (!email) {
      throw new UnauthorizedException('Email not found in Firebase token');
    }

    const firebaseTier = decoded.tier;
    const backendTier = mapFirebaseTierToBackend(firebaseTier);

    const user = await this.prisma.user.upsert({
      where: { firebaseUid },
      create: {
        firebaseUid,
        email,
        tier: backendTier,
      },
      update: {
        email,
        tier: backendTier,
      },
      select: { id: true, email: true, tier: true, createdAt: true, firebaseUid: true },
    });

    const accessToken = this.generateAccessToken(user.firebaseUid, user.tier as UserTier);

    return { accessToken, user };
  }

  private generateAccessToken(firebaseUid: string, tier: UserTier): string {
    return this.jwtService.sign(
      { sub: firebaseUid, tier },
      { expiresIn: '15m', secret: this.configService.get('JWT_SECRET') }
    );
  }

  async validateUser(firebaseUid: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: firebaseUid },
      select: { id: true, email: true, tier: true, firebaseUid: true },
    });
    return user;
  }
}