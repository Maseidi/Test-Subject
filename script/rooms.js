import { PC, Stash, VendingMachine } from "./interactables.js"
import { Bandage,
    Coin,
    HardDrive,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo,
    WeaponDrop } from "./drops.js"
import { 
    BottomLoader_FromLeft,
    BottomLoader_FromRight,
    LeftLoader_FromBottom,
    LeftLoader_FromTop,
    RightLoader_FromBottom,
    RightLoader_FromTop,
    TopLoader_FromLeft, 
    TopLoader_FromRight} from "./loaders.js"
import { 
    AbstractWall,
    Hor_BL_Wall,
    Hor_BR_Wall,
    Hor_TL_Wall,
    Hor_TR_Wall,
    Ver_BL_Wall,
    Ver_BR_Wall,
    Ver_TL_Wall,
    Ver_TR_Wall } from "./walls.js"

class Room {
    constructor(width, height, walls, loaders, interactables) {
        this.width = width
        this.height = height
        this.walls = walls
        this.loaders = loaders
        this.interactables = interactables
    }
}

export const rooms = new Map([
    ["room-1", 
        new Room(1100, 1100, [
            new Ver_TL_Wall(300, 0),
            new Ver_TL_Wall(300, 400),
            new Ver_BL_Wall(300, 0),
            new Ver_TR_Wall(300, 0),
            new Ver_TR_Wall(300, 400),
            new Ver_BR_Wall(300, 0),
            new Hor_TR_Wall(450, 0),
            new Hor_TL_Wall(450, 0),
            new Hor_BL_Wall(300, 0),
            new Hor_BL_Wall(300, 400),
            new Hor_BR_Wall(300, 0)
        ],[
            new RightLoader_FromTop("room-2", 100, 300),
            new RightLoader_FromBottom("room-3", 100, 300),
            new BottomLoader_FromRight("room-4", 100, 300),
            new BottomLoader_FromLeft("room-5", 100, 300),
            new LeftLoader_FromBottom("room-6", 100, 300),
            new LeftLoader_FromTop("room-7", 100, 300),
            new TopLoader_FromLeft("room-8", 200, 450),
        ],[
            new Coin(100, 100, 2),
            new Bandage(300, 300, 1),
            new HardDrive(500, 500, 3),
            new PC(700, 700),
            new Stash(900, 900),
            new WeaponDrop(700, 900, "remington1858", "remington 1858", 0, 1, 1, 1, 1, 1),
            new WeaponDrop(100, 900, "sniper", "sniper", 0, 1, 1, 1, 1, 1),
            new WeaponDrop(200, 950, "riotgun", "riotgun", 0, 1, 1, 1, 1, 1),
            new WeaponDrop(300, 1000, "mauser", "mauser", 0, 1, 1, 1, 1, 1),
            new PistolAmmo(200, 700, 10),
            new ShotgunShells(300, 800, 11),
            new SmgAmmo(200, 400, 10),
            new MagnumAmmo(500, 100, 1),
            new RifleAmmo(400, 100, 2),
            new VendingMachine(900, 100)
        ])
    ],
    ["room-2", 
        new Room(1000, 1000, [
            new AbstractWall(900, 900, 0, undefined, 0, undefined),
            new Hor_BL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0)
        ],[
            new LeftLoader_FromBottom("room-1", 100, 0),
            new TopLoader_FromRight("room-9", 100, 0)
        ],
        [])
    ],
    ["room-3", 
        new Room(1000, 1000, [
            new AbstractWall(900, 900, 0, undefined, undefined, 0),
            new Hor_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0)
        ], [
            new LeftLoader_FromTop("room-1", 100, 0),
            new BottomLoader_FromRight("room-10", 100, 0)
        ], 
        [])
    ],
    ["room-4", 
        new Room(100, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0)
        ],[
            new TopLoader_FromRight("room-1", 100, 0),
            new BottomLoader_FromRight("room-11", 100, 0)
        ], 
        [])
    ],
    ["room-5", 
        new Room(1000, 1000, [
            new Ver_TR_Wall(1000, 0),
            new Hor_BL_Wall(1000, 0),
            new AbstractWall(900, 900, 0, undefined, 0, undefined)
        ],[
            new TopLoader_FromRight("room-1", 100, 0),
            new LeftLoader_FromBottom("room-12", 100, 0)
        ], 
        [])
    ],
    ["room-6", 
        new Room(2000, 100, [
            new Hor_TR_Wall(2000, 0),
            new Hor_BR_Wall(2000, 0)
        ],[
            new RightLoader_FromBottom("room-1", 100, 0),
            new LeftLoader_FromBottom("room-13", 100, 0)
        ], 
        [])
    ],
    ["room-7", 
        new Room(1000, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Hor_BR_Wall(1000, 0),
            new AbstractWall(900, 900, undefined, 0, 0, undefined)
        ],[
            new RightLoader_FromBottom("room-1", 100, 0),
            new TopLoader_FromLeft("room-14", 100, 0)
        ], 
        [])
    ],
    ["room-8", 
        new Room(1500, 1500, [
            new Hor_TR_Wall(1500, 0),
            new Ver_TR_Wall(1500, 0),
            new Ver_TL_Wall(1500, 0),
            new Hor_BL_Wall(650, 0),
            new Hor_BR_Wall(650, 0)
        ],[
            new BottomLoader_FromRight("room-1", 200, 650)
        ], 
        [])
    ],
    ["room-9", 
        new Room(1000, 500, [
            new Hor_TR_Wall(450, 0),
            new Hor_TL_Wall(450, 0),
            new Hor_BL_Wall(450, 0),
            new Hor_BR_Wall(450, 0),
            new Ver_BL_Wall(200, 0),
            new Ver_BR_Wall(200, 0),
            new Ver_TR_Wall(200, 0),
            new Ver_TL_Wall(200, 0)
        ],[
            new BottomLoader_FromLeft("room-2", 100, 450),
            new LeftLoader_FromBottom("room-15", 100, 200),
            new TopLoader_FromLeft("room-16", 100, 450),
            new RightLoader_FromBottom("room-17", 100, 200),
        ], 
        [])
    ],
    ["room-15", 
        new Room(500, 2000, [
            new Hor_BL_Wall(500, 0),
            new Ver_BL_Wall(1400/4, 0),
            new Ver_BL_Wall(1400/4, (1400/4) + 200),
            new Ver_TL_Wall(1400/4, 0),
            new Ver_TL_Wall(1400/4, (1400/4) + 200),
            new Hor_TL_Wall(500, 0),
            new Ver_TR_Wall(1900, 0)
        ],[
            new RightLoader_FromBottom("room-9", 100, 0),
            new LeftLoader_FromBottom("room-18", 200, 1400/4),
            new LeftLoader_FromBottom("room-19", 200, (1400/2) + 200),
            new LeftLoader_FromTop("room-20", 200, 1400/4),
        ], 
        [])
    ],
    ["room-16", 
        new Room(1200, 900, [
            new Hor_BL_Wall(100, 0),
            new Hor_BR_Wall(1000, 0),
            new Ver_TR_Wall(300, 0),
            new Ver_BL_Wall(400, 0),
            new Ver_TL_Wall(400, 0),
            new Ver_BR_Wall(300, 0),
            new Hor_TL_Wall(475, 0),
            new Hor_TR_Wall(475, 0),
            new AbstractWall(75, 75, 275, undefined, 275, undefined),
            new AbstractWall(75, 75, undefined, 275, 275, undefined),
            new AbstractWall(75, 75, undefined, 275, undefined, 275),
            new AbstractWall(75, 75, 275, undefined, undefined, 275)
        ],[
            new BottomLoader_FromLeft("room-9", 100, 100),
            new LeftLoader_FromTop("room-37", 100, 400),
            new TopLoader_FromLeft("room-38", 250, 475),
            new RightLoader_FromTop("room-39", 300, 300)
        ], 
        [])
    ],
    ["room-18", 
        new Room(1100, 400, [
            new Hor_TR_Wall(1100, 0),
            new Ver_TL_Wall(400, 0),
            new Ver_TR_Wall(100, 0),
            new Ver_BR_Wall(100, 0),
            new Hor_BL_Wall(200, 0),
            new Hor_BL_Wall(200, 300),
            new Hor_BR_Wall(200, 0),
            new Hor_BR_Wall(200, 300),
        ],[
            new RightLoader_FromBottom("room-15", 200, 100),
            new BottomLoader_FromRight("room-21", 100, 200),
            new BottomLoader_FromLeft("room-22", 100, 500),
            new BottomLoader_FromLeft("room-23", 100, 200),
        ], 
        [])
    ],
    ["room-19", 
        new Room(1100, 400, [
            new Hor_BR_Wall(1100, 0),
            new Ver_TL_Wall(150, 0),
            new Ver_BL_Wall(150, 0),
            new Ver_TR_Wall(100, 0),
            new Ver_BR_Wall(100, 0),
            new Hor_TL_Wall(1100, 0)
        ],[
            new RightLoader_FromBottom("room-15", 200, 100),
            new LeftLoader_FromTop("room-24", 100, 150)
        ], 
        [])
    ],
    ["room-20", 
        new Room(1100, 400, [
            new Hor_BR_Wall(1100, 0),
            new Ver_TL_Wall(400, 0),
            new Ver_TR_Wall(100, 0),
            new Ver_BR_Wall(100, 0),
            new Hor_TL_Wall(200, 0),
            new Hor_TL_Wall(200, 300),
            new Hor_TR_Wall(200, 0),
            new Hor_TR_Wall(200, 300),
        ],[
            new RightLoader_FromBottom("room-15", 200, 100),
            new TopLoader_FromRight("room-25", 100, 200),
            new TopLoader_FromLeft("room-26", 100, 500),
            new TopLoader_FromLeft("room-27", 100, 200)     
        ], 
        [])
    ],
    ["room-21", 
        new Room(500, 500, [
            new Hor_BR_Wall(500, 0),
            new Ver_TL_Wall(500, 0),
            new Ver_TR_Wall(500, 0),
            new Hor_TL_Wall(200, 0),
            new Hor_TR_Wall(200, 0)
        ],[
            new TopLoader_FromLeft("room-18", 100, 200)
        ], 
        [])
    ],
    ["room-22", 
        new Room(100, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
        ],[
            new TopLoader_FromLeft("room-18", 100, 0),
            new BottomLoader_FromLeft("room-28", 100, 0),
        ], 
        [])
    ],
    ["room-23", 
        new Room(500, 500, [
            new Hor_BR_Wall(500, 0),
            new Ver_TL_Wall(500, 0),
            new Ver_TR_Wall(500, 0),
            new Hor_TL_Wall(200, 0),
            new Hor_TR_Wall(200, 0)
        ],[
            new TopLoader_FromLeft("room-18", 100, 200)
        ], 
        [])
    ],
    ["room-24", 
        new Room(600, 1500, [
            new Ver_TR_Wall(275, 0),
            new Ver_TR_Wall(375, 425),
            new Ver_BR_Wall(250, 0),
            new Ver_BR_Wall(200, 350),
            new Hor_BR_Wall(600, 0),
            new Ver_BL_Wall(375, 0),
            new Ver_BL_Wall(350, 500),
            new Ver_TL_Wall(445, 0),
            new Hor_TL_Wall(150, 0),
            new Hor_TR_Wall(300, 0),
            new AbstractWall(300, 375, 0, undefined, undefined, 0),
            new AbstractWall(300, 275, undefined, 0, 0, undefined),
            new AbstractWall(100, 300, 250, undefined, 450, undefined)
        ],[
            new RightLoader_FromBottom("room-19", 100, 250),
            new RightLoader_FromTop("room-29", 150, 275),
            new RightLoader_FromBottom("room-30", 150, 550),
            new LeftLoader_FromTop("room-31", 205, 445),
            new LeftLoader_FromBottom("room-32", 125, 375),
            new TopLoader_FromLeft("room-33", 150, 150)
        ], 
        [])
    ],
    ["room-25", 
        new Room(1000, 1000, [
            new AbstractWall(350, 350, 0, undefined, 0, undefined),
            new AbstractWall(350, 350, 0, undefined, undefined, 0),
            new AbstractWall(350, 350, undefined, 0, undefined, 0),
            new AbstractWall(350, 350, undefined, 0, 0, 0),
            new Hor_TL_Wall(100, 350),
            new Hor_TR_Wall(100, 350),
            new Hor_BL_Wall(100, 350),
            new Hor_BR_Wall(100, 350),
            new Ver_TL_Wall(100, 350),
            new Ver_TR_Wall(100, 350),
            new Ver_BL_Wall(100, 350),
            new Ver_BR_Wall(100, 350),
        ],[
            new BottomLoader_FromLeft("room-20", 100, 450),
            new LeftLoader_FromTop("room-34", 100, 450),
            new RightLoader_FromTop("room-35", 100, 450),
            new TopLoader_FromLeft("room-36", 100, 450),
        ], 
        [])
    ],
    ["room-26", 
        new Room(300, 500, [
            new Ver_TR_Wall(500, 0),
            new Ver_TL_Wall(500, 0),
            new Hor_TR_Wall(300, 0),
            new Hor_BL_Wall(100, 0),
            new Hor_BR_Wall(100, 0)
        ],[
            new BottomLoader_FromLeft("room-20", 100, 100)
        ], 
        [])
    ],
    ["room-27", 
        new Room(2000, 500, [
            new Hor_TR_Wall(2000, 0),
            new Ver_TR_Wall(500, 0),
            new Ver_TL_Wall(500, 0),
            new Hor_BL_Wall(1700, 0),
            new Hor_BR_Wall(200, 0),
            new AbstractWall(500, 100, 500, undefined, 100, undefined),
            new AbstractWall(100, 300, undefined, 500, 100, undefined),
            new AbstractWall(300, 300, 0, undefined, undefined, 0)
        ],[
            new BottomLoader_FromRight("room-20", 100, 200)
        ], 
        [])
    ],
    ["room-28", 
        new Room(1000, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BL_Wall(1000, 0),
            new Hor_TL_Wall(450, 0),
            new Hor_TR_Wall(450, 0)
        ],[
            new TopLoader_FromLeft("room-22", 100, 450)
        ], 
        [])
    ],
    ["room-29", 
        new Room(1000, 200, [
            new Hor_TR_Wall(1000, 0),
            new Hor_BR_Wall(1000, 0),
            new Ver_TR_Wall(200, 0),
            new Ver_BL_Wall(25, 0),
            new Ver_TL_Wall(25, 0),
        ],[
            new LeftLoader_FromBottom("room-24", 150, 25)
        ], 
        [])
    ],
    ["room-30", 
        new Room(1250, 400, [
            new Hor_TR_Wall(1250, 0),
            new Hor_BR_Wall(1250, 0),
            new Ver_TR_Wall(400, 0),
            new Ver_BL_Wall(125, 0),
            new Ver_TL_Wall(125, 0),
            new AbstractWall(700, 100, undefined, 0, undefined, 0),
            new AbstractWall(700, 100, 0, undefined, 0, undefined)
        ],[
            new LeftLoader_FromBottom("room-24", 150, 125)
        ], 
        [])
    ],
    ["room-31", 
        new Room(2500, 625, [
            new Hor_TR_Wall(2500, 0),
            new Hor_BR_Wall(2500, 0),
            new Ver_BL_Wall(625, 0),
            new Ver_BR_Wall(210, 0),
            new Ver_TR_Wall(210, 0),
            new AbstractWall(75, 75, 200, undefined, 125, undefined),
            new AbstractWall(75, 75, 400, undefined, 125, undefined),
            new AbstractWall(75, 75, 600, undefined, 125, undefined),
            new AbstractWall(75, 75, 800, undefined, 125, undefined),
            new AbstractWall(75, 75, 1000, undefined, 125, undefined),
            new AbstractWall(75, 75, 1200, undefined, 125, undefined),
            new AbstractWall(75, 75, 1400, undefined, 125, undefined),
            new AbstractWall(75, 75, 1600, undefined, 125, undefined),
            new AbstractWall(75, 75, 1800, undefined, 125, undefined),
            new AbstractWall(75, 75, 2000, undefined, 125, undefined),
            new AbstractWall(75, 75, 2200, undefined, 125, undefined),
            new AbstractWall(75, 75, 200, undefined, undefined, 125),
            new AbstractWall(75, 75, 400, undefined, undefined, 125),
            new AbstractWall(75, 75, 600, undefined, undefined, 125),
            new AbstractWall(75, 75, 800, undefined, undefined, 125),
            new AbstractWall(75, 75, 1000, undefined, undefined, 125),
            new AbstractWall(75, 75, 1200, undefined, undefined, 125),
            new AbstractWall(75, 75, 1400, undefined, undefined, 125),
            new AbstractWall(75, 75, 1600, undefined, undefined, 125),
            new AbstractWall(75, 75, 1800, undefined, undefined, 125),
            new AbstractWall(75, 75, 2000, undefined, undefined, 125),
            new AbstractWall(75, 75, 2200, undefined, undefined, 125),
        ],[
            new RightLoader_FromBottom("room-24", 205, 210)
        ], 
        [])
    ],
    ["room-32", 
        new Room(750, 1500, [
            new Ver_TR_Wall(1375, 0),
            new Ver_TL_Wall(1500, 0),
            new Hor_TR_Wall(750, 0),
            new Hor_BR_Wall(750, 0),
            new AbstractWall(200, 200, undefined, 100, 200, undefined),
            new AbstractWall(200, 200, 100, undefined, 500, undefined),
            new AbstractWall(200, 200, undefined, 100, 800, undefined),
            new AbstractWall(200, 200, 100, undefined, 1100, undefined),
        ],[
            new RightLoader_FromBottom("room-24", 125, 0)
        ], 
        [])
    ],
    ["room-33", 
        new Room(1200, 600, [
            new Hor_BL_Wall(1050, 0),
            new Ver_BL_Wall(600, 0),
            new Hor_TL_Wall(1200, 0),
            new Ver_TR_Wall(600, 0),
            new AbstractWall(800, 50, 200, undefined, 150, undefined),
            new AbstractWall(800, 50, 200, undefined, undefined, 150),
        ],[
            new BottomLoader_FromRight("room-24", 150, 0)
        ], 
        [])
    ],
    ["room-34", 
        new Room(700, 700, [
            new Ver_BR_Wall(500, 0),
            new Ver_BL_Wall(700, 0),
            new Hor_TL_Wall(700, 0),
            new Hor_BR_Wall(700, 0),
            new AbstractWall(75, 75, undefined, 200, 200, undefined),
            new AbstractWall(75, 75, 200, undefined, 200, undefined),
            new AbstractWall(75, 75, 200, undefined, undefined, 200),
            new AbstractWall(75, 75, undefined, 200, undefined, 200)
        ],[
            new RightLoader_FromTop("room-25", 100, 100)
        ], 
        [])
    ],
    ["room-35", 
        new Room(1500, 1500, [
            new Ver_TL_Wall(100, 0),
            new Ver_BL_Wall(1300, 0),
            new Ver_TR_Wall(1500, 0),
            new Ver_TR_Wall(100, 0),
            new Ver_BL_Wall(1300, 0),
            new Hor_TR_Wall(1500, 0),
            new Hor_BL_Wall(1500, 0),
            new AbstractWall(1000, 20, 125, undefined, 300, undefined),
            new AbstractWall(1000, 20, undefined, 125, 500, undefined),
            new AbstractWall(1000, 20, 125, undefined, 700, undefined),
            new AbstractWall(1000, 20, undefined, 125, 900, undefined),
            new AbstractWall(1000, 20, 125, undefined, 1100, undefined),
            new AbstractWall(1000, 20, undefined, 125, 1300, undefined),
        ],[
            new LeftLoader_FromTop("room-25", 100, 100)
        ], 
        [])
    ],
    ["room-36", 
        new Room(2000, 700, [
            new Hor_BL_Wall(300, 0),
            new Hor_BR_Wall(1600, 0),
            new Ver_TR_Wall(700, 0),
            new Ver_TL_Wall(700, 0),
            new Hor_TR_Wall(2000, 0),
            new AbstractWall(125, 250, 150, undefined, 200, undefined),
            new AbstractWall(125, 250, 550, undefined, 200, undefined),
            new AbstractWall(125, 250, 950, undefined, 200, undefined),
            new AbstractWall(125, 250, 1350, undefined, 200, undefined),
            new AbstractWall(125, 250, 1750, undefined, 200, undefined),
        ],[
            new BottomLoader_FromLeft("room-25", 100, 300)
        ], 
        [])
    ],
    ["room-37", 
        new Room(1600, 800, [
            new Ver_TR_Wall(350, 0),
            new Ver_BR_Wall(350, 0),
            new Hor_TR_Wall(240, 0),
            new Hor_TR_Wall(240, 340),
            new Hor_TL_Wall(240, 0),
            new Hor_TL_Wall(240, 340),
            new Hor_TL_Wall(240, 680),
            new Ver_TL_Wall(800, 0),
            new Hor_BL_Wall(1600, 0),
            new AbstractWall(300, 100, 100, undefined, 200, undefined),
            new AbstractWall(300, 100, 100, undefined, undefined, 200),
            new AbstractWall(300, 100, undefined, 100, 200, undefined),
            new AbstractWall(300, 100, undefined, 100, undefined, 200),
            new AbstractWall(150, 150, 725, undefined, 325, undefined)
        ],[
            new RightLoader_FromTop("room-16", 100, 350),
            new TopLoader_FromLeft("room-62", 100, 240),
            new TopLoader_FromLeft("room-63", 100, 580),
            new TopLoader_FromRight("room-64", 100, 240),
            new TopLoader_FromRight("room-65", 100, 580)
        ], 
        [])
    ],
    ["room-38", 
        new Room(1000, 5000, [
            new Hor_BL_Wall(375, 0),
            new Hor_BR_Wall(375, 0),
            new Ver_TL_Wall(5000, 0),
            new Ver_TR_Wall(5000, 0),
            new Hor_TL_Wall(400, 0),
            new Hor_TR_Wall(400, 0),
            new AbstractWall(50, 4500, 250, undefined, 250, undefined),
            new AbstractWall(50, 4500, undefined, 250, 250, undefined),
        ],[
            new BottomLoader_FromLeft("room-16", 250, 375),
            new TopLoader_FromLeft("room-40", 200, 400)
        ], 
        [])
    ],
    ["room-39", 
        new Room(1400, 400, [
            new Ver_TL_Wall(50, 0),
            new Ver_BL_Wall(50, 0),
            new Hor_TL_Wall(1100/3, 0),
            new Hor_TR_Wall(1100/3, 0),
            new Hor_TR_Wall(1100/3, 1100/3 + 150),
            new Hor_BL_Wall(1100/3, 0),
            new Hor_BR_Wall(1100/3, 0),
            new Hor_BR_Wall(1100/3, 1100/3 + 150),
            new Ver_TR_Wall(150, 0),
            new Ver_BR_Wall(150, 0),
            new AbstractWall(1000, 10, 100, undefined, 150, undefined),
            new AbstractWall(1000, 10, undefined, 100, undefined, 100)
        ],[
            new LeftLoader_FromTop("room-16", 300, 50),
            new TopLoader_FromLeft("room-66", 150, 1100/3),
            new TopLoader_FromRight("room-67", 150, 1100/3),
            new BottomLoader_FromLeft("room-68", 150, 1100/3),
            new BottomLoader_FromRight("room-69", 150, 1100/3),
            new RightLoader_FromTop("room-70", 100, 150)
        ], 
        [])
    ],
    ["room-40", 
        new Room(1000, 2000, [
            new Hor_TL_Wall(400, 0),
            new Hor_TR_Wall(400, 0),
            new Ver_TL_Wall(800, 0),
            new Ver_TL_Wall(300, 1100),
            new Ver_TL_Wall(300, 1700),
            new Ver_TR_Wall(800, 0),
            new Ver_TR_Wall(300, 1100),
            new Ver_TR_Wall(300, 1700),
            new Hor_BL_Wall(400, 0),
            new Hor_BR_Wall(400, 0),
            new AbstractWall(300, 700, 0, undefined, 0, undefined),
            new AbstractWall(300, 700, undefined, 0, 0, undefined),
            new AbstractWall(700, 100, 150, undefined, undefined, 700)
        ],[
            new BottomLoader_FromLeft("room-38", 200, 400),
            new LeftLoader_FromBottom("room-41", 300, 300),
            new LeftLoader_FromBottom("room-42", 300, 900),
            new RightLoader_FromBottom("room-43", 300, 300),
            new RightLoader_FromBottom("room-44", 300, 900),
            new TopLoader_FromLeft("room-45", 200, 400)
        ], 
        [])
    ],
    ["room-41", 
        new Room(1000, 700, [
            new Ver_TR_Wall(200, 0),
            new Ver_BR_Wall(200, 0),
            new Hor_TR_Wall(175, 0),
            new Hor_TR_Wall(175, 275),
            new Hor_TL_Wall(175, 0),
            new Hor_TL_Wall(175, 275),
            new Hor_BL_Wall(1000, 0),
            new Ver_TL_Wall(700, 0),
            new AbstractWall(500, 100, undefined, 0, undefined, 0),
            new AbstractWall(100, 500, 0, undefined, 0, undefined),
            new AbstractWall(100, 100, 300, undefined, 300, undefined),
            new AbstractWall(100, 100, undefined, 300, 300, undefined),
        ],[
            new RightLoader_FromBottom("room-40", 300, 200),
            new TopLoader_FromLeft("room-46", 100, 175),
            new TopLoader_FromLeft("room-47", 100, 450),
            new TopLoader_FromRight("room-48", 100, 175),
        ], 
        [])
    ],
    ["room-42", 
        new Room(1000, 700, [
            new Hor_TL_Wall(1000, 0),
            new Hor_BL_Wall(1000, 0),
            new Ver_TL_Wall(300, 0),
            new Ver_BL_Wall(300, 0),
            new Ver_TR_Wall(200, 0),
            new Ver_BR_Wall(200, 0),
        ],[
            new RightLoader_FromTop("room-40", 300, 200),
            new LeftLoader_FromTop("room-58", 100, 300)
        ], 
        [])
    ],
    ["room-43", 
        new Room(1000, 700, [
            new Hor_TL_Wall(1000, 0),
            new Hor_BL_Wall(1000, 0),
            new Ver_TR_Wall(300, 0),
            new Ver_BR_Wall(300, 0),
            new Ver_TL_Wall(200, 0),
            new Ver_BL_Wall(200, 0),
        ],[
            new LeftLoader_FromTop("room-40", 300, 200),
            new RightLoader_FromTop("room-59", 100, 300)
        ], 
        [])
    ],
    ["room-44", 
        new Room(1000, 700, [
            new Ver_TL_Wall(200, 0),
            new Ver_BL_Wall(200, 0),
            new Hor_BR_Wall(175, 0),
            new Hor_BR_Wall(175, 275),
            new Hor_BL_Wall(175, 0),
            new Hor_BL_Wall(175, 275),
            new Hor_TL_Wall(1000, 0),
            new Ver_TR_Wall(700, 0),
            new AbstractWall(500, 100, 0, undefined, 0, undefined),
            new AbstractWall(100, 500, undefined, 0, undefined, 0),
            new AbstractWall(100, 100, 300, undefined, 300, undefined),
            new AbstractWall(100, 100, undefined, 300, 300, undefined),
        ],[
            new LeftLoader_FromBottom("room-40", 300, 200),
            new BottomLoader_FromLeft("room-52", 100, 175),
            new BottomLoader_FromLeft("room-53", 100, 450),
            new BottomLoader_FromRight("room-54", 100, 175),
        ], 
        [])
    ],
    ["room-45", 
        new Room(1200, 1200, [
            new Hor_BL_Wall(500, 0),
            new Hor_BR_Wall(500, 0),
            new Hor_TL_Wall(1200, 0),
            new Ver_TL_Wall(1200, 0),
            new Ver_TR_Wall(1200, 0),
            new AbstractWall(100, 800, 200, undefined, 200, undefined),
            new AbstractWall(100, 800, undefined, 200, 200, undefined)
        ],[
            new BottomLoader_FromLeft("room-40", 200, 500)
        ], 
        [])
    ],
    ["room-46", 
        new Room(150, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_TL_Wall(25, 0),
            new Hor_TR_Wall(25, 0),
            new Hor_BL_Wall(25, 0),
            new Hor_BR_Wall(25, 0),
        ],[
            new BottomLoader_FromLeft("room-41", 100, 25),
            new TopLoader_FromLeft("room-49", 100, 25)
        ], 
        [])
    ],
    ["room-47", 
        new Room(150, 1500, [
            new Ver_TL_Wall(1500, 0),
            new Ver_TR_Wall(1500, 0),
            new Hor_TL_Wall(25, 0),
            new Hor_TR_Wall(25, 0),
            new Hor_BL_Wall(25, 0),
            new Hor_BR_Wall(25, 0),
        ],[
            new BottomLoader_FromLeft("room-41", 100, 25),
            new TopLoader_FromLeft("room-50", 100, 25)
        ], 
        [])
    ],
    ["room-48", 
        new Room(150, 2000, [
            new Ver_TL_Wall(2000, 0),
            new Ver_TR_Wall(2000, 0),
            new Hor_TL_Wall(25, 0),
            new Hor_TR_Wall(25, 0),
            new Hor_BL_Wall(25, 0),
            new Hor_BR_Wall(25, 0),
        ],[
            new BottomLoader_FromLeft("room-41", 100, 25),
            new TopLoader_FromLeft("room-51", 100, 25)
        ], 
        [])
    ],
    ["room-49", 
        new Room(1000, 1000, [
            new Hor_TL_Wall(1000, 0),
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BL_Wall(900, 0),
            new AbstractWall(100, 100, 200, undefined, 200, undefined),
            new AbstractWall(100, 100, 200, undefined, undefined, 200),
            new AbstractWall(100, 100, undefined, 200, 200, undefined),
            new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ],[
            new BottomLoader_FromRight("room-46", 100, 0)
        ], 
        [])
    ],
    ["room-50", 
        new Room(1000, 1000, [
            new Hor_TL_Wall(1000, 0),
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BL_Wall(450, 0),
            new Hor_BR_Wall(450, 0),
            new AbstractWall(100, 100, 200, undefined, 200, undefined),
            new AbstractWall(100, 100, 200, undefined, undefined, 200),
            new AbstractWall(100, 100, undefined, 200, 200, undefined),
            new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ],[
            new BottomLoader_FromRight("room-47", 100, 450)
        ], 
        [])
    ],
    ["room-51", 
        new Room(1000, 1000, [
            new Hor_TL_Wall(1000, 0),
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BR_Wall(900, 0),
            new AbstractWall(100, 100, 200, undefined, 200, undefined),
            new AbstractWall(100, 100, 200, undefined, undefined, 200),
            new AbstractWall(100, 100, undefined, 200, 200, undefined),
            new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ],[
            new BottomLoader_FromLeft("room-48", 100, 0)
        ], 
        [])
    ],
    ["room-52", 
        new Room(150, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_TL_Wall(25, 0),
            new Hor_TR_Wall(25, 0),
            new Hor_BL_Wall(25, 0),
            new Hor_BR_Wall(25, 0),
        ],[
            new TopLoader_FromLeft("room-44", 100, 25),
            new BottomLoader_FromLeft("room-55", 100, 25)
        ], 
        [])
    ],
    ["room-53", 
        new Room(150, 1500, [
            new Ver_TL_Wall(1500, 0),
            new Ver_TR_Wall(1500, 0),
            new Hor_TL_Wall(25, 0),
            new Hor_TR_Wall(25, 0),
            new Hor_BL_Wall(25, 0),
            new Hor_BR_Wall(25, 0),
        ],[
            new TopLoader_FromLeft("room-44", 100, 25),
            new BottomLoader_FromLeft("room-56", 100, 25)
        ], 
        [])
    ],
    ["room-54", 
        new Room(150, 2000, [
            new Ver_TL_Wall(2000, 0),
            new Ver_TR_Wall(2000, 0),
            new Hor_TL_Wall(25, 0),
            new Hor_TR_Wall(25, 0),
            new Hor_BL_Wall(25, 0),
            new Hor_BR_Wall(25, 0),
        ],[
            new TopLoader_FromLeft("room-44", 100, 25),
            new BottomLoader_FromLeft("room-57", 100, 25)
        ], 
        [])
    ],
    ["room-55", 
        new Room(1000, 1000, [
            new Hor_TL_Wall(900, 100),
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BR_Wall(1000, 0),
            new AbstractWall(100, 100, 200, undefined, 200, undefined),
            new AbstractWall(100, 100, 200, undefined, undefined, 200),
            new AbstractWall(100, 100, undefined, 200, 200, undefined),
            new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ],[
            new TopLoader_FromLeft("room-52", 100, 0)
        ], 
        [])
    ],
    ["room-56", 
        new Room(1000, 1000, [
            new Hor_TL_Wall(450, 0),
            new Hor_TR_Wall(450, 0),
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BR_Wall(1000, 0),
            new AbstractWall(100, 100, 200, undefined, 200, undefined),
            new AbstractWall(100, 100, 200, undefined, undefined, 200),
            new AbstractWall(100, 100, undefined, 200, 200, undefined),
            new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ],[
            new TopLoader_FromLeft("room-53", 100, 450)
        ], 
        [])
    ],
    ["room-57", 
        new Room(1000, 1000, [
            new Hor_TR_Wall(900, 100),
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_BR_Wall(1000, 0),
            new AbstractWall(100, 100, 200, undefined, 200, undefined),
            new AbstractWall(100, 100, 200, undefined, undefined, 200),
            new AbstractWall(100, 100, undefined, 200, 200, undefined),
            new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ],[
            new TopLoader_FromRight("room-54", 100, 0)
        ], 
        [])
    ],
    ["room-58", 
        new Room(800, 800, [
            new Hor_BL_Wall(800, 0),
            new Ver_TL_Wall(800, 0),
            new AbstractWall(700, 700, undefined, 0, 0, undefined)
        ],[
            new RightLoader_FromBottom("room-42", 100, 0),
            new TopLoader_FromLeft("room-60", 100, 0)
        ], 
        [])
    ],
    ["room-59", 
        new Room(800, 800, [
            new Hor_TL_Wall(800, 0),
            new Ver_TR_Wall(800, 0),
            new AbstractWall(700, 700, 0, undefined, undefined, 0)
        ],[
            new LeftLoader_FromTop("room-43", 100, 0),
            new BottomLoader_FromRight("room-61", 100, 0)
        ], 
        [])
    ],
    ["room-60", 
        new Room(700, 1400, [
            new Hor_BL_Wall(300, 0),
            new Hor_BR_Wall(300, 0),
            new Ver_TL_Wall(1400, 0),
            new Ver_TR_Wall(1400, 0),
            new Hor_TL_Wall(700, 0),
            new AbstractWall(220, 570, 0, undefined, undefined, 0),
            new AbstractWall(220, 570, undefined, 0, undefined, 0)
        ],[
            new BottomLoader_FromLeft("room-58", 100, 300)
        ], 
        [])
    ],
    ["room-61", 
        new Room(700, 1400, [
            new Hor_TL_Wall(300, 0),
            new Hor_TR_Wall(300, 0),
            new Ver_TL_Wall(1400, 0),
            new Ver_TR_Wall(1400, 0),
            new Hor_BL_Wall(700, 0),
            new AbstractWall(220, 570, 0, undefined, 0, undefined),
            new AbstractWall(220, 570, undefined, 0, 0, undefined)
        ],[
            new TopLoader_FromLeft("room-59", 100, 300)
        ], 
        [])
    ],
    ["room-62", 
        new Room(1500, 600, [
            new Hor_BR_Wall(200, 0),
            new Hor_BL_Wall(1200, 0),
            new Ver_TL_Wall(600, 0),
            new Ver_TR_Wall(600, 0),
            new Hor_TL_Wall(1500, 0),
            new AbstractWall(100, 300, 150, undefined, 150, undefined),
            new AbstractWall(100, 300, undefined, 150, 150, undefined),
            new AbstractWall(700, 50, 400, undefined, 150, undefined),
            new AbstractWall(700, 50, 400, undefined, undefined, 150)
        ],[
            new BottomLoader_FromRight("room-37", 100, 200)
        ], 
        [])
    ],
    ["room-63", 
        new Room(1000, 1000, [
            new AbstractWall(900, 900, 0, undefined, undefined, 0),
            new Ver_TR_Wall(1000, 0),
            new Hor_TL_Wall(1000, 0)
        ],[
            new BottomLoader_FromRight("room-37", 100, 0),
            new LeftLoader_FromTop("room-71", 100, 0)
        ], 
        [])
    ],
    ["room-64", 
        new Room(1500, 600, [
            new Hor_BL_Wall(200, 0),
            new Hor_BR_Wall(1200, 0),
            new Ver_TL_Wall(600, 0),
            new Ver_TR_Wall(600, 0),
            new Hor_TL_Wall(1500, 0),
            new AbstractWall(100, 300, 150, undefined, 150, undefined),
            new AbstractWall(100, 300, undefined, 150, 150, undefined),
            new AbstractWall(700, 50, 400, undefined, 150, undefined),
            new AbstractWall(700, 50, 400, undefined, undefined, 150)
        ],[
            new BottomLoader_FromLeft("room-37", 100, 200)
        ], 
        [])
    ],
    ["room-65", 
        new Room(1000, 1000, [
            new AbstractWall(900, 900, undefined, 0, undefined, 0),
            new Ver_TL_Wall(1000, 0),
            new Hor_TL_Wall(1000, 0)
        ],[
            new BottomLoader_FromLeft("room-37", 100, 0),
            new RightLoader_FromTop("room-72", 100, 0)
        ], 
        [])
    ],
    ["room-71", 
        new Room(1200, 1200, [
            new Ver_TR_Wall(1100, 0),
            new Hor_BR_Wall(1200, 0),
            new Hor_TL_Wall(1200, 0),
            new Ver_BL_Wall(1200, 0),
            new AbstractWall(100, 300, 225, undefined, 100, undefined),
            new AbstractWall(100, 300, 550, undefined, 150, undefined),
            new AbstractWall(100, 300, undefined, 225, 200, undefined),
            new AbstractWall(100, 300, 225, undefined, undefined, 200),
            new AbstractWall(100, 300, 550, undefined, undefined, 150),
            new AbstractWall(100, 300, undefined, 225, undefined, 100),
        ],[
            new RightLoader_FromBottom("room-63", 100, 0)
        ], 
        [])
    ],
    ["room-72", 
        new Room(1200, 1200, [
            new Ver_TR_Wall(1100, 0),
            new Hor_BR_Wall(1200, 0),
            new Hor_TR_Wall(1200, 0),
            new Ver_TL_Wall(1100, 0),
            new AbstractWall(100, 300, 225, undefined, 200, undefined),
            new AbstractWall(100, 300, 550, undefined, 150, undefined),
            new AbstractWall(100, 300, undefined, 225, 100, undefined),
            new AbstractWall(100, 300, 225, undefined, undefined, 100),
            new AbstractWall(100, 300, 550, undefined, undefined, 150),
            new AbstractWall(100, 300, undefined, 225, undefined, 200),
        ],[
            new LeftLoader_FromBottom("room-65", 100, 0)
        ], 
        [])
    ],
])