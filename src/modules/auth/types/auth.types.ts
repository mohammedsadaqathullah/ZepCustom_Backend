export interface JwtPayload {
    sub: string; // user id
    email: string;
    iat?: number;
    exp?: number;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    role: string;
}
