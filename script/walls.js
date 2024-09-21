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
        new Wall(400, 50, 300, null, 300),
        new Wall(200, 50, 400, null, 100)
    ]],
    [3, [
        new Wall(50, 700, 200, null, 150),
        new Wall(50, 700, null, 200, 150),
        new Wall(200, 50, 400, null, null, 200)
    ]],
    [4, [
        new Wall(500, 50, 125, null, 200),
        new Wall(500, 50, 125, null, null, 200),
    ]],
    [5, [
        new Wall(100, 100, 200, null, 250),
        new Wall(100, 100, 500, null, 250),
    ]],
    [6, [
        new Wall(100, 600, 300, null, 200),
        new Wall(100, 600, 700, null, 200),
        new Wall(100, 600, 1100, null, 200),
        new Wall(100, 600, 1500, null, 200),
    ]],
    [7, [
        new Wall(200, 200, 200, null, 200),
        new Wall(200, 200, 200, null, 600),
        new Wall(200, 200, null, 200, 200),
        new Wall(200, 200, null, 200, 600),
    ]]
])