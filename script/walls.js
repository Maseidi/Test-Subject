export class Wall {
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

export const walls = new Map([
    [1, [
        new Wall(75, 25, 100, null, 100),
        new Wall(75, 25, 100, null, 200),
        new Wall(75, 25, 100, null, 300),
        new Wall(75, 25, 100, null, 400),
        new Wall(75, 25, 100, null, 500),
        new Wall(75, 25, 100, null, 600),
        new Wall(75, 25, 100, null, 700),
        new Wall(75, 25, 100, null, 800),
        new Wall(75, 25, 100, null, 900),
        new Wall(75, 25, null, 100, 100),
        new Wall(75, 25, null, 100, 200),
        new Wall(75, 25, null, 100, 300),
        new Wall(75, 25, null, 100, 400),
        new Wall(75, 25, null, 100, 500),
        new Wall(75, 25, null, 100, 600),
        new Wall(75, 25, null, 100, 700),
        new Wall(75, 25, null, 100, 800),
        new Wall(75, 25, null, 100, 900),
    ]],
    [2, [
        new Wall(400, 10, 300, null, 400),
        new Wall(200, 10, 400, null, 200)
    ]],
    [3, [
        new Wall(10, 700, 200, null, 150),
        new Wall(10, 700, null, 200, 150),
        new Wall(200, 10, 400, null, null, 200)
    ]],
    [4, [
        
    ]]
])