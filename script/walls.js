class AbstractWall {
    constructor(width, height, left, right, top, bottom, side) {
        this.width = width
        this.height = height
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
        this.side = side
    }
}

class SideWall extends AbstractWall {
    constructor(type, size, zone, offset) {
        let width
        let height
        let left
        let right
        let top
        let bottom
        if ( type === "V" ) {
            width = 5
            height = size
            if ( zone === "tr" ) {
                top = offset
                right = 0
            } else if ( zone === "tl" ) {
                top = offset
                left = 0
            } else if ( zone === "br" ) {
                bottom = offset
                right = 0
            } else if ( zone === "bl" ) {
                bottom = offset
                left = 0
            }
        } else if ( type === "H" ) {
            width = size
            height = 5
            if ( zone === "tr" ) {
                top = 0
                right = offset
            } else if ( zone === "tl" ) {
                top = 0
                left = offset
            } else if ( zone === "br" ) {
                bottom = 0
                right = offset
            } else if ( zone === "bl" ) {
                bottom = 0
                left = offset
            }
        }
        super(width, height, left, right, top, bottom, true)
    }
}

class VerWall extends SideWall {
    constructor(height, zone, offset) {
        super("V", height, zone, offset)
    }
}

class HorWall extends SideWall {
    constructor(width, zone, offset) {
        super("H", width, zone, offset)
    }
}

class Ver_TL_Wall extends VerWall {
    constructor(height, top) {
        super(height, "tl", top)
    }
}

class Ver_TR_Wall extends VerWall {
    constructor(height, top) {
        super(height, "tr", top)
    }
}

class Ver_BL_Wall extends VerWall {
    constructor(height, bottom) {
        super(height, "bl", bottom)
    }
}

class Ver_BR_Wall extends VerWall {
    constructor(height, bottom) {
        super(height, "br", bottom)
    }
}

class Hor_TL_Wall extends HorWall {
    constructor(width, left) {
        super(width, "tl", left)
    }
}

class Hor_TR_Wall extends HorWall {
    constructor(width, right) {
        super(width, "tr", right)
    }
}

class Hor_BL_Wall extends HorWall {
    constructor(width, left) {
        super(width, "bl", left)
    }
}

class Hor_BR_Wall extends HorWall {
    constructor(width, right) {
        super(width, "br", right)
    }
}

