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