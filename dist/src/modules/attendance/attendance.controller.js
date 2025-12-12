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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attendance_service_1 = require("./attendance.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async checkIn(user, spaceId) {
        return this.attendanceService.checkIn(user.id, spaceId);
    }
    async checkOut(user, spaceId) {
        return this.attendanceService.checkOut(user.id, spaceId);
    }
    async getMyAttendance(user, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getUserAttendance(user.id, start, end);
    }
    async getMyStats(user, month) {
        return this.attendanceService.getAttendanceStats(user.id, month);
    }
    async getSpaceAttendance(spaceId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.attendanceService.getSpaceAttendance(spaceId, start, end);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('check-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Check in to a space' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('check-out'),
    (0, swagger_1.ApiOperation)({ summary: 'Check out from a space' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "checkOut", null);
__decorate([
    (0, common_1.Get)('my-attendance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my attendance records' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyAttendance", null);
__decorate([
    (0, common_1.Get)('my-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my attendance statistics for a month' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('space/:spaceId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance for a space' }),
    __param(0, (0, common_1.Param)('spaceId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getSpaceAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('attendance'),
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map