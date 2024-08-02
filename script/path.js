export class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

export class Path {
    constructor(points) {
        this.points = points
    }
}

export class SinglePointPath extends Path {
    constructor(x, y) {
        super([new Point(x, y)])
    }
}

export class DoublePointPath extends Path {
    constructor(x1, y1, x2, y2) {
        super([
            new Point(x1, y1),
            new Point(x2, y2)
        ])
    }
}

export class VerDoublePointPath extends DoublePointPath {
    constructor(x, y, distance) {
        super(x, y, x, y + distance)
    }
}

export class HorDoublePointPath extends DoublePointPath {
    constructor(x, y, distance) {
        super(x, y, x + distance, y)
    }
}

export class RectPath extends Path {
    constructor(x, y, width, height) {
        super([
            new Point(x, y),
            new Point(x + width, y),
            new Point(x + width, y + height),
            new Point(x, y + height)
        ])
    }
}

export class SquarePath extends RectPath {
    constructor(x, y, width) {
        super(x, y, width, width)
    }
}