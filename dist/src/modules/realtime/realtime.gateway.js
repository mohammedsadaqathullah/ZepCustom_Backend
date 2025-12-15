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
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let RealtimeGateway = class RealtimeGateway {
    server;
    spacePlayers = new Map();
    userSocketMap = new Map();
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        for (const [spaceId, players] of this.spacePlayers.entries()) {
            if (players.has(client.id)) {
                const player = players.get(client.id);
                players.delete(client.id);
                this.userSocketMap.delete(player.userId);
                this.server.to(spaceId).emit('player:left', {
                    playerId: client.id,
                    userId: player.userId,
                });
                console.log(`Player ${player.userName} left space ${spaceId}`);
            }
        }
    }
    handlePlayerJoin(client, data) {
        const { spaceId, userId, userName, x, y } = data;
        client.join(spaceId);
        if (!this.spacePlayers.has(spaceId)) {
            this.spacePlayers.set(spaceId, new Map());
        }
        const players = this.spacePlayers.get(spaceId);
        const playerState = {
            id: client.id,
            userId,
            userName,
            spaceId,
            x,
            y,
            direction: 'down',
            isWalking: false,
            isVideoOn: false,
            isAudioOn: false,
            isDancing: false,
            roomId: null
        };
        players.set(client.id, playerState);
        this.userSocketMap.set(userId, client.id);
        const existingPlayers = Array.from(players.values()).filter(p => p.id !== client.id);
        client.emit('players:list', existingPlayers);
        client.to(spaceId).emit('player:joined', playerState);
        console.log(`✅ Player ${userName} joined space ${spaceId}. Total players in space: ${players.size}`);
        console.log(`📊 Players in space ${spaceId}:`, Array.from(players.values()).map(p => p.userName));
        return { success: true, playerId: client.id };
    }
    handlePlayerMove(client, data) {
        const { spaceId, x, y, direction, isWalking, roomId, vehicleId } = data;
        if (vehicleId)
            console.log(`🚗 Backend received vehicleId: ${vehicleId} from ${client.id}`);
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            player.x = x;
            player.y = y;
            player.direction = direction;
            player.isWalking = isWalking;
            player.roomId = roomId || null;
            player.vehicleId = vehicleId || null;
            client.to(spaceId).emit('player:moved', {
                playerId: client.id,
                userId: player.userId,
                userName: player.userName,
                x,
                y,
                direction,
                isWalking,
                roomId: player.roomId,
                vehicleId: player.vehicleId
            });
        }
    }
    handleVideoToggle(client, data) {
        const { spaceId, isVideoOn } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            player.isVideoOn = isVideoOn;
            client.to(spaceId).emit('player:video-changed', {
                playerId: client.id,
                userId: player.userId,
                isVideoOn,
            });
            console.log(`📹 Video ${isVideoOn ? 'ON' : 'OFF'} for ${player.userName}`);
        }
    }
    handleAudioToggle(client, data) {
        const { spaceId, isAudioOn } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            player.isAudioOn = isAudioOn;
            client.to(spaceId).emit('player:audio-changed', {
                playerId: client.id,
                userId: player.userId,
                isAudioOn,
            });
            console.log(`🎤 Audio ${isAudioOn ? 'ON' : 'OFF'} for ${player.userName}`);
        }
    }
    handleWave(client, data) {
        const { spaceId, targetPlayerId } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            this.server.to(targetPlayerId).emit('player:waved', {
                fromPlayerId: client.id,
                fromUserName: player.userName,
            });
        }
    }
    handleDance(client, data) {
        const { spaceId, isDancing } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            player.isDancing = isDancing;
            client.to(spaceId).emit('player:dance-changed', {
                playerId: client.id,
                isDancing,
            });
        }
    }
    handleAvatarUpdate(client, data) {
        const { spaceId, config, avatarUrl } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            const updates = {};
            if (config) {
                player.avatarConfig = config;
                updates.config = config;
            }
            if (avatarUrl !== undefined) {
                player.avatarUrl = avatarUrl === null ? undefined : avatarUrl;
                updates.avatarUrl = avatarUrl;
            }
            client.to(spaceId).emit('player:avatar-update', {
                playerId: client.id,
                ...updates
            });
            console.log(`🎨 Avatar updated for ${player.userName}`);
        }
    }
    handleCall(client, data) {
        const { spaceId, targetPlayerId } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            this.server.to(targetPlayerId).emit('player:calling', {
                fromPlayerId: client.id,
                fromUserName: player.userName,
                fromUserId: player.userId,
            });
        }
    }
    handleWebRTCOffer(client, data) {
        console.log('🔷 Backend received webrtc:offer');
        console.log('🔷 From socket:', client.id);
        console.log('🔷 Target userId:', data.targetUserId);
        console.log('🔷 SpaceId:', data.spaceId);
        const { targetUserId, offer } = data;
        const players = this.spacePlayers.get(data.spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            console.log('🔷 Sender info - userId:', player.userId, 'userName:', player.userName);
            const targetSocketId = this.userSocketMap.get(targetUserId);
            console.log('🔷 Target socket ID:', targetSocketId);
            console.log('🔷 UserSocketMap size:', this.userSocketMap.size);
            console.log('🔷 UserSocketMap entries:', Array.from(this.userSocketMap.entries()));
            if (targetSocketId) {
                this.server.to(targetSocketId).emit('webrtc:offer', {
                    fromUserId: player.userId,
                    offer,
                });
                console.log(`✅ Forwarded WebRTC offer from ${player.userId} to ${targetUserId} (socket: ${targetSocketId})`);
            }
            else {
                console.error(`❌ Target user ${targetUserId} not found in socket map!`);
            }
        }
        else {
            console.error('❌ Sender not found in players map');
        }
    }
    handleWebRTCAnswer(client, data) {
        const { targetUserId, answer } = data;
        const players = this.spacePlayers.get(data.spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            const targetSocketId = this.userSocketMap.get(targetUserId);
            if (targetSocketId) {
                this.server.to(targetSocketId).emit('webrtc:answer', {
                    fromUserId: player.userId,
                    answer,
                });
                console.log(`Forwarding WebRTC answer from ${player.userId} to ${targetUserId}`);
            }
        }
    }
    handleWebRTCIceCandidate(client, data) {
        const { targetUserId, candidate } = data;
        const players = this.spacePlayers.get(data.spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            const targetSocketId = this.userSocketMap.get(targetUserId);
            if (targetSocketId) {
                this.server.to(targetSocketId).emit('webrtc:ice-candidate', {
                    fromUserId: player.userId,
                    candidate,
                });
            }
        }
    }
    handleChatMessage(client, data) {
        const { spaceId, message } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const player = players.get(client.id);
            this.server.to(spaceId).emit('chat:message', {
                userId: player.userId,
                userName: player.userName,
                message: message,
                timestamp: new Date().toISOString(),
            });
            console.log(`💬 Chat message in space ${spaceId} from ${player.userName}: ${message}`);
        }
    }
    handlePrivateMessage(client, data) {
        const { spaceId, targetUserId, message } = data;
        const players = this.spacePlayers.get(spaceId);
        if (players && players.has(client.id)) {
            const senderPlayer = players.get(client.id);
            const targetSocketId = this.userSocketMap.get(targetUserId);
            if (targetSocketId) {
                this.server.to(targetSocketId).emit('chat:private', {
                    fromUserId: senderPlayer.userId,
                    fromUserName: senderPlayer.userName,
                    message: message,
                    timestamp: new Date().toISOString(),
                });
                console.log(`🔒 Private message from ${senderPlayer.userName} to user ${targetUserId}: ${message}`);
            }
            else {
                console.log(`❌ Target user ${targetUserId} not found for private message`);
            }
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handlePlayerJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:move'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handlePlayerMove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:video-toggle'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleVideoToggle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:audio-toggle'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleAudioToggle", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:wave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleWave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:dance'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleDance", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:avatar-update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleAvatarUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('player:call'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleCall", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc:offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleWebRTCOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc:answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleWebRTCAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('webrtc:ice-candidate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleWebRTCIceCandidate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleChatMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat:private'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handlePrivateMessage", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            credentials: true,
        },
    })
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map