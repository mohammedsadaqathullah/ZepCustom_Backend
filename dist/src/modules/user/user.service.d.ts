import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    updateProfile(userId: string, updateDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    getUserById(userId: string): Promise<{
        id: string;
        displayName: string;
        avatarUrl: string | null;
    } | null>;
}
