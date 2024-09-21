import { Progress } from './progress.js'
import { getCurrentRoomId } from './variables.js'
import { getPasswords, initPasswords } from './password-manager.js'

initPasswords()

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

export class LeftLoader_FromTop extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, -26, top, null, null, door)
    }
}

export class RightLoader_FromTop extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, null, top, -26, null, door)
    }
}

export class TopLoader_FromLeft extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, -26, null, null, door)
    }
}

export class BottomLoader_FromLeft extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, null, null, -26, door)
    }
}

class Door {
    constructor(color, heading, popup, key, progress, code) {
        this.name =            'door'
        this.color =           color                     ?? 'red'
        this.heading =         heading                   ?? null
        this.popup =           popup                     ?? null
        this.key =             key                       ?? null
        this.renderProgress =  progress?.renderProgress  ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.killAll =         progress?.killAll         ?? null
        this.type =            Math.random() < 0.5       ? 1 : 2
        this.code =            code                      ?? null

        this.value = code ? (() => {
            let result = ''
            for ( let i = 0; i < getPasswords().get(code).toString().length; i++ ) result += '0'
            return result
        })() : ''
    }
}

export const getDoorObject = (doorElem) => {
    const loaderElem = doorElem.nextSibling
    const loaderClass = Number(loaderElem.classList[0])
    const loaderObj = loaders.get(getCurrentRoomId()).find(loader => loader.className === loaderClass)
    return loaderObj.door
}

export const loaders = new Map([
    [1, [
        new TopLoader_FromLeft(2, 100, 200, 
            new Door('black', 'Drom door', 'Danger outside', 'dorm', Progress.builder().setRenderProgress('8'))
        ),
    ]],
    [2, [
        new BottomLoader_FromLeft(1, 100, 450),
        new TopLoader_FromLeft(3, 100, 450)
    ]],
    [3, [
        new BottomLoader_FromLeft(2, 100, 450),
        new TopLoader_FromLeft(4, 100, 450,
            new Door('black', 'Bunker C Door', 'In need of right direction', null, 
                Progress.builder().setRenderProgress('12')
            )
        ),
    ]],
    [4, []]
])