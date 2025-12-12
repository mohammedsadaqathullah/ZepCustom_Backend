export interface JwtPayload {
    sub: string;
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
