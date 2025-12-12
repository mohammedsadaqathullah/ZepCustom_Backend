import { PrismaService } from '../../prisma/prisma.service';
export declare class AttendanceService {
    private prisma;
    constructor(prisma: PrismaService);
    checkIn(userId: string, spaceId: string): Promise<{
        id: string;
        userId: string;
        spaceId: string;
        checkInTime: Date;
        checkOutTime: Date | null;
        duration: number | null;
        date: Date;
    }>;
    checkOut(userId: string, spaceId: string): Promise<{
        id: string;
        userId: string;
        spaceId: string;
        checkInTime: Date;
        checkOutTime: Date | null;
        duration: number | null;
        date: Date;
    } | null>;
    getUserAttendance(userId: string, startDate?: Date, endDate?: Date): Promise<({
        space: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        spaceId: string;
        checkInTime: Date;
        checkOutTime: Date | null;
        duration: number | null;
        date: Date;
    })[]>;
    getSpaceAttendance(spaceId: string, startDate?: Date, endDate?: Date): Promise<({
        user: {
            id: string;
            email: string;
            displayName: string;
        };
    } & {
        id: string;
        userId: string;
        spaceId: string;
        checkInTime: Date;
        checkOutTime: Date | null;
        duration: number | null;
        date: Date;
    })[]>;
    getAttendanceStats(userId: string, month: string): Promise<{
        month: string;
        totalDays: number;
        totalHours: number;
        totalMinutes: number;
        avgHoursPerDay: number;
        avgMinutesPerDay: number;
        records: ({
            space: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            userId: string;
            spaceId: string;
            checkInTime: Date;
            checkOutTime: Date | null;
            duration: number | null;
            date: Date;
        })[];
    }>;
}
