import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                avatarConfig: true, // Added
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateProfile(userId: string, updateDto: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: updateDto,
            select: {
                id: true,
                email: true,
                displayName: true,
                avatarUrl: true,
                avatarConfig: true, // Added
                role: true,
                createdAt: true,
            },
        });
    }

    async getUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                displayName: true,
                avatarUrl: true,
            },
        });
    }
}
