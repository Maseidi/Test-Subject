import { getWeaponDetails } from './weapon-details.js'
import { 
    BANDAGE_LOOT,
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    Loot,
    MAGNUM_AMMO_LOOT,
    P90,
    PISTOL4,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT, 
    SingleLoot } from './loot.js'

class Interactable {
    constructor(width, left, top, name, heading, popup, solid, amount, space, description, price, progress, killAll, progress2Active) {
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
        this.progress = progress ?? '0'
        this.killAll= killAll
        this.progress2Active = progress2Active
    }
}

class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, 'computer', 'computer', 'Save game', true)
    }
}

class Stash extends Interactable {
    constructor(left, top) {
        super(80, left, top, 'stash', 'stash', 'Open stash', true)
    }
}

class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, 'vendingMachine', 'vending machine', 'Trade', true)
    }
}

class Crate extends Interactable {
    constructor(left, top, loot, progress, killAll) {
        super(35, left, top, 'crate', 'crate', 'Break', true, undefined, undefined, undefined, undefined, progress, killAll)
        this.loot = loot.name
        this['loot-amount'] = loot.amount
        this['loot-progress'] = loot.progress2Active
    }
}

export class Drop extends Interactable {
    constructor(width, left, top, name, heading, popup, amount, space, description, price, progress, killAll, progress2Active) {
        super(width, left, top, name, heading, popup, false, amount, space, description, price, progress, killAll, progress2Active)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(50, left, top, 'bandage', 'bandage', 'Pick up', amount, 1, 
            'Might come in handy in case of injuries', 1/3, progress, killAll, progress2Active)
    }
}

export class Coin extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(25, left, top, 'coin', 'coin', 'Pick up', amount, 1, 
            'A neccesity when trading with the vending machine', undefined, progress, killAll, progress2Active)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(30, left, top, 'hardDrive', 'hard drive', 'Pick up', amount, 1, 
            'PC needs one of these to save your progress', 1/2, progress, killAll, progress2Active)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(50, left, top, 'pistolAmmo', 'pistol ammo', 'Pick up', amount, 1, 
            'Ammo for all sorts of handguns', 1/30, progress, killAll, progress2Active)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(40, left, top, 'shotgunShells', 'shotgun shells', 'Pick up', amount, 1, 
            'Shells for all sorts of shotguns', 1/20, progress, killAll, progress2Active)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(40, left, top, 'magnumAmmo', 'magnum ammo', 'Pick up', amount, 1, 
            'Ammo for all sorts of magnums', 1/5, progress, killAll, progress2Active)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(40, left, top, 'smgAmmo', 'smg ammo', 'Pick up', amount, 1, 
            'Ammo for all sorts of sub-machine guns', 1/90, progress, killAll, progress2Active)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(30, left, top, 'rifleAmmo', 'rifle ammo', 'Pick up', amount, 1, 
            'Ammo for all sorts of rifles', 1/10, progress, killAll, progress2Active)
    }
}

export class Antidote extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(30, left, top, 'antidote', 'antidote', 'Pick up', amount, 1, 
            'An emergency when poison is all over the place', 1/3, progress, killAll, progress2Active)
    }
}

export class Grenade extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(20, left, top, 'grenade', 'grenade', 'Pick up', amount, 1, 
            'Toss one to witness your foes fly high!', 1/2, progress, killAll, progress2Active)
    }
}

export class Flashbang extends Drop {
    constructor(left, top, amount, progress, killAll, progress2Active) {
        super(20, left, top, 'flashbang', 'flashbang', 'Pick up', amount, 1, 
              'Blinding enemies can be a game changer in many situations', 1/3, progress, killAll, progress2Active)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, currmag, damageLvl, rangeLvl, 
        reloadspeedLvl, magazineLvl, fireratelvl, progress, killAll, progress2Active) {
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
            getWeaponDetails().get(name).price,
            progress, 
            killAll, 
            progress2Active
        )
        this.currmag = currmag
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadspeedLvl = reloadspeedLvl
        this.magazineLvl = magazineLvl
        this.fireratelvl = fireratelvl
        this.ammotype = getWeaponDetails().get(name).ammotype
    }
}

export class KeyDrop extends Drop {
    constructor(left, top, code, heading, unlocks, progress, killAll, progress2Active) {
        super(20, left, top, `key-${code}`, heading, 'Pick up', 1, 1, heading, undefined, progress, killAll, progress2Active)
        this.unlocks = unlocks
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
        new Crate(900, 300, new Loot(GRENADE_LOOT, 1)),
        new Crate(900, 400, new Loot(FLASHBANG_LOOT, 2)),
        new Crate(900, 500, new Loot(MAGNUM_AMMO_LOOT, 3)),
        new Crate(900, 600, new Loot(RIFLE_AMMO_LOOT, 4)),
        new Crate(900, 700, new Loot(SHOTGUN_SHELLS_LOOT, 5)),
        new Crate(900, 800, new SingleLoot(P90)),
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
        new WeaponDrop(500, 600, 'famas', 50, 5, 5, 5, 5, 5, undefined, undefined, '17'),
        new SmgAmmo(500, 700, 90),
        new Bandage(600, 700, 5),
        new Antidote(600, 600, 5),
        new Grenade(500, 800, 3, undefined, undefined, '16'),
        new Flashbang(600, 800, 5, '13'),
        new Flashbang(700, 800, 2),
        new KeyDrop(800, 800, 1, 'The key of sacrifice', 'test', undefined, '17', '19'),
        new WeaponDrop(900, 800, 'ppsh', 30, 1, 1, 1, 1, 1, '21', undefined, '22')
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
        [
        new PistolAmmo(100, 100, 10, '3'),
        new ShotgunShells(200, 100, 11, '4'),
        new SmgAmmo(300, 100, 100, '5'),
        new MagnumAmmo(400, 100, 1, '6'),
        new RifleAmmo(500, 100, 2, undefined, '12'),
        new Crate(600, 100, new SingleLoot(PISTOL4), undefined, '12')
        ]
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