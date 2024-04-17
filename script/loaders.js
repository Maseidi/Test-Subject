export class Loader {
    constructor(className, width, height, left, top, right, bottom) {
        this.className = className
        this.width = width
        this.height = height
        this.left = left
        this.top = top
        this.right = right
        this.bottom = bottom
    }
}

export class LeftLoader_FromTop extends Loader {
    constructor(className, height, top) {
        super(className, 5, height, -26, top, undefined, undefined)
    }
}

export class LeftLoader_FromBottom extends Loader {
    constructor(className, height, bottom) {
        super(className, 5, height, -26, undefined, undefined, bottom)
    }
}

export class RightLoader_FromTop extends Loader {
    constructor(className, height, top) {
        super(className, 5, height, undefined, top, -26, undefined)
    }
}

export class RightLoader_FromBottom extends Loader {
    constructor(className, height, bottom) {
        super(className, 5, height, undefined, undefined, -26, bottom)
    }
}

export class TopLoader_FromLeft extends Loader {
    constructor(className, width, left) {
        super(className, width, 5, left, -26, undefined, undefined)
    }
}

export class TopLoader_FromRight extends Loader {
    constructor(className, width, right) {
        super(className, width, 5, undefined, -26, right, undefined)
    }
}

export class BottomLoader_FromLeft extends Loader {
    constructor(className, width, left) {
        super(className, width, 5, left, undefined, undefined, -26)
    }
}

export class BottomLoader_FromRight extends Loader {
    constructor(className, width, right) {
        super(className, width, 5, undefined, undefined, right, -26)
    }
}