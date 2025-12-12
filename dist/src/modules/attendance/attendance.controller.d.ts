import { AttendanceService } from './attendance.service';
import type { AuthenticatedUser } from '../auth/types/auth.types';
export declare class AttendanceController {
    private attendanceService;
    constructor(attendanceService: AttendanceService);
    checkIn(user: AuthenticatedUser, spaceId: string): Promise<{
        id: string;
        userId: string;
        spaceId: string;
        checkInTime: Date;
        checkOutTime: Date | null;
        duration: number | null;
        date: Date;
    }>;
    checkOut(user: AuthenticatedUser, spaceId: string): Promise<{
        id: string;
        userId: string;
        spaceId: string;
        checkInTime: Date;
        checkOutTime: Date | null;
        duration: number | null;
        date: Date;
    } | null>;
    getMyAttendance(user: AuthenticatedUser, startDate?: string, endDate?: string): Promise<({
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
    getMyStats(user: AuthenticatedUser, month: string): Promise<{
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
    getSpaceAttendance(spaceId: string, startDate?: string, endDate?: string): Promise<({
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
}
