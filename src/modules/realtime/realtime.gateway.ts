import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

interface PlayerPosition {
    x: number;
    y: number;
    direction: string;
    isWalking: boolean;
}

interface PlayerState extends PlayerPosition {
    id: string;
    userId: string;
    userName: string;
    spaceId: string;
    isVideoOn: boolean;
    isAudioOn: boolean;
    isDancing: boolean;
    avatarConfig?: any;
    avatarUrl?: string; // or string | null. Frontend sends null to clear.
}

@Injectable()
@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for debugging
        credentials: true,
    },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Store active players per space
    private spacePlayers: Map<string, Map<string, PlayerState>> = new Map();

    // Map userId to socketId for WebRTC signaling
    private userSocketMap: Map<string, string> = new Map();

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);

        // Remove player from all spaces
        for (const [spaceId, players] of this.spacePlayers.entries()) {
            if (players.has(client.id)) {
                const player = players.get(client.id)!;
                players.delete(client.id);

                // Remove from userId mapping
                this.userSocketMap.delete(player.userId);

                // Notify others in the space
                this.server.to(spaceId).emit('player:left', {
                    playerId: client.id,
                    userId: player.userId,
                });

                console.log(`Player ${player.userName} left space ${spaceId}`);
            }
        }
    }

    @SubscribeMessage('player:join')
    handlePlayerJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; userId: string; userName: string; x: number; y: number },
    ) {
        const { spaceId, userId, userName, x, y } = data;

        // Join the space room
        client.join(spaceId);

        // Initialize space if it doesn't exist
        if (!this.spacePlayers.has(spaceId)) {
            this.spacePlayers.set(spaceId, new Map());
        }

        const players = this.spacePlayers.get(spaceId)!;

        // Create player state
        const playerState: PlayerState = {
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
        };

        players.set(client.id, playerState);

        // Map userId to socketId for WebRTC
        this.userSocketMap.set(userId, client.id);

        // Send existing players to the new player
        const existingPlayers = Array.from(players.values()).filter(p => p.id !== client.id);
        client.emit('players:list', existingPlayers);

        // Notify others about the new player
        client.to(spaceId).emit('player:joined', playerState);

        console.log(`✅ Player ${userName} joined space ${spaceId}. Total players in space: ${players.size}`);
        console.log(`📊 Players in space ${spaceId}:`, Array.from(players.values()).map(p => p.userName));

        return { success: true, playerId: client.id };
    }

    @SubscribeMessage('player:move')
    handlePlayerMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; x: number; y: number; direction: string; isWalking: boolean },
    ) {
        const { spaceId, x, y, direction, isWalking } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;
            player.x = x;
            player.y = y;
            player.direction = direction;
            player.isWalking = isWalking;

            // Broadcast to others in the space (include userId for proper filtering)
            client.to(spaceId).emit('player:moved', {
                playerId: client.id,
                userId: player.userId,
                userName: player.userName,
                x,
                y,
                direction,
                isWalking,
            });
        }
    }

    @SubscribeMessage('player:video-toggle')
    handleVideoToggle(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; isVideoOn: boolean },
    ) {
        const { spaceId, isVideoOn } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;
            player.isVideoOn = isVideoOn;

            client.to(spaceId).emit('player:video-changed', {
                playerId: client.id,
                userId: player.userId,
                isVideoOn,
            });
            console.log(`📹 Video ${isVideoOn ? 'ON' : 'OFF'} for ${player.userName}`);
        }
    }

    @SubscribeMessage('player:audio-toggle')
    handleAudioToggle(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; isAudioOn: boolean },
    ) {
        const { spaceId, isAudioOn } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;
            player.isAudioOn = isAudioOn;

            client.to(spaceId).emit('player:audio-changed', {
                playerId: client.id,
                userId: player.userId,
                isAudioOn,
            });
            console.log(`🎤 Audio ${isAudioOn ? 'ON' : 'OFF'} for ${player.userName}`);
        }
    }

    @SubscribeMessage('player:wave')
    handleWave(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; targetPlayerId: string },
    ) {
        const { spaceId, targetPlayerId } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;

            // Send wave notification to target player
            this.server.to(targetPlayerId).emit('player:waved', {
                fromPlayerId: client.id,
                fromUserName: player.userName,
            });
        }
    }

    @SubscribeMessage('player:dance')
    handleDance(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; isDancing: boolean },
    ) {
        const { spaceId, isDancing } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;
            player.isDancing = isDancing;

            client.to(spaceId).emit('player:dance-changed', {
                playerId: client.id,
                isDancing,
            });
        }
    }

    @SubscribeMessage('player:avatar-update')
    handleAvatarUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; config?: any; avatarUrl?: string | null },
    ) {
        const { spaceId, config, avatarUrl } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;

            const updates: any = {};
            if (config) {
                player.avatarConfig = config;
                updates.config = config;
            }
            if (avatarUrl !== undefined) {
                // Store string or undefined (if null)
                player.avatarUrl = avatarUrl === null ? undefined : avatarUrl;
                updates.avatarUrl = avatarUrl;
            }

            // Broadcast to others in the space
            client.to(spaceId).emit('player:avatar-update', {
                playerId: client.id,
                ...updates
            });
            console.log(`🎨 Avatar updated for ${player.userName}`);
        }
    }

    @SubscribeMessage('player:call')
    handleCall(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; targetPlayerId: string },
    ) {
        const { spaceId, targetPlayerId } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;

            // Send call request to target player
            this.server.to(targetPlayerId).emit('player:calling', {
                fromPlayerId: client.id,
                fromUserName: player.userName,
                fromUserId: player.userId,
            });
        }
    }

    @SubscribeMessage('webrtc:offer')
    handleWebRTCOffer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; targetUserId: string; offer: RTCSessionDescriptionInit },
    ) {
        console.log('🔷 Backend received webrtc:offer');
        console.log('🔷 From socket:', client.id);
        console.log('🔷 Target userId:', data.targetUserId);
        console.log('🔷 SpaceId:', data.spaceId);

        const { targetUserId, offer } = data;
        const players = this.spacePlayers.get(data.spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;
            console.log('🔷 Sender info - userId:', player.userId, 'userName:', player.userName);

            // Get target socket ID from userId
            const targetSocketId = this.userSocketMap.get(targetUserId);
            console.log('🔷 Target socket ID:', targetSocketId);
            console.log('🔷 UserSocketMap size:', this.userSocketMap.size);
            console.log('🔷 UserSocketMap entries:', Array.from(this.userSocketMap.entries()));

            if (targetSocketId) {
                // Forward offer to target user's socket
                this.server.to(targetSocketId).emit('webrtc:offer', {
                    fromUserId: player.userId,
                    offer,
                });
                console.log(`✅ Forwarded WebRTC offer from ${player.userId} to ${targetUserId} (socket: ${targetSocketId})`);
            } else {
                console.error(`❌ Target user ${targetUserId} not found in socket map!`);
            }
        } else {
            console.error('❌ Sender not found in players map');
        }
    }

    @SubscribeMessage('webrtc:answer')
    handleWebRTCAnswer(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; targetUserId: string; answer: RTCSessionDescriptionInit },
    ) {
        const { targetUserId, answer } = data;
        const players = this.spacePlayers.get(data.spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;

            // Get target socket ID from userId
            const targetSocketId = this.userSocketMap.get(targetUserId);
            if (targetSocketId) {
                // Forward answer to target user's socket
                this.server.to(targetSocketId).emit('webrtc:answer', {
                    fromUserId: player.userId,
                    answer,
                });
                console.log(`Forwarding WebRTC answer from ${player.userId} to ${targetUserId}`);
            }
        }
    }

    @SubscribeMessage('webrtc:ice-candidate')
    handleWebRTCIceCandidate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; targetUserId: string; candidate: RTCIceCandidateInit },
    ) {
        const { targetUserId, candidate } = data;
        const players = this.spacePlayers.get(data.spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;

            // Get target socket ID from userId
            const targetSocketId = this.userSocketMap.get(targetUserId);
            if (targetSocketId) {
                // Forward ICE candidate to target user's socket
                this.server.to(targetSocketId).emit('webrtc:ice-candidate', {
                    fromUserId: player.userId,
                    candidate,
                });
            }
        }
    }

    @SubscribeMessage('chat:message')
    handleChatMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; message: string },
    ) {
        const { spaceId, message } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const player = players.get(client.id)!;

            // Broadcast message to all players in the space
            this.server.to(spaceId).emit('chat:message', {
                userId: player.userId,
                userName: player.userName,
                message: message,
                timestamp: new Date().toISOString(),
            });

            console.log(`💬 Chat message in space ${spaceId} from ${player.userName}: ${message}`);
        }
    }

    @SubscribeMessage('chat:private')
    handlePrivateMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { spaceId: string; targetUserId: string; message: string },
    ) {
        const { spaceId, targetUserId, message } = data;
        const players = this.spacePlayers.get(spaceId);

        if (players && players.has(client.id)) {
            const senderPlayer = players.get(client.id)!;
            const targetSocketId = this.userSocketMap.get(targetUserId);

            if (targetSocketId) {
                // Send private message to target user only
                this.server.to(targetSocketId).emit('chat:private', {
                    fromUserId: senderPlayer.userId,
                    fromUserName: senderPlayer.userName,
                    message: message,
                    timestamp: new Date().toISOString(),
                });

                console.log(`🔒 Private message from ${senderPlayer.userName} to user ${targetUserId}: ${message}`);
            } else {
                console.log(`❌ Target user ${targetUserId} not found for private message`);
            }
        }
    }
}
