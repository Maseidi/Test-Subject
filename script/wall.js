export class Wall {
    constructor(width, height, left, right, top, bottom, background, side) {
        this.width =      width      ?? 0
        this.height =     height     ?? 0
        this.left =       left       ?? null
        this.right =      right      ?? null
        this.top =        top        ?? null
        this.bottom =     bottom     ?? null
        this.background = background ?? 'lightslategray'
        this.side =       side       ?? false
    }
}