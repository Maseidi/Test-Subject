import { getWeaponDetails } from './weapon-details.js'

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
        super(50, left, top, 'computer', 'computer', 'Save game', true, undefined, undefined, undefined, undefined)
    }
}

class Stash extends Interactable {
    constructor(left, top) {
        super(80, left, top, 'stash', 'stash', 'Open stash', true, undefined, undefined, undefined, undefined)
    }
}

class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, 'vendingMachine', 'vending machine', 'Trade', true, undefined, undefined, undefined, undefined)
    }
}

class Crate extends Interactable {
    constructor(left, top) {
        super(35, left, top, 'crate', 'crate', 'Break', true, undefined, undefined, undefined, undefined)
    }
}

export class Drop extends Interactable {
    constructor(width, left, top, name, heading, popup, amount, space, description, price) {
        super(width, left, top, name, heading, popup, false, amount, space, description, price)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, 'bandage', 'bandage', 'Pick up', amount, 1, 'Might come in handy in case of injuries', 1/3)
    }
}

export class Coin extends Drop {
    constructor(left, top, amount) {
        super(25, left, top, 'coin', 'coin', 'Pick up', amount, 1, 'A neccesity when trading with the vending machine', undefined)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, 'hardDrive', 'hard drive', 'Pick up', amount, 1, 'PC needs one of these to save your progress', 1/2)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount) {
        super(50, left, top, 'pistolAmmo', 'pistol ammo', 'Pick up', amount, 1, 'Ammo for all sorts of handguns', 1/30)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, 'shotgunShells', 'shotgun shells', 'Pick up', amount, 1, 'Shells for all sorts of shotguns', 1/20)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, 'magnumAmmo', 'magnum ammo', 'Pick up', amount, 1, 'Ammo for all sorts of magnums', 1/5)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount) {
        super(40, left, top, 'smgAmmo', 'smg ammo', 'Pick up', amount, 1, 'Ammo for all sorts of sub-machine guns', 1/90)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, 'rifleAmmo', 'rifle ammo', 'Pick up', amount, 1, 'Ammo for all sorts of rifles', 1/10)
    }
}

export class Antidote extends Drop {
    constructor(left, top, amount) {
        super(30, left, top, 'antidote', 'antidote', 'Pick up', amount, 1, 'An emergency when poison is all over the place', 1/3)
    }
}

export class Grenade extends Drop {
    constructor(left, top, amount) {
        super(20, left, top, 'grenade', 'grenade', 'Pick up', amount, 1, 'Toss one to witness your foes fly high!', 1/2)
    }
}

export class Flashbang extends Drop {
    constructor(left, top, amount) {
        super(20, left, top, 'flashbang', 'flashbang', 'Pick up', amount, 1, 
              'Blinding enemies can be a game changer in many situations', 1/3)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, currmag, damageLvl, rangeLvl, reloadspeedLvl, magazineLvl, fireratelvl) {
        super(
            70,
            left,
            top,
            name,
            getWeaponDetails().get(name).heading,
            'Pick up',
            1,
            getWeaponDetails().get(name).space,
            getWeaponDetails().get(name).description,
            getWeaponDetails().get(name).price)
        this.currmag = currmag
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadspeedLvl = reloadspeedLvl
        this.magazineLvl = magazineLvl
        this.fireratelvl = fireratelvl
        this.ammotype = getWeaponDetails().get(name).ammotype
    }
}

export const interactables = new Map([
    [1 ,
        [
        new Coin(100, 100, 100),
        new Bandage(300, 300, 4),
        new HardDrive(500, 500, 3),
        new PC(700, 700),
        new Stash(900, 900),
        new WeaponDrop(800, 200, 'remington1858', 0, 1, 1, 1, 1, 1),
        new WeaponDrop(100, 900, 'sniper', 0, 1, 1, 1, 1, 1),
        new WeaponDrop(200, 950, 'riotgun', 0, 1, 1, 1, 1, 1),
        new WeaponDrop(300, 1000, 'mauser', 0, 1, 1, 1, 1, 1),
        new PistolAmmo(200, 700, 10),
        new ShotgunShells(300, 800, 11),
        new SmgAmmo(200, 400, 100),
        new MagnumAmmo(500, 100, 1),
        new RifleAmmo(400, 100, 2),
        new VendingMachine(900, 100),
        new Crate(900, 300),
        new Crate(900, 400),
        new Crate(900, 500),
        new Crate(900, 600),
        new Crate(900, 700),
        new Crate(900, 800),
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
        [
        new WeaponDrop(500, 600, 'famas', 10, 1, 1, 1, 1, 1),
        new SmgAmmo(500, 700, 300),
        new Bandage(600, 700, 5),
        new Antidote(600, 600, 5),
        new Grenade(500, 800, 3),
        new Flashbang(600, 800, 5),
        new Flashbang(700, 800, 2),
        ]
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