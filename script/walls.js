export class AbstractWall {
    constructor(width, height, left, right, top, bottom) {
        this.width = width
        this.height = height
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
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
        super(width, height, left, right, top, bottom)
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

export class Ver_TL_Wall extends VerWall {
    constructor(height, top) {
        super(height, "tl", top)
    }
}

export class Ver_TR_Wall extends VerWall {
    constructor(height, top) {
        super(height, "tr", top)
    }
}

export class Ver_BL_Wall extends VerWall {
    constructor(height, bottom) {
        super(height, "bl", bottom)
    }
}

export class Ver_BR_Wall extends VerWall {
    constructor(height, bottom) {
        super(height, "br", bottom)
    }
}

export class Hor_TL_Wall extends HorWall {
    constructor(width, left) {
        super(width, "tl", left)
    }
}

export class Hor_TR_Wall extends HorWall {
    constructor(width, right) {
        super(width, "tr", right)
    }
}

export class Hor_BL_Wall extends HorWall {
    constructor(width, left) {
        super(width, "bl", left)
    }
}

export class Hor_BR_Wall extends HorWall {
    constructor(width, right) {
        super(width, "br", right)
    }
}