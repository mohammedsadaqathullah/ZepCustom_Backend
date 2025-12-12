import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtPayload, TokenPair, AuthenticatedUser } from './types/auth.types';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<TokenPair> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                displayName: registerDto.displayName,
                password: passwordHash,
                avatarUrl: registerDto.avatarUrl,
            },
        });

        return this.generateTokenPair(user.id, user.email);
    }

    async login(loginDto: LoginDto): Promise<TokenPair> {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokenPair(user.id, user.email);
    }

    async refreshToken(refreshToken: string): Promise<TokenPair> {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });

            const session = await this.prisma.session.findUnique({
                where: { refreshToken },
            });

            if (!session || session.expiresAt < new Date()) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            // Delete old session
            await this.prisma.session.delete({ where: { id: session.id } });

            // Generate new token pair
            return this.generateTokenPair(payload.sub, payload.email);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refreshToken: string): Promise<void> {
        await this.prisma.session.deleteMany({
            where: { refreshToken },
        });
    }

    async validateUser(payload: JwtPayload): Promise<AuthenticatedUser> {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl ?? undefined,
            role: user.role,
        };
    }

    private async generateTokenPair(userId: string, email: string): Promise<TokenPair> {
        const payload: JwtPayload = { sub: userId, email };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET') || 'default-secret',
            expiresIn: '15m',
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret',
            expiresIn: '7d',
        });

        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await this.prisma.session.create({
            data: {
                userId,
                refreshToken,
                expiresAt,
            },
        });

        return { accessToken, refreshToken };
    }
}
