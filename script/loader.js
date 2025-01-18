import { getLoaders } from './entities.js'
import { getPasswords } from './password-manager.js'
import { getCurrentRoomId } from './variables.js'

class Loader {
    constructor(className, width, height, left, top, right, bottom, door) {
        this.className = className ?? null
        this.width = width ?? 0
        this.height = height ?? 0
        this.left = left ?? null
        this.top = top ?? null
        this.right = right ?? null
        this.bottom = bottom ?? null
        this.door = door ?? null
    }
}

export class LeftLoader extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, -26, top, null, null, door)
    }
}

export class RightLoader extends Loader {
    constructor(className, height, top, door) {
        super(className, 5, height, null, top, -26, null, door)
    }
}

export class TopLoader extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, -26, null, null, door)
    }
}

export class BottomLoader extends Loader {
    constructor(className, width, left, door) {
        super(className, width, 5, left, null, null, -26, door)
    }
}

export class Door {
    constructor(heading, popup, key, progress, code) {
        this.name = 'door'
        this.heading = heading ?? null
        this.popup = popup ?? null
        this.key = key ?? null
        this.renderProgress = progress?.renderProgress ?? null
        this.progress2Active = progress?.progress2Active ?? []
        this.killAll = progress?.killAll ?? null
        this.type = Math.random() < 0.5 ? 1 : 2
        this.code = code ?? null

        this.value = code
            ? (() => {
                  let result = ''
                  for (let i = 0; i < getPasswords().get(code).toString().length; i++) result += '0'
                  return result
              })()
            : ''
    }
}

export const getDoorObject = doorElem => {
    const loaderElem = doorElem.nextSibling
    const loaderClass = Number(loaderElem.classList[0])
    const loaderObj = getLoaders()
        .get(getCurrentRoomId())
        .find(loader => loader.className === loaderClass)
    return loaderObj.door
}
