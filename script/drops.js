import { Interactable } from "./interactables.js"
import { getWeaponSpecs } from "./weapon-specs.js"

class Drop extends Interactable {
    constructor(width, left, top, name, title, popup, amount, space) {
        super(width, left, top, name, title, popup, false, amount, space)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "bandage", "bandage", "Pick up", amount, 1)
    }
}

export class Coin extends Drop {
    constructor(left, top, amount) {
        super(25, left, top, "coin", "coin", "Pick up", amount, 1)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "hardDrive", "hard drive", "Pick up", amount, 1)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "pistolAmmo", "pistol ammo", "Pick up", amount, 1)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "shotgunShells", "shotgun shells", "Pick up", amount, 1)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "magnumAmmo", "magnum ammo", "Pick up", amount, 1)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "smgAmmo", "smg ammo", "Pick up", amount, 1)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "rifleAmmo", "rifle ammo", "Pick up", amount, 1)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, title) {
        super(70, left, top, name, title, "Pick up", 1, getWeaponSpecs().get(name).space)
    }
}