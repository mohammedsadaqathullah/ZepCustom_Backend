import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { AuthenticatedUser } from '../auth/types/auth.types';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: AuthenticatedUser): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
    updateMe(user: AuthenticatedUser, updateDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        displayName: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
    }>;
}
