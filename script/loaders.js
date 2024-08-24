class Loader {
    constructor(className, width, height, left, top, right, bottom, door) {
        this.className = className
        this.width = width
        this.height = height
        this.left = left
        this.top = top
        this.right = right
        this.bottom = bottom
        this.door = door
    }
}

class LeftLoader_FromTop extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, -26, top, undefined, undefined, door)
    }
}

class LeftLoader_FromBottom extends Loader {
    constructor(className, height, bottom, door) {
        super(className, 5, height, -26, undefined, undefined, bottom, door)
    }
}

class RightLoader_FromTop extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, undefined, top, -26, undefined, door)
    }
}

class RightLoader_FromBottom extends Loader {
    constructor(className, height, bottom, door) {
        super(className, 5, height, undefined, undefined, -26, bottom, door)
    }
}

class TopLoader_FromLeft extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, -26, undefined, undefined, door)
    }
}

class TopLoader_FromRight extends Loader {
    constructor(className, width, right, door) {
        super(className, width, 5, undefined, -26, right, undefined, door)
    }
}

class BottomLoader_FromLeft extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, undefined, undefined, -26, door)
    }
}

class BottomLoader_FromRight extends Loader {
    constructor(className, width, right, door) {
        super(className, width, 5, undefined, undefined, right, -26, door)
    }
}

class Door {
    constructor(color, progress, heading, popup, progress2Active, killAll) {
        this.color = color
        this.progress = progress
        this.heading = heading
        this.popup = popup
        this.progress2Active = progress2Active
        this.killAll = killAll
    }
}

