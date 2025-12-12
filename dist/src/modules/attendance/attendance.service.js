"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkIn(userId, spaceId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
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
        return this.prisma.attendance.create({
            data: {
                userId,
                spaceId,
                date: today,
            },
        });
    }
    async checkOut(userId, spaceId) {
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
        const duration = Math.floor((checkOutTime.getTime() - attendance.checkInTime.getTime()) / 1000 / 60);
        return this.prisma.attendance.update({
            where: { id: attendance.id },
            data: {
                checkOutTime,
                duration,
            },
        });
    }
    async getUserAttendance(userId, startDate, endDate) {
        const where = { userId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
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
    async getSpaceAttendance(spaceId, startDate, endDate) {
        const where = { spaceId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
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
    async getAttendanceStats(userId, month) {
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
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map