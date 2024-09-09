import { Progress } from './progress.js'
import { getPasswords } from './password-manager.js'

class Loader {
    constructor(className, width, height, left, top, right, bottom, door) {
        this.className = className ?? null
        this.width =     width     ?? 0
        this.height =    height    ?? 0
        this.left =      left      ?? null
        this.top =       top       ?? null
        this.right =     right     ?? null
        this.bottom =    bottom    ?? null
        this.door =      door      ?? null
    }
}

class LeftLoader_FromTop extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, -26, top, null, null, door)
    }
}

class LeftLoader_FromBottom extends Loader {
    constructor(className, height, bottom, door) {
        super(className, 5, height, -26, null, null, bottom, door)
    }
}

class RightLoader_FromTop extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, null, top, -26, null, door)
    }
}

class RightLoader_FromBottom extends Loader {
    constructor(className, height, bottom, door) {
        super(className, 5, height, null, null, -26, bottom, door)
    }
}

class TopLoader_FromLeft extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, -26, null, null, door)
    }
}

class TopLoader_FromRight extends Loader {
    constructor(className, width, right, door) {
        super(className, width, 5, null, -26, right, null, door)
    }
}

class BottomLoader_FromLeft extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, null, null, -26, door)
    }
}

class BottomLoader_FromRight extends Loader {
    constructor(className, width, right, door) {
        super(className, width, 5, null, null, right, -26, door)
    }
}

class Door {
    constructor(color, heading, popup, key, progress, code) {
        this.name = 'door'
        this.color = color
        this.heading = heading
        this.popup = popup
        this.key = key
        this.removeProgress = progress?.removeProgress ?? progress?.progress2Active
        this.progress2Active = progress?.progress2Active
        this.killAll = progress?.killAll
        this.type = Math.random() < 0.5 ? 1 : 2
        this.code = code
        this.value = code ? (() => {
            let result = ""
            for ( let i = 0; i < getPasswords().get(code).toString().length; i++ ) result += "8"
            return result
        })() : ''
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
    [9, [
        new BottomLoader_FromLeft(2, 100, 450),
        new LeftLoader_FromBottom(15, 100, 200),
        new TopLoader_FromLeft(16, 100, 450),
        new RightLoader_FromBottom(17, 100, 200),
        ]
    ],
    [16, [
        new BottomLoader_FromLeft(9, 100, 100, 
            new Door('green', 'Test door 2', 'Door for testing', null, 
                Progress.builder().setRemoveProgress('200')
            )
        ),
        new LeftLoader_FromTop(37, 100, 400, 
            new Door('red', 'Test door 1', 'Door for testing', null, 
                Progress.builder().setRemoveProgress('100')
            )
        ),
        new TopLoader_FromLeft(38, 250, 475, 
            new Door('purple', 'Test door 3', 'Door for testing', null, 
                Progress.builder().setProgress2Active('1000'), 
                'main-hall'
            )
        ),
        new RightLoader_FromTop(39, 300, 300,
            new Door('violet', 'Silver gate', 'Silver door for testing', null, null, 'silver-gate')
        )
        ]
    ],
    [37, [
        new RightLoader_FromTop(16, 100, 350),
        new TopLoader_FromLeft(62, 100, 240),
        new TopLoader_FromLeft(63, 100, 580, 
            new Door('red', 'Test door 3', 'Door for testing 3', null, 
                Progress.builder().setKillAll('10').setProgress2Active('20')
            )
        ),
        new TopLoader_FromRight(64, 100, 240, 
            new Door('green', 'Test door 1', 'Door for testing', null, 
                Progress.builder().setRemoveProgress('7').setProgress2Active('8')
            )
        ),
        new TopLoader_FromRight(65, 100, 580, 
            new Door('yellow', 'Test door 2', 'Door 2 for testing', 'test', Progress.builder().setProgress2Active('10'))
        )
    ]
    ],
])