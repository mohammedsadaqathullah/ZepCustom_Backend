export interface Room {
    id: string;
    name: string;
    type: 'reception' | 'staff' | 'meeting' | 'conference' | 'admin' | 'garden' | 'parking';
    x: number;
    y: number;
    width: number;
    height: number;
    doors: Door[];
    furniture?: Furniture[];
    spawnPoints?: SpawnPoint[];
}
export interface Door {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    targetRoomId?: string;
    direction: 'north' | 'south' | 'east' | 'west';
}
export interface Furniture {
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    hasCollision: boolean;
}
export interface SpawnPoint {
    x: number;
    y: number;
}
export interface Vehicle {
    id: string;
    type: 'car' | 'bike';
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare const MAP_ROOMS: Room[];
export declare const VEHICLES: Vehicle[];
export declare const MAP_CONFIG: {
    width: number;
    height: number;
    rooms: Room[];
    vehicles: Vehicle[];
};
