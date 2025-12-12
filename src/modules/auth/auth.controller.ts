import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered' })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async register(@Body() registerDto: RegisterDto) {
        const tokens = await this.authService.register(registerDto);
        return {
            message: 'Registration successful',
            ...tokens,
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        const tokens = await this.authService.login(loginDto);
        return {
            message: 'Login successful',
            ...tokens,
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        const tokens = await this.authService.refreshToken(refreshTokenDto.refreshToken);
        return {
            message: 'Token refreshed',
            ...tokens,
        };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and invalidate refresh token' })
    @ApiResponse({ status: 200, description: 'Logout successful' })
    async logout(@Body() refreshTokenDto: RefreshTokenDto) {
        await this.authService.logout(refreshTokenDto.refreshToken);
        return {
            message: 'Logout successful',
        };
    }
}
