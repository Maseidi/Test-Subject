import { getWeaponSpecs } from "./weapon-specs.js"

class Interactable {
    constructor(width, left, top, name, heading, popup, solid, amount, space, description, price) {
        this.width = width
        this.left = left
        this.top = top
        this.name = name
        this.heading = heading
        this.popup = popup
        this.solid = solid
        this.amount = amount
        this.space = space
        this.description = description
        this.price = price
    }
}

class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, "computer", "computer", "Save game", true, undefined, undefined, undefined, undefined)
    }
}

class Stash extends Interactable {
    constructor(left, top) {
        super(80, left, top, "stash", "stash", "Open stash", true, undefined, undefined, undefined, undefined)
    }
}

class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, "vendingMachine", "vending machine", "Trade", true, undefined, undefined, undefined, undefined)
    }
}

export class Drop extends Interactable {
    constructor(width, left, top, name, heading, popup, amount, space, description, price) {
        super(width, left, top, name, heading, popup, false, amount, space, description, price)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "bandage", "bandage", "Pick up", amount, 1, "Might come in handy in case of injuries", 1/3)
    }
}

class Coin extends Drop {
    constructor(left, top, amount) {
        super(25, left, top, "coin", "coin", "Pick up", amount, 1, "A neccesity when trading with the vending machine", undefined)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "hardDrive", "hard drive", "Pick up", amount, 1, "PC needs one of these to save your progress", 1/2)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, "pistolAmmo", "pistol ammo", "Pick up", amount, 1, "Ammo for all sorts of handguns", 1/30)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "shotgunShells", "shotgun shells", "Pick up", amount, 1, "Shells for all sorts of shotguns", 1/20)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "magnumAmmo", "magnum ammo", "Pick up", amount, 1, "Ammo for all sorts of magnums", 1/5)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, "smgAmmo", "smg ammo", "Pick up", amount, 1, "Ammo for all sorts of sub-machine guns", 1/90)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, "rifleAmmo", "rifle ammo", "Pick up", amount, 1, "Ammo for all sorts of rifles", 1/10)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, currMag, damageLvl, rangeLvl, reloadSpeedLvl, magazineLvl, fireRateLvl) {
        super(
            70,
            left,
            top,
            name,
            getWeaponSpecs().get(name).heading,
            "Pick up",
            1,
            getWeaponSpecs().get(name).space,
            getWeaponSpecs().get(name).description,
            getWeaponSpecs().get(name).price)
        this.currMag = currMag
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadSpeedLvl = reloadSpeedLvl
        this.magazineLvl = magazineLvl
        this.fireRateLvl = fireRateLvl
    }
}

export const interactables = new Map([
    [1 ,
        [
        new Coin(100, 100, 2),
        new Bandage(300, 300, 4),
        new HardDrive(500, 500, 3),
        new PC(700, 700),
        new Stash(900, 900),
        new WeaponDrop(700, 900, "remington1858", 0, 1, 1, 1, 1, 1),
        new WeaponDrop(100, 900, "sniper", 0, 1, 1, 1, 1, 1),
        new WeaponDrop(200, 950, "riotgun", 0, 1, 1, 1, 1, 1),
        new WeaponDrop(300, 1000, "mauser", 0, 1, 1, 1, 1, 1),
        new PistolAmmo(200, 700, 10),
        new ShotgunShells(300, 800, 11),
        new SmgAmmo(200, 400, 100),
        new MagnumAmmo(500, 100, 1),
        new RifleAmmo(400, 100, 2),
        new VendingMachine(900, 100)
        ]
    ], [2, 
        []
    ],[3, 
        []
    ],[4, 
        []
    ],[5, 
        []
    ],[6, 
        []
    ],[7, 
        []
    ],[8, 
        []
    ],[9, 
        []
    ],[10, 
        []
    ],[11, 
        []
    ],[12, 
        []
    ],[13, 
        []
    ],[14, 
        []
    ],[15, 
        []
    ],[16, 
        []
    ],[17, 
        []
    ],[18, 
        []
    ],[19, 
        []
    ],[20, 
        []
    ],[21, 
        []
    ],[22, 
        []
    ],[23, 
        []
    ],[24, 
        []
    ],[25, 
        []
    ],[26, 
        []
    ],[27, 
        []
    ],[28, 
        []
    ],[29, 
        []
    ],[30, 
        []
    ],[31, 
        []
    ],[32, 
        []
    ],[33, 
        []
    ],[34, 
        []
    ],[35, 
        []
    ],[36, 
        []
    ],[37, 
        []
    ],[38, 
        []
    ],[39, 
        []
    ],[40, 
        []
    ],[41, 
        []
    ],[42, 
        []
    ],[43, 
        []
    ],[44, 
        []
    ],[45, 
        []
    ],[46, 
        []
    ],[47, 
        []
    ],[48, 
        []
    ],[49, 
        []
    ],[50, 
        []
    ],[51, 
        []
    ],[52, 
        []
    ],[53, 
        []
    ],[54, 
        []
    ],[55, 
        []
    ],[56, 
        []
    ],[57, 
        []
    ],[58, 
        []
    ],[59, 
        []
    ],[60, 
        []
    ],[61, 
        []
    ],[62, 
        []
    ],[63, 
        []
    ],[64, 
        []
    ],[65, 
        []
    ],[66, 
        []
    ],[67, 
        []
    ],[68, 
        []
    ],[69, 
        []
    ],[70, 
        []
    ],[71, 
        []
    ],[72, 
        []
    ],[73, 
        []
    ],[74, 
        []
    ],[75, 
        []
    ],[76, 
        []
    ],[77, 
        []
    ],[78, 
        []
    ],[78, 
        []
    ],[79, 
        []
    ],[80, 
        []
    ],[81, 
        []
    ],[82, 
        []
    ],[83, 
        []
    ],[84, 
        []
    ]
])