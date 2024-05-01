import { Interactable } from "./interactables.js"
import { getWeaponSpecs } from "./weapon-specs.js"

export class Drop extends Interactable {
    constructor(width, left, top, name, heading, popup, amount, space, description) {
        super(width, left, top, name, heading, popup, false, amount, space, description)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "bandage", "bandage", "Pick up", amount, 1, "Might come in handy in case of injuries")
    }
}

export class Coin extends Drop {
    constructor(left, top, amount) {
        super(25, left, top, "coin", "coin", "Pick up", amount, 1, "A neccesity when trading with the vending machine")
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "hardDrive", "hard drive", "Pick up", amount, 1, "PC needs one of these to save your progress")
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "pistolAmmo", "pistol ammo", "Pick up", amount, 1, "Ammo for all sorts of handguns")
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "shotgunShells", "shotgun shells", "Pick up", amount, 1, "Shells for all sorts of shotguns")
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "magnumAmmo", "magnum ammo", "Pick up", amount, 1, "Ammo for all sorts of magnums")
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "smgAmmo", "smg ammo", "Pick up", amount, 1, "Ammo for all sorts of sub-machine guns")
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "rifleAmmo", "rifle ammo", "Pick up", amount, 1, "Ammo for all sorts of rifles")
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, heading, currMag, damageLvl, rangeLvl, reloadSpeedLvl, magazineLvl, fireRateLvl) {
        super(70, left, top, name, heading, "Pick up", 1, getWeaponSpecs().get(name).space, getWeaponSpecs().get(name).description)
        this.currMag = currMag
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadSpeedLvl = reloadSpeedLvl
        this.magazineLvl = magazineLvl
        this.fireRateLvl = fireRateLvl
    }
}