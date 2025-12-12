import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtPayload, TokenPair, AuthenticatedUser } from './types/auth.types';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<TokenPair>;
    login(loginDto: LoginDto): Promise<TokenPair>;
    refreshToken(refreshToken: string): Promise<TokenPair>;
    logout(refreshToken: string): Promise<void>;
    validateUser(payload: JwtPayload): Promise<AuthenticatedUser>;
    private generateTokenPair;
}
