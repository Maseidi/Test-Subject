class Interactable {
    constructor(width, left, top, name, title, popup, solid, amount) {
        this.width = width
        this.left = left
        this.top = top
        this.name = name
        this.title = title
        this.popup = popup
        this.solid = solid
        this.amount = amount
    }
}

export class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, "computer", "computer", "Save game", true, null)
    }
}

export class Stash extends Interactable {
    constructor(left, top) {
        super(80, left, top, "stash", "stash", "Open stash", true, null)
    }
}

export class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, "vendingMachine", "vending machine", "Trade", true, null)
    }
}

class Drop extends Interactable {
    constructor(width, left, top, name, title, popup, ammount) {
        super(width, left, top, name, title, popup, false, ammount)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "bandage", "bandage", "Pick up", amount)
    }
}

export class Coin extends Drop {
    constructor(left, top, amount) {
        super(25, left, top, "coin", "coin", "Pick up", amount)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "hardDrive", "hard drive", "Pick up", amount)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "pistolAmmo", "pistol ammo", "Pick up", amount)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "shotgunShells", "shotgun shells", "Pick up", amount)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "magnumAmmo", "magnum ammo", "Pick up", amount)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "smgAmmo", "smg ammo", "Pick up", amount)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "rifleAmmo", "rifle ammo", "Pick up", amount)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, title) {
        super(70, left, top, name, title, "Pick up", 1)
    }
}