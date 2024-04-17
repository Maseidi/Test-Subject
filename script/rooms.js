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
    constructor(width, height, walls, loaders) {
        this.width = width
        this.height = height
        this.walls = walls
        this.loaders = loaders
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
        ])
    ],
    ["room-3", 
        new Room(1000, 1000, [
            new AbstractWall(900, 900, 0, undefined, undefined, 0),
            new Hor_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0)
        ], [
            new LeftLoader_FromTop("room-1", 100, 0),
            new BottomLoader_FromRight("room-10", 100, 0)
        ])
    ],
    ["room-4", 
        new Room(100, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0)
        ],[
            new TopLoader_FromRight("room-1", 100, 0),
            new BottomLoader_FromRight("room-11", 100, 0)
        ])
    ],
    ["room-5", 
        new Room(1000, 1000, [
            new Ver_TR_Wall(1000, 0),
            new Hor_BL_Wall(1000, 0),
            new AbstractWall(900, 900, 0, undefined, 0, undefined)
        ],[
            new TopLoader_FromRight("room-1", 100, 0),
            new LeftLoader_FromBottom("room-12", 100, 0)
        ])
    ],
    ["room-6", 
        new Room(2000, 100, [
            new Hor_TR_Wall(2000, 0),
            new Hor_BR_Wall(2000, 0)
        ],[
            new RightLoader_FromBottom("room-1", 100, 0),
            new LeftLoader_FromBottom("room-13", 100, 0)
        ])
    ],
    ["room-7", 
        new Room(1000, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Hor_BR_Wall(1000, 0),
            new AbstractWall(900, 900, undefined, 0, 0, undefined)
        ],[
            new RightLoader_FromBottom("room-1", 100, 0),
            new TopLoader_FromLeft("room-14", 100, 0)
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
    ],
    ["room-22", 
        new Room(100, 1000, [
            new Ver_TL_Wall(1000, 0),
            new Ver_TR_Wall(1000, 0),
        ],[
            new TopLoader_FromLeft("room-18", 100, 0),
            new BottomLoader_FromLeft("room-28", 100, 0),
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
        ])
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
            new AbstractWall(300, 700, undefined, 0, 0, undefined)
        ],[
            new BottomLoader_FromLeft("room-38", 200, 400),
            new LeftLoader_FromBottom("room-42", 300, 300),
            new LeftLoader_FromBottom("room-43", 300, 900),
            new RightLoader_FromBottom("room-44", 300, 300),
            new RightLoader_FromBottom("room-45", 300, 900),
            new TopLoader_FromLeft("room-46", 200, 400)
        ])
    ],
])