export const walls = new Map([
    [1, [
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
        ]
    ], [2, [
        new AbstractWall(900, 900, 0, undefined, 0, undefined),
        new Hor_BL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0)
        ] 
    ],[3, [
        new AbstractWall(900, 900, 0, undefined, undefined, 0),
        new Hor_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0)
        ]
    ],[4, [
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0)
        ]
    ],[5, [
        new Ver_TR_Wall(1000, 0),
        new Hor_BL_Wall(1000, 0),
        new AbstractWall(900, 900, 0, undefined, 0, undefined)
        ]
    ],[6, [
        new Hor_TR_Wall(2000, 0),
        new Hor_BR_Wall(2000, 0)
        ]
    ],[7, [
        new Ver_TL_Wall(1000, 0),
        new Hor_BR_Wall(1000, 0),
        new AbstractWall(900, 900, undefined, 0, 0, undefined)
        ]
    ],[8, [
        new Hor_TR_Wall(1500, 0),
        new Ver_TR_Wall(1500, 0),
        new Ver_TL_Wall(1500, 0),
        new Hor_BL_Wall(650, 0),
        new Hor_BR_Wall(650, 0)
        ]
    ],[9, [
        new Hor_TR_Wall(450, 0),
        new Hor_TL_Wall(450, 0),
        new Hor_BL_Wall(450, 0),
        new Hor_BR_Wall(450, 0),
        new Ver_BL_Wall(200, 0),
        new Ver_BR_Wall(200, 0),
        new Ver_TR_Wall(200, 0),
        new Ver_TL_Wall(200, 0)
        ]
    ],[15, [
        new Hor_BL_Wall(500, 0),
        new Ver_BL_Wall(1400/4, 0),
        new Ver_BL_Wall(1400/4, (1400/4) + 200),
        new Ver_TL_Wall(1400/4, 0),
        new Ver_TL_Wall(1400/4, (1400/4) + 200),
        new Hor_TL_Wall(500, 0),
        new Ver_TR_Wall(1900, 0)
        ]
    ],[16, [
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
        ]
    ],[18, [
        new Hor_TR_Wall(1100, 0),
        new Ver_TL_Wall(400, 0),
        new Ver_TR_Wall(100, 0),
        new Ver_BR_Wall(100, 0),
        new Hor_BL_Wall(200, 0),
        new Hor_BL_Wall(200, 300),
        new Hor_BR_Wall(200, 0),
        new Hor_BR_Wall(200, 300),
        ]
    ],[19, [
        new Hor_BR_Wall(1100, 0),
        new Ver_TL_Wall(150, 0),
        new Ver_BL_Wall(150, 0),
        new Ver_TR_Wall(100, 0),
        new Ver_BR_Wall(100, 0),
        new Hor_TL_Wall(1100, 0)
        ]
    ],[20, [
        new Hor_BR_Wall(1100, 0),
        new Ver_TL_Wall(400, 0),
        new Ver_TR_Wall(100, 0),
        new Ver_BR_Wall(100, 0),
        new Hor_TL_Wall(200, 0),
        new Hor_TL_Wall(200, 300),
        new Hor_TR_Wall(200, 0),
        new Hor_TR_Wall(200, 300),
        ]
    ],[21, [
        new Hor_BR_Wall(500, 0),
        new Ver_TL_Wall(500, 0),
        new Ver_TR_Wall(500, 0),
        new Hor_TL_Wall(200, 0),
        new Hor_TR_Wall(200, 0)
        ]
    ],[22, [
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        ]
    ],[23, [
        new Hor_BR_Wall(500, 0),
        new Ver_TL_Wall(500, 0),
        new Ver_TR_Wall(500, 0),
        new Hor_TL_Wall(200, 0),
        new Hor_TR_Wall(200, 0)
        ]
    ],[24, [
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
        ]
    ],[25, [
        new AbstractWall(350, 350, 0, undefined, 0, undefined),
        new AbstractWall(350, 350, 0, undefined, undefined, 0),
        new AbstractWall(350, 350, undefined, 0, undefined, 0),
        new AbstractWall(350, 350, undefined, 0, 0, undefined),
        new Hor_TL_Wall(100, 350),
        new Hor_TR_Wall(100, 350),
        new Hor_BL_Wall(100, 350),
        new Hor_BR_Wall(100, 350),
        new Ver_TL_Wall(100, 350),
        new Ver_TR_Wall(100, 350),
        new Ver_BL_Wall(100, 350),
        new Ver_BR_Wall(100, 350),
        ]
    ],[26, [
        new Ver_TR_Wall(500, 0),
        new Ver_TL_Wall(500, 0),
        new Hor_TR_Wall(300, 0),
        new Hor_BL_Wall(100, 0),
        new Hor_BR_Wall(100, 0)
        ]
    ],[27, [
        new Hor_TR_Wall(2000, 0),
        new Ver_TR_Wall(500, 0),
        new Ver_TL_Wall(500, 0),
        new Hor_BL_Wall(1700, 0),
        new Hor_BR_Wall(200, 0),
        new AbstractWall(500, 100, 500, undefined, 100, undefined),
        new AbstractWall(100, 300, undefined, 500, 100, undefined),
        new AbstractWall(300, 300, 0, undefined, undefined, 0)
        ]
    ],[28, [
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BL_Wall(1000, 0),
        new Hor_TL_Wall(450, 0),
        new Hor_TR_Wall(450, 0)
        ]
    ],[29, [
        new Hor_TR_Wall(1000, 0),
        new Hor_BR_Wall(1000, 0),
        new Ver_TR_Wall(200, 0),
        new Ver_BL_Wall(25, 0),
        new Ver_TL_Wall(25, 0),
        ]
    ],[30, [
        new Hor_TR_Wall(1250, 0),
        new Hor_BR_Wall(1250, 0),
        new Ver_TR_Wall(400, 0),
        new Ver_BL_Wall(125, 0),
        new Ver_TL_Wall(125, 0),
        new AbstractWall(700, 100, undefined, 0, undefined, 0),
        new AbstractWall(700, 100, 0, undefined, 0, undefined)
        ]
    ],[31, [
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
        ]
    ],[32, [
        new Ver_TR_Wall(1375, 0),
        new Ver_TL_Wall(1500, 0),
        new Hor_TR_Wall(750, 0),
        new Hor_BR_Wall(750, 0),
        new AbstractWall(200, 200, undefined, 100, 200, undefined),
        new AbstractWall(200, 200, 100, undefined, 500, undefined),
        new AbstractWall(200, 200, undefined, 100, 800, undefined),
        new AbstractWall(200, 200, 100, undefined, 1100, undefined),
        ]
    ],[33, [
        new Hor_BL_Wall(1050, 0),
        new Ver_BL_Wall(600, 0),
        new Hor_TL_Wall(1200, 0),
        new Ver_TR_Wall(600, 0),
        new AbstractWall(800, 50, 200, undefined, 150, undefined),
        new AbstractWall(800, 50, 200, undefined, undefined, 150),
        ]
    ],[34, [
        new Ver_BR_Wall(500, 0),
        new Ver_BL_Wall(700, 0),
        new Hor_TL_Wall(700, 0),
        new Hor_BR_Wall(700, 0),
        new AbstractWall(75, 75, undefined, 200, 200, undefined),
        new AbstractWall(75, 75, 200, undefined, 200, undefined),
        new AbstractWall(75, 75, 200, undefined, undefined, 200),
        new AbstractWall(75, 75, undefined, 200, undefined, 200)
        ]
    ],[35, [
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
        ]
    ],[36, [
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
        ]
    ],[37, [
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
        new AbstractWall(150, 150, 725, undefined, 325, undefined),
        ]
    ],[38, [
        new Hor_BL_Wall(375, 0),
        new Hor_BR_Wall(375, 0),
        new Ver_TL_Wall(5000, 0),
        new Ver_TR_Wall(5000, 0),
        new Hor_TL_Wall(400, 0),
        new Hor_TR_Wall(400, 0),
        new AbstractWall(50, 4500, 250, undefined, 250, undefined),
        new AbstractWall(50, 4500, undefined, 250, 250, undefined),
        ]
    ],[39, [
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
        ]
    ],[40, [
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
        ]
    ],[41, [
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
        ]
    ],[42, [
        new Hor_TL_Wall(1000, 0),
        new Hor_BL_Wall(1000, 0),
        new Ver_TL_Wall(300, 0),
        new Ver_BL_Wall(300, 0),
        new Ver_TR_Wall(200, 0),
        new Ver_BR_Wall(200, 0),
        ]
    ],[43, [
        new Hor_TL_Wall(1000, 0),
        new Hor_BL_Wall(1000, 0),
        new Ver_TR_Wall(300, 0),
        new Ver_BR_Wall(300, 0),
        new Ver_TL_Wall(200, 0),
        new Ver_BL_Wall(200, 0),
        ]
    ],[44, [
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
        ]
    ],[45, [
        new Hor_BL_Wall(500, 0),
        new Hor_BR_Wall(500, 0),
        new Hor_TL_Wall(1200, 0),
        new Ver_TL_Wall(1200, 0),
        new Ver_TR_Wall(1200, 0),
        new AbstractWall(100, 800, 200, undefined, 200, undefined),
        new AbstractWall(100, 800, undefined, 200, 200, undefined)
        ]
    ],[46, [
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_TL_Wall(25, 0),
        new Hor_TR_Wall(25, 0),
        new Hor_BL_Wall(25, 0),
        new Hor_BR_Wall(25, 0),
        ]
    ],[47, [
        new Ver_TL_Wall(1500, 0),
        new Ver_TR_Wall(1500, 0),
        new Hor_TL_Wall(25, 0),
        new Hor_TR_Wall(25, 0),
        new Hor_BL_Wall(25, 0),
        new Hor_BR_Wall(25, 0),
        ]
    ],[48, [
        new Ver_TL_Wall(2000, 0),
        new Ver_TR_Wall(2000, 0),
        new Hor_TL_Wall(25, 0),
        new Hor_TR_Wall(25, 0),
        new Hor_BL_Wall(25, 0),
        new Hor_BR_Wall(25, 0),
        ]
    ],[49, [
        new Hor_TL_Wall(1000, 0),
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BL_Wall(900, 0),
        new AbstractWall(100, 100, 200, undefined, 200, undefined),
        new AbstractWall(100, 100, 200, undefined, undefined, 200),
        new AbstractWall(100, 100, undefined, 200, 200, undefined),
        new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ]
    ],[50, [
        new Hor_TL_Wall(1000, 0),
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BL_Wall(450, 0),
        new Hor_BR_Wall(450, 0),
        new AbstractWall(100, 100, 200, undefined, 200, undefined),
        new AbstractWall(100, 100, 200, undefined, undefined, 200),
        new AbstractWall(100, 100, undefined, 200, 200, undefined),
        new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ]
    ],[51, [
        new Hor_TL_Wall(1000, 0),
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BR_Wall(900, 0),
        new AbstractWall(100, 100, 200, undefined, 200, undefined),
        new AbstractWall(100, 100, 200, undefined, undefined, 200),
        new AbstractWall(100, 100, undefined, 200, 200, undefined),
        new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ]
    ],[52, [
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_TL_Wall(25, 0),
        new Hor_TR_Wall(25, 0),
        new Hor_BL_Wall(25, 0),
        new Hor_BR_Wall(25, 0),
        ]
    ],[53, [
        new Ver_TL_Wall(1500, 0),
        new Ver_TR_Wall(1500, 0),
        new Hor_TL_Wall(25, 0),
        new Hor_TR_Wall(25, 0),
        new Hor_BL_Wall(25, 0),
        new Hor_BR_Wall(25, 0),
        ]
    ],[54, [
        new Ver_TL_Wall(2000, 0),
        new Ver_TR_Wall(2000, 0),
        new Hor_TL_Wall(25, 0),
        new Hor_TR_Wall(25, 0),
        new Hor_BL_Wall(25, 0),
        new Hor_BR_Wall(25, 0),
        ]
    ],[55, [
        new Hor_TL_Wall(900, 100),
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BR_Wall(1000, 0),
        new AbstractWall(100, 100, 200, undefined, 200, undefined),
        new AbstractWall(100, 100, 200, undefined, undefined, 200),
        new AbstractWall(100, 100, undefined, 200, 200, undefined),
        new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ]
    ],[56, [
        new Hor_TL_Wall(450, 0),
        new Hor_TR_Wall(450, 0),
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BR_Wall(1000, 0),
        new AbstractWall(100, 100, 200, undefined, 200, undefined),
        new AbstractWall(100, 100, 200, undefined, undefined, 200),
        new AbstractWall(100, 100, undefined, 200, 200, undefined),
        new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ]
    ],[57, [
        new Hor_TR_Wall(900, 100),
        new Ver_TL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_BR_Wall(1000, 0),
        new AbstractWall(100, 100, 200, undefined, 200, undefined),
        new AbstractWall(100, 100, 200, undefined, undefined, 200),
        new AbstractWall(100, 100, undefined, 200, 200, undefined),
        new AbstractWall(100, 100, undefined, 200, undefined, 200)
        ]
    ],[58, [
        new Hor_BL_Wall(800, 0),
        new Ver_TL_Wall(800, 0),
        new AbstractWall(700, 700, undefined, 0, 0, undefined)
        ]
    ],[59, [
        new Hor_TL_Wall(800, 0),
        new Ver_TR_Wall(800, 0),
        new AbstractWall(700, 700, 0, undefined, undefined, 0)
        ]
    ],[60, [
        new Hor_BL_Wall(300, 0),
        new Hor_BR_Wall(300, 0),
        new Ver_TL_Wall(1400, 0),
        new Ver_TR_Wall(1400, 0),
        new Hor_TL_Wall(700, 0),
        new AbstractWall(220, 570, 0, undefined, undefined, 0),
        new AbstractWall(220, 570, undefined, 0, undefined, 0)
        ]
    ],[61, [
        new Hor_TL_Wall(300, 0),
        new Hor_TR_Wall(300, 0),
        new Ver_TL_Wall(1400, 0),
        new Ver_TR_Wall(1400, 0),
        new Hor_BL_Wall(700, 0),
        new AbstractWall(220, 570, 0, undefined, 0, undefined),
        new AbstractWall(220, 570, undefined, 0, 0, undefined)
        ]
    ],[62, [
        new Hor_BR_Wall(200, 0),
        new Hor_BL_Wall(1200, 0),
        new Ver_TL_Wall(600, 0),
        new Ver_TR_Wall(600, 0),
        new Hor_TL_Wall(1500, 0),
        new AbstractWall(100, 300, 150, undefined, 150, undefined),
        new AbstractWall(100, 300, undefined, 150, 150, undefined),
        new AbstractWall(700, 50, 400, undefined, 150, undefined),
        new AbstractWall(700, 50, 400, undefined, undefined, 150)
        ]
    ],[63, [
        new AbstractWall(900, 900, 0, undefined, undefined, 0),
        new Ver_TR_Wall(1000, 0),
        new Hor_TL_Wall(1000, 0)
        ]
    ],[64, [
        new Hor_BL_Wall(200, 0),
        new Hor_BR_Wall(1200, 0),
        new Ver_TL_Wall(600, 0),
        new Ver_TR_Wall(600, 0),
        new Hor_TL_Wall(1500, 0),
        new AbstractWall(100, 300, 150, undefined, 150, undefined),
        new AbstractWall(100, 300, undefined, 150, 150, undefined),
        new AbstractWall(700, 50, 400, undefined, 150, undefined),
        new AbstractWall(700, 50, 400, undefined, undefined, 150)
        ]
    ],[65, [
        new AbstractWall(900, 900, undefined, 0, undefined, 0),
        new Ver_TL_Wall(1000, 0),
        new Hor_TL_Wall(1000, 0)
        ]
    ],[71, [
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
        ]
    ],[72, [
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
        ]
    ]

])