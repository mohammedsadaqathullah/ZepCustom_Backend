import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async checkIn(userId: string, spaceId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        const existing = await this.prisma.attendance.findUnique({
            where: {
                userId_spaceId_date: {
                    userId,
                    spaceId,
                    date: today,
                },
            },
        });

        if (existing) {
            return existing;
        }

        // Create new attendance record
        return this.prisma.attendance.create({
            data: {
                userId,
                spaceId,
                date: today,
            },
        });
    }

    async checkOut(userId: string, spaceId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await this.prisma.attendance.findUnique({
            where: {
                userId_spaceId_date: {
                    userId,
                    spaceId,
                    date: today,
                },
            },
        });

        if (!attendance || attendance.checkOutTime) {
            return attendance;
        }

        const checkOutTime = new Date();
        const duration = Math.floor(
            (checkOutTime.getTime() - attendance.checkInTime.getTime()) / 1000 / 60
        );

        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOutTime,
                duration,
            },
        });
    }

    async getUserAttendance(userId: string, startDate?: Date, endDate?: Date) {
        const where: any = { userId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }

        return this.prisma.attendance.findMany({
            where,
            include: {
                space: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    async getSpaceAttendance(spaceId: string, startDate?: Date, endDate?: Date) {
        const where: any = { spaceId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = startDate;
            if (endDate) where.date.lte = endDate;
        }

        return this.prisma.attendance.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
    }

    async getAttendanceStats(userId: string, month: string) {
        // month format: '2024-01'
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);

        const records = await this.getUserAttendance(userId, startDate, endDate);

        const totalDays = records.length;
        const totalMinutes = records.reduce((sum, r) => sum + (r.duration || 0), 0);
        const avgMinutesPerDay = totalDays > 0 ? totalMinutes / totalDays : 0;

        return {
            month,
            totalDays,
            totalHours: Math.floor(totalMinutes / 60),
            totalMinutes,
            avgHoursPerDay: Math.floor(avgMinutesPerDay / 60),
            avgMinutesPerDay: Math.floor(avgMinutesPerDay),
            records,
        };
    }
}
