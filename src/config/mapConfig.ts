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

// Map dimensions - compact for better visibility
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1200;

// Room configurations
export const MAP_ROOMS: Room[] = [
    // Reception - Main entrance area (center bottom)
    {
        id: 'reception',
        name: 'Reception',
        type: 'reception',
        x: 1600,
        y: 1700,
        width: 640,
        height: 400,
        doors: [
            { id: 'reception-to-corridor', x: 1920, y: 1700, width: 80, height: 20, direction: 'north' },
            { id: 'reception-to-parking', x: 1600, y: 1920, width: 80, height: 20, direction: 'south' }
        ],
        furniture: [
            { id: 'reception-desk', type: 'desk', x: 1900, y: 1850, width: 120, height: 60, hasCollision: true },
            { id: 'reception-sofa1', type: 'sofa', x: 1650, y: 1800, width: 100, height: 60, hasCollision: true },
            { id: 'reception-sofa2', type: 'sofa', x: 1650, y: 1950, width: 100, height: 60, hasCollision: true },
            { id: 'reception-plant1', type: 'plant', x: 1780, y: 1750, width: 40, height: 40, hasCollision: true },
            { id: 'reception-plant2', type: 'plant', x: 2100, y: 1750, width: 40, height: 40, hasCollision: true }
        ],
        spawnPoints: [
            { x: 1920, y: 1900 }
        ]
    },

    // Parking/Driving Area (bottom)
    {
        id: 'parking',
        name: 'Parking Lot',
        type: 'parking',
        x: 1400,
        y: 2120,
        width: 1040,
        height: 400,
        doors: [
            { id: 'parking-to-reception', x: 1920, y: 2120, width: 80, height: 20, direction: 'north' }
        ],
        spawnPoints: [
            { x: 1800, y: 2300 }
        ]
    },

    // Admin Room (top center)
    {
        id: 'admin',
        name: 'Admin Office',
        type: 'admin',
        x: 1700,
        y: 100,
        width: 440,
        height: 340,
        doors: [
            { id: 'admin-to-corridor', x: 1920, y: 440, width: 80, height: 20, direction: 'south' }
        ],
        furniture: [
            { id: 'admin-desk', type: 'executive-desk', x: 1900, y: 200, width: 140, height: 80, hasCollision: true },
            { id: 'admin-chair', type: 'executive-chair', x: 1920, y: 220, width: 60, height: 60, hasCollision: false },
            { id: 'admin-bookshelf', type: 'bookshelf', x: 1750, y: 120, width: 100, height: 40, hasCollision: true },
            { id: 'admin-cabinet', type: 'cabinet', x: 2040, y: 120, width: 80, height: 40, hasCollision: true },
            { id: 'admin-sofa', type: 'executive-sofa', x: 1750, y: 350, width: 120, height: 60, hasCollision: true }
        ],
        spawnPoints: [{ x: 1920, y: 400 }]
    },

    // Conference Room (left side, middle)
    {
        id: 'conference',
        name: 'Conference Room',
        type: 'conference',
        x: 100,
        y: 800,
        width: 540,
        height: 440,
        doors: [
            { id: 'conference-to-corridor', x: 640, y: 1000, width: 20, height: 80, direction: 'east' }
        ],
        furniture: [
            { id: 'conference-table', type: 'conference-table', x: 280, y: 980, width: 240, height: 160, hasCollision: true },
            { id: 'conference-chair1', type: 'chair', x: 200, y: 980, width: 40, height: 40, hasCollision: true },
            { id: 'conference-chair2', type: 'chair', x: 200, y: 1080, width: 40, height: 40, hasCollision: true },
            { id: 'conference-chair3', type: 'chair', x: 540, y: 980, width: 40, height: 40, hasCollision: true },
            { id: 'conference-chair4', type: 'chair', x: 540, y: 1080, width: 40, height: 40, hasCollision: true },
            { id: 'conference-whiteboard', type: 'whiteboard', x: 150, y: 860, width: 120, height: 60, hasCollision: true },
            { id: 'conference-projector', type: 'projector', x: 500, y: 860, width: 80, height: 40, hasCollision: true }
        ],
        spawnPoints: [{ x: 400, y: 1100 }]
    },

    // Meeting Room (right side, middle)
    {
        id: 'meeting',
        name: 'Meeting Room',
        type: 'meeting',
        x: 3200,
        y: 900,
        width: 440,
        height: 340,
        doors: [
            { id: 'meeting-to-corridor', x: 3200, y: 1050, width: 20, height: 80, direction: 'west' }
        ],
        furniture: [
            { id: 'meeting-table', type: 'meeting-table', x: 3360, y: 1020, width: 180, height: 120, hasCollision: true },
            { id: 'meeting-chair1', type: 'chair', x: 3300, y: 1040, width: 40, height: 40, hasCollision: true },
            { id: 'meeting-chair2', type: 'chair', x: 3560, y: 1040, width: 40, height: 40, hasCollision: true },
            { id: 'meeting-whiteboard', type: 'whiteboard', x: 3260, y: 940, width: 100, height: 50, hasCollision: true }
        ],
        spawnPoints: [{ x: 3400, y: 1100 }]
    },

    // Garden/Relaxation Area (top right)
    {
        id: 'garden',
        name: 'Garden',
        type: 'garden',
        x: 2800,
        y: 100,
        width: 840,
        height: 540,
        doors: [
            { id: 'garden-to-corridor', x: 2800, y: 400, width: 20, height: 80, direction: 'west' }
        ],
        furniture: [
            { id: 'garden-bench1', type: 'bench', x: 2900, y: 200, width: 100, height: 50, hasCollision: true },
            { id: 'garden-bench2', type: 'bench', x: 3200, y: 300, width: 100, height: 50, hasCollision: true },
            { id: 'garden-bench3', type: 'bench', x: 3500, y: 200, width: 100, height: 50, hasCollision: true },
            { id: 'garden-tree1', type: 'tree', x: 2950, y: 400, width: 80, height: 80, hasCollision: true },
            { id: 'garden-tree2', type: 'tree', x: 3300, y: 450, width: 80, height: 80, hasCollision: true },
            { id: 'garden-tree3', type: 'tree', x: 3550, y: 380, width: 80, height: 80, hasCollision: true },
            { id: 'garden-fountain', type: 'fountain', x: 3200, y: 520, width: 100, height: 100, hasCollision: true },
            { id: 'garden-flowerbed1', type: 'flowers', x: 2850, y: 550, width: 120, height: 60, hasCollision: false },
            { id: 'garden-flowerbed2', type: 'flowers', x: 3450, y: 550, width: 120, height: 60, hasCollision: false }
        ],
        spawnPoints: [{ x: 3200, y: 400 }]
    },

    // 12 Staff Rooms (3 rows of 4, left side)
    ...Array.from({ length: 12 }, (_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const roomX = 100 + (col * 290);
        const roomY = 100 + (row * 230);

        return {
            id: `staff-${i + 1}`,
            name: `Staff Room ${i + 1}`,
            type: 'staff' as const,
            x: roomX,
            y: roomY,
            width: 270,
            height: 210,
            doors: [
                {
                    id: `staff-${i + 1}-door`,
                    x: roomX + 250,
                    y: roomY + 100,
                    width: 20,
                    height: 60,
                    direction: 'east' as const
                }
            ],
            furniture: [
                { id: `staff-${i + 1}-desk`, type: 'desk', x: roomX + 80, y: roomY + 80, width: 100, height: 60, hasCollision: true },
                { id: `staff-${i + 1}-chair`, type: 'chair', x: roomX + 110, y: roomY + 90, width: 40, height: 40, hasCollision: false },
                { id: `staff-${i + 1}-cabinet`, type: 'cabinet', x: roomX + 30, y: roomY + 30, width: 60, height: 40, hasCollision: true },
                { id: `staff-${i + 1}-plant`, type: 'plant', x: roomX + 220, y: roomY + 30, width: 30, height: 30, hasCollision: true }
            ],
            spawnPoints: [{ x: roomX + 135, y: roomY + 130 }]
        };
    })
];

// Vehicles for parking area
export const VEHICLES: Vehicle[] = [
    { id: 'car-1', type: 'car', x: 1500, y: 2200, width: 120, height: 180 },
    { id: 'car-2', type: 'car', x: 1700, y: 2200, width: 120, height: 180 },
    { id: 'car-3', type: 'car', x: 1900, y: 2200, width: 120, height: 180 },
    { id: 'bike-1', type: 'bike', x: 2100, y: 2250, width: 60, height: 90 },
    { id: 'bike-2', type: 'bike', x: 2200, y: 2250, width: 60, height: 90 },
    { id: 'bike-3', type: 'bike', x: 2300, y: 2250, width: 60, height: 90 }
];

export const MAP_CONFIG = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    rooms: MAP_ROOMS,
    vehicles: VEHICLES
};