export const loaders = new Map([
    [1, [
        new RightLoader_FromTop(2, 100, 300),
        new RightLoader_FromBottom(3, 100, 300),
        new BottomLoader_FromRight(4, 100, 300),
        new BottomLoader_FromLeft(5, 100, 300),
        new LeftLoader_FromBottom(6, 100, 300),
        new LeftLoader_FromTop(7, 100, 300),
        new TopLoader_FromLeft(8, 200, 450),
        ]
    ], 
    [2, [
        new LeftLoader_FromBottom(1, 100, 0),
        new TopLoader_FromRight(9, 100, 0)
        ]
    ],
    [3, [
        new LeftLoader_FromTop(1, 100, 0),
        new BottomLoader_FromRight(10, 100, 0)
        ]
    ],
    [4, [
        new TopLoader_FromRight(1, 100, 0),
        new BottomLoader_FromRight(11, 100, 0)
        ]
    ],
    [5, [
        new TopLoader_FromRight(1, 100, 0),
        new LeftLoader_FromBottom(12, 100, 0)
        ]
    ],
    [6, [
        new RightLoader_FromBottom(1, 100, 0),
        new LeftLoader_FromBottom(13, 100, 0)
        ]
    ],
    [7, [
        new RightLoader_FromBottom(1, 100, 0),
        new TopLoader_FromLeft(14, 100, 0)
        ]
    ],
    [8, [
        new BottomLoader_FromRight(1, 200, 650)
        ]
    ],
    [9, [
        new BottomLoader_FromLeft(2, 100, 450),
        new LeftLoader_FromBottom(15, 100, 200),
        new TopLoader_FromLeft(16, 100, 450),
        new RightLoader_FromBottom(17, 100, 200),
        ]
    ],
    [15, [
        new RightLoader_FromBottom(9, 100, 0),
        new LeftLoader_FromBottom(18, 200, 1400/4),
        new LeftLoader_FromBottom(19, 200, (1400/2) + 200),
        new LeftLoader_FromTop(20, 200, 1400/4),
        ]
    ],
    [16, [
        new BottomLoader_FromLeft(9, 100, 100, 
            new Door('red', '15', 'doorway to heaven', 'dignity')),
        new LeftLoader_FromTop(37, 100, 400),
        new TopLoader_FromLeft(38, 250, 475),
        new RightLoader_FromTop(39, 300, 300)
        ]
    ],
    [18, [
        new RightLoader_FromBottom(15, 200, 100),
        new BottomLoader_FromRight(21, 100, 200),
        new BottomLoader_FromLeft(22, 100, 500),
        new BottomLoader_FromLeft(23, 100, 200),
        ]
    ],
    [19, [
        new RightLoader_FromBottom(15, 200, 100),
        new LeftLoader_FromTop(24, 100, 150)
        ]
    ],
    [20, [
        new RightLoader_FromBottom(15, 200, 100),
        new TopLoader_FromRight(25, 100, 200),
        new TopLoader_FromLeft(26, 100, 500),
        new TopLoader_FromLeft(27, 100, 200)     
        ]
    ],
    [21, [
        new TopLoader_FromLeft(18, 100, 200)
        ]
    ],
    [22, [
        new TopLoader_FromLeft(18, 100, 0),
        new BottomLoader_FromLeft(28, 100, 0),
        ]
    ],
    [23, [
        new TopLoader_FromLeft(18, 100, 200)
        ]
    ],
    [24, [
        new RightLoader_FromBottom(19, 100, 250),
        new RightLoader_FromTop(29, 150, 275),
        new RightLoader_FromBottom(30, 150, 550),
        new LeftLoader_FromTop(31, 205, 445),
        new LeftLoader_FromBottom(32, 125, 375),
        new TopLoader_FromLeft(33, 150, 150)
        ]
    ],
    [25, [
        new BottomLoader_FromLeft(20, 100, 450),
        new LeftLoader_FromTop(34, 100, 450),
        new RightLoader_FromTop(35, 100, 450),
        new TopLoader_FromLeft(36, 100, 450),
        ]
    ],
    [26, [
        new BottomLoader_FromLeft(20, 100, 100)
        ]
    ],
    [27, [
        new BottomLoader_FromRight(20, 100, 200)
        ]
    ],
    [28, [
        new TopLoader_FromLeft(22, 100, 450)
        ]
    ],
    [29, [
        new LeftLoader_FromBottom(24, 150, 25)
        ]
    ],
    [30, [
        new LeftLoader_FromBottom(24, 150, 125)
        ]
    ],
    [31, [
        new RightLoader_FromBottom(24, 205, 210)
        ]
    ],
    [32, [
        new RightLoader_FromBottom(24, 125, 0)
        ]
    ],
    [33, [
        new BottomLoader_FromRight(24, 150, 0)
        ]
    ],
    [34, [
        new RightLoader_FromTop(25, 100, 100)
        ]
    ],
    [35, [
        new LeftLoader_FromTop(25, 100, 100)
        ]
    ],
    [36, [
        new BottomLoader_FromLeft(25, 100, 300)
        ]
    ],
    [37, [
        new RightLoader_FromTop(16, 100, 350),
        new TopLoader_FromLeft(62, 100, 240),
        new TopLoader_FromLeft(63, 100, 580),
        new TopLoader_FromRight(64, 100, 240, new Door('green', undefined, 'Door 1', 'Sacrifice', '15', '3')),
        new TopLoader_FromRight(65, 100, 580, new Door('yellow', '13', 'Door 2', 'Chivalry'))
        ]
    ],
    [38, [ 
        new BottomLoader_FromLeft(16, 250, 375),
        new TopLoader_FromLeft(40, 200, 400)
        ]
    ],
    [39, [
        new LeftLoader_FromTop(16, 300, 50),
        new TopLoader_FromLeft(66, 150, 1100/3),
        new TopLoader_FromRight(67, 150, 1100/3),
        new BottomLoader_FromLeft(68, 150, 1100/3),
        new BottomLoader_FromRight(69, 150, 1100/3),
        new RightLoader_FromTop(70, 100, 150)
        ]
    ],
    [40, [
        new BottomLoader_FromLeft(38, 200, 400),
        new LeftLoader_FromBottom(41, 300, 300),
        new LeftLoader_FromBottom(42, 300, 900),
        new RightLoader_FromBottom(43, 300, 300),
        new RightLoader_FromBottom(44, 300, 900),
        new TopLoader_FromLeft(45, 200, 400)
        ]
    ],
    [41, [
        new RightLoader_FromBottom(40, 300, 200),
        new TopLoader_FromLeft(46, 100, 175),
        new TopLoader_FromLeft(47, 100, 450),
        new TopLoader_FromRight(48, 100, 175),
        ]
    ],
    [42, [
        new RightLoader_FromTop(40, 300, 200),
        new LeftLoader_FromTop(58, 100, 300)
        ]
    ],
    [43, [
        new LeftLoader_FromTop(40, 300, 200),
        new RightLoader_FromTop(59, 100, 300)
        ]
    ],
    [44, [
        new LeftLoader_FromBottom(40, 300, 200),
        new BottomLoader_FromLeft(52, 100, 175),
        new BottomLoader_FromLeft(53, 100, 450),
        new BottomLoader_FromRight(54, 100, 175),
        ]
    ],
    [45, [
        new BottomLoader_FromLeft(40, 200, 500)
        ]
    ],
    [46, [
        new BottomLoader_FromLeft(41, 100, 25),
        new TopLoader_FromLeft(49, 100, 25)
        ]
    ],
    [47, [
        new BottomLoader_FromLeft(41, 100, 25),
        new TopLoader_FromLeft(50, 100, 25)
        ]
    ],
    [48, [
        new BottomLoader_FromLeft(41, 100, 25),
        new TopLoader_FromLeft(51, 100, 25)
        ]
    ],
    [49, [
        new BottomLoader_FromRight(46, 100, 0)
        ]
    ],
    [50, [
        new BottomLoader_FromRight(47, 100, 450)
        ]
    ],
    [51, [
        new BottomLoader_FromLeft(48, 100, 0)
        ]
    ],
    [52, [
        new TopLoader_FromLeft(44, 100, 25),
        new BottomLoader_FromLeft(55, 100, 25)
        ]
    ],
    [53, [
        new TopLoader_FromLeft(44, 100, 25),
        new BottomLoader_FromLeft(56, 100, 25)
        ]
    ],
    [54, [
        new TopLoader_FromLeft(44, 100, 25),
        new BottomLoader_FromLeft(57, 100, 25)
        ]
    ],
    [55, [
        new TopLoader_FromLeft(52, 100, 0)
        ]
    ],
    [56, [
        new TopLoader_FromLeft(53, 100, 450)
        ]
    ],
    [57, [
        new TopLoader_FromRight(54, 100, 0)
        ]
    ],
    [58, [
        new RightLoader_FromBottom(42, 100, 0),
        new TopLoader_FromLeft(60, 100, 0)
        ]
    ],
    [59, [
        new LeftLoader_FromTop(43, 100, 0),
        new BottomLoader_FromRight(61, 100, 0)
        ]
    ],
    [60, [
        new BottomLoader_FromLeft(58, 100, 300)
        ]
    ],
    [61, [
        new TopLoader_FromLeft(59, 100, 300)
        ]
    ],
    [62, [
        new BottomLoader_FromRight(37, 100, 200)
        ]
    ],
    [63, [
        new BottomLoader_FromRight(37, 100, 0),
        new LeftLoader_FromTop(71, 100, 0)
        ]
    ],
    [64, [
        new BottomLoader_FromLeft(37, 100, 200)
        ]
    ],
    [65, [
        new BottomLoader_FromLeft(37, 100, 0),
        new RightLoader_FromTop(72, 100, 0)
        ]
    ],
    [71, [
        new RightLoader_FromBottom(63, 100, 0)
        ]
    ],
    [72, [
        new LeftLoader_FromBottom(65, 100, 0)
        ]
    ]
])