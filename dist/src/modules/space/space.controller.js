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
exports.SpaceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const space_service_1 = require("./space.service");
const space_dto_1 = require("./dto/space.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let SpaceController = class SpaceController {
    spaceService;
    constructor(spaceService) {
        this.spaceService = spaceService;
    }
    async getSpaces(visibility, user) {
        return this.spaceService.getSpaces(user?.id, visibility);
    }
    async createSpace(user, createDto) {
        return this.spaceService.createSpace(user.id, createDto);
    }
    async getSpace(id) {
        return this.spaceService.getSpaceById(id);
    }
    async updateSpace(id, user, updateDto) {
        return this.spaceService.updateSpace(id, user.id, updateDto);
    }
    async deleteSpace(id, user) {
        return this.spaceService.deleteSpace(id, user.id);
    }
    async joinSpace(id, user) {
        return this.spaceService.joinSpace(id, user.id);
    }
    async leaveSpace(id, user) {
        return this.spaceService.leaveSpace(id, user.id);
    }
    async getMap(id) {
        return this.spaceService.getMap(id);
    }
    async updateMap(id, user, updateMapDto) {
        return this.spaceService.updateMap(id, user.id, updateMapDto);
    }
};
exports.SpaceController = SpaceController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of spaces' }),
    __param(0, (0, common_1.Query)('visibility')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "getSpaces", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new space' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, space_dto_1.CreateSpaceDto]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "createSpace", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get space by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "getSpace", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update space' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, space_dto_1.UpdateSpaceDto]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "updateSpace", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete space' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "deleteSpace", null);
__decorate([
    (0, common_1.Post)(':id/join'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Join a space' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "joinSpace", null);
__decorate([
    (0, common_1.Post)(':id/leave'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Leave a space' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "leaveSpace", null);
__decorate([
    (0, common_1.Get)(':id/map'),
    (0, swagger_1.ApiOperation)({ summary: 'Get space map' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "getMap", null);
__decorate([
    (0, common_1.Post)(':id/map'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update space map' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, space_dto_1.UpdateMapDto]),
    __metadata("design:returntype", Promise)
], SpaceController.prototype, "updateMap", null);
exports.SpaceController = SpaceController = __decorate([
    (0, swagger_1.ApiTags)('spaces'),
    (0, common_1.Controller)('spaces'),
    __metadata("design:paramtypes", [space_service_1.SpaceService])
], SpaceController);
//# sourceMappingURL=space.controller.js.map