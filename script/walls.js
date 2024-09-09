class AbstractWall {
    constructor(width, height, left, right, top, bottom, side) {
        this.width =  width  ?? 0
        this.height = height ?? 0
        this.left =   left   ?? null
        this.right =  right  ?? null
        this.top =    top    ?? null
        this.bottom = bottom ?? null
        this.side =   side   ?? false
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
        if ( type === 'V' ) {
            width = 5
            height = size
            if ( zone === 'tr' ) {
                top = offset
                right = 0
            } else if ( zone === 'tl' ) {
                top = offset
                left = 0
            } else if ( zone === 'br' ) {
                bottom = offset
                right = 0
            } else if ( zone === 'bl' ) {
                bottom = offset
                left = 0
            }
        } else if ( type === 'H' ) {
            width = size
            height = 5
            if ( zone === 'tr' ) {
                top = 0
                right = offset
            } else if ( zone === 'tl' ) {
                top = 0
                left = offset
            } else if ( zone === 'br' ) {
                bottom = 0
                right = offset
            } else if ( zone === 'bl' ) {
                bottom = 0
                left = offset
            }
        }
        super(width, height, left, right, top, bottom, true)
    }
}

class VerWall extends SideWall {
    constructor(height, zone, offset) {
        super('V', height, zone, offset)
    }
}

class HorWall extends SideWall {
    constructor(width, zone, offset) {
        super('H', width, zone, offset)
    }
}

class Ver_TL_Wall extends VerWall {
    constructor(height, top) {
        super(height, 'tl', top)
    }
}

class Ver_TR_Wall extends VerWall {
    constructor(height, top) {
        super(height, 'tr', top)
    }
}

class Ver_BL_Wall extends VerWall {
    constructor(height, bottom) {
        super(height, 'bl', bottom)
    }
}

class Ver_BR_Wall extends VerWall {
    constructor(height, bottom) {
        super(height, 'br', bottom)
    }
}

class Hor_TL_Wall extends HorWall {
    constructor(width, left) {
        super(width, 'tl', left)
    }
}

class Hor_TR_Wall extends HorWall {
    constructor(width, right) {
        super(width, 'tr', right)
    }
}

class Hor_BL_Wall extends HorWall {
    constructor(width, left) {
        super(width, 'bl', left)
    }
}

class Hor_BR_Wall extends HorWall {
    constructor(width, right) {
        super(width, 'br', right)
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
        new AbstractWall(900, 900, 0, null, 0, null),
        new Hor_BL_Wall(1000, 0),
        new Ver_TR_Wall(1000, 0)
        ] 
    ]
    ,[9, [
        new Hor_TR_Wall(450, 0),
        new Hor_TL_Wall(450, 0),
        new Hor_BL_Wall(450, 0),
        new Hor_BR_Wall(450, 0),
        new Ver_BL_Wall(200, 0),
        new Ver_BR_Wall(200, 0),
        new Ver_TR_Wall(200, 0),
        new Ver_TL_Wall(200, 0)
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
        new AbstractWall(75, 75, 275, null, 275, null),
        new AbstractWall(75, 75, null, 275, 275, null),
        new AbstractWall(75, 75, null, 275, null, 275),
        new AbstractWall(75, 75, 275, null, null, 275)
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
        new AbstractWall(300, 100, 100, null, 200, null),
        new AbstractWall(300, 100, 100, null, null, 200),
        new AbstractWall(300, 100, null, 100, 200, null),
        new AbstractWall(300, 100, null, 100, null, 200),
        new AbstractWall(150, 150, 725, null, 325, null),
        ]
    ]
]
)