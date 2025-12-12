import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private spacePlayers;
    private userSocketMap;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handlePlayerJoin(client: Socket, data: {
        spaceId: string;
        userId: string;
        userName: string;
        x: number;
        y: number;
    }): {
        success: boolean;
        playerId: string;
    };
    handlePlayerMove(client: Socket, data: {
        spaceId: string;
        x: number;
        y: number;
        direction: string;
        isWalking: boolean;
    }): void;
    handleVideoToggle(client: Socket, data: {
        spaceId: string;
        isVideoOn: boolean;
    }): void;
    handleAudioToggle(client: Socket, data: {
        spaceId: string;
        isAudioOn: boolean;
    }): void;
    handleWave(client: Socket, data: {
        spaceId: string;
        targetPlayerId: string;
    }): void;
    handleDance(client: Socket, data: {
        spaceId: string;
        isDancing: boolean;
    }): void;
    handleCall(client: Socket, data: {
        spaceId: string;
        targetPlayerId: string;
    }): void;
    handleWebRTCOffer(client: Socket, data: {
        spaceId: string;
        targetUserId: string;
        offer: RTCSessionDescriptionInit;
    }): void;
    handleWebRTCAnswer(client: Socket, data: {
        spaceId: string;
        targetUserId: string;
        answer: RTCSessionDescriptionInit;
    }): void;
    handleWebRTCIceCandidate(client: Socket, data: {
        spaceId: string;
        targetUserId: string;
        candidate: RTCIceCandidateInit;
    }): void;
    handleChatMessage(client: Socket, data: {
        spaceId: string;
        message: string;
    }): void;
    handlePrivateMessage(client: Socket, data: {
        spaceId: string;
        targetUserId: string;
        message: string;
    }): void;
}
