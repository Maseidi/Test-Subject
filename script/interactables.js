class Interactable {
    constructor(width, left, top, name, popup, solid, amount) {
        this.width = width
        this.left = left
        this.top = top
        this.name = name
        this.popup = popup
        this.solid = solid
        this.amount = amount
    }
}

export class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, "computer", "Save game", true, null)
    }
}

export class Stash extends Interactable {
    constructor(left, top) {
        super(80, left, top, "stash", "Open stash", true, null)
    }
}

export class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, "vending-machine", "Trade", true, null)
    }
}

class Drop extends Interactable {
    constructor(width, left, top, name, popup, ammount) {
        super(width, left, top, name, popup, false, ammount)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "bandage", "Pick up", amount)
    }
}

export class Coin extends Drop {
    constructor(left, top, amount) {
        super(25, left, top, "coin", "Pick up", amount)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "harddrive", "Pick up", amount)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "pistol-ammo", "Pick up", amount)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "shotgun-shells", "Pick up", amount)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "magnum-ammo", "Pick up", amount)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "smg-ammo", "Pick up", amount)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "rifle-ammo", "Pick up", amount)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name) {
        super(70, left, top, name, "Pick up", 1)
    }
}