import { Progress } from './progress.js'
import { getWeaponDetails } from './weapon-details.js'
import { 
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    HARDDRIVE_LOOT,
    Loot,
    MAGNUM_AMMO_LOOT,
    NOTE,
    P90,
    PISTOL2,
    PISTOL4,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT, 
    SingleLoot } from './loot.js'

class Interactable {
    constructor(width, left, top, name, heading, popup, solid, amount, space, description, price, progress) {
        this.width =             width                       ?? 0
        this.left =              left                        ?? 0
        this.top =               top                         ?? 0
        this.name =              name                        ?? null
        this.heading =           heading                     ?? null
        this.popup =             popup                       ?? null
        this.solid =             solid                       ?? false
        this.amount =            amount                      ?? 0
        this.space =             space                       ?? 0
        this.description =       description                 ?? null
        this.price =             price                       ?? 0
        this.renderProgress =    progress?.renderProgress    ?? String(Number.MAX_SAFE_INTEGER)
        this.killAll=            progress?.killAll           ?? null
        this.progress2Active =   progress?.progress2Active   ?? null
        this.progress2Deactive = progress?.progress2Deactive ?? null
    }
}

class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, 'computer', 'computer', 'Save game', true)
    }
}

class Stash extends Interactable {
    constructor(left, top) {
        super(50, left, top, 'stash', 'stash', 'Open stash', true)
    }
}

class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, 'vendingMachine', 'vending machine', 'Trade', true)
    }
}

class Crate extends Interactable {
    constructor(left, top, loot, progress) {
        super(35, left, top, 'crate', 'crate', 'Break', true, null, null, null, null, progress)
        if ( loot ) this.#initLootValues(loot)
    }

    #initLootValues(loot) {
        this['loot-name'] =        loot.name              ?? null
        this['loot-amount'] =      loot.amount            ?? 0
        this['loot-active'] =      loot.progress2Active   ?? null
        this['loot-deactive'] =    loot.progress2Deactive ?? null
        this.#initNoteLootValues(loot)
    }

    #initNoteLootValues(loot) {
        if ( loot.name === NOTE ) return
        this['loot-data'] =        loot.data        ?? null
        this['loot-code'] =        loot.code        ?? null
        this['loot-heading'] =     loot.heading     ?? null
        this['loot-description'] = loot.description ?? null
    }

}

export class Lever extends Interactable {
    constructor(left, top, progress) {
        super(30, left, top, 'lever', 'lever', 'Toggle', true, null, null, null, null, progress)
    }
}

export class Drop extends Interactable {
    constructor(width, left, top, name, heading, amount, space, description, price, progress) {
        super(width, left, top, name, heading, 'Pick up', false, amount, space, description, price, progress)
    }
}

export class Bandage extends Drop {
    constructor(left, top, amount, progress) {
        super(25, left, top, 'bandage', 'bandage', amount, 1, 
            'Might come in handy in case of injuries', 1/3, progress)
    }
}

export class Coin extends Drop {
    constructor(left, top, amount, progress) {
        super(12, left, top, 'coin', 'coin', amount, 1, 
            'A neccesity when trading with the vending machine', null, progress)
    }
}

export class HardDrive extends Drop {
    constructor(left, top, amount, progress) {
        super(15, left, top, 'hardDrive', 'hard drive', amount, 1, 
            'PC needs one of these to save your progress', 1/2, progress)
    }
}

export class PistolAmmo extends Drop {
    constructor(left, top, amount, progress) {
        super(25, left, top, 'pistolAmmo', 'pistol ammo', amount, 1, 
            'Ammo for all sorts of handguns', 1/30, progress)
    }
}

export class ShotgunShells extends Drop {
    constructor(left, top, amount, progress) {
        super(20, left, top, 'shotgunShells', 'shotgun shells', amount, 1, 
            'Shells for all sorts of shotguns', 1/20, progress)
    }
}

export class MagnumAmmo extends Drop {
    constructor(left, top, amount, progress) {
        super(20, left, top, 'magnumAmmo', 'magnum ammo', amount, 1, 
            'Ammo for all sorts of magnums', 1/5, progress)
    }
}

export class SmgAmmo extends Drop {
    constructor(left, top, amount, progress) {
        super(20, left, top, 'smgAmmo', 'smg ammo', amount, 1, 
            'Ammo for all sorts of sub-machine guns', 1/90, progress)
    }
}

export class RifleAmmo extends Drop {
    constructor(left, top, amount, progress) {
        super(15, left, top, 'rifleAmmo', 'rifle ammo', amount, 1, 
            'Ammo for all sorts of rifles', 1/10, progress)
    }
}

export class Antidote extends Drop {
    constructor(left, top, amount, progress) {
        super(15, left, top, 'antidote', 'antidote', amount, 1, 
            'An emergency when poison is all over the place', 1/3, progress)
    }
}

export class Grenade extends Drop {
    constructor(left, top, amount, progress) {
        super(10, left, top, 'grenade', 'grenade', amount, 1, 
            'Toss one to witness your foes fly high!', 1/2, progress)
    }
}

export class Flashbang extends Drop {
    constructor(left, top, amount, progress) {
        super(10, left, top, 'flashbang', 'flashbang', amount, 1, 
              'Blinding enemies can be a game changer in many situations', 1/3, progress)
    }
}

export class WeaponDrop extends Drop {
    constructor(left, top, name, currmag, damageLvl, rangeLvl, 
        reloadspeedLvl, magazineLvl, fireratelvl, progress) {
        super(
            35,
            left,
            top,
            name,
            getWeaponDetails().get(name).heading,
            1,
            getWeaponDetails().get(name).space,
            getWeaponDetails().get(name).description,
            getWeaponDetails().get(name).price,
            progress
        )
        this.currmag =        currmag ?? 0
        this.damageLvl =      damageLvl ?? 1
        this.rangeLvl =       rangeLvl ?? 1
        this.reloadspeedLvl = reloadspeedLvl ?? 1
        this.magazineLvl =    magazineLvl ?? 1
        this.fireratelvl =    fireratelvl ?? 1
        this.ammotype =       getWeaponDetails().get(name).ammotype ?? null
    }
}

export class KeyDrop extends Drop {
    constructor(left, top, code, heading, unlocks, progress) {
        super(10, left, top, `key-${code}`, heading, 1, 1, heading, null, progress)
        this.unlocks = unlocks ?? null
    }
}

export class Adrenaline extends Drop {
    constructor(left, top, amount, progress) {
        super(10, left, top, 'adrenaline', 'adrenaline', amount, 1, 
            'Increases max speed by 0.1 units. (Default speed is 5 units)', 20, progress)
    }
}

export class HealthPotion extends Drop {
    constructor(left, top, amount, progress) {
        super(5, left, top, 'healthpotion', 'health potion', amount, 1, 
            'Refills health completely and increases max health by 10 units. (Default health is 100 units)', 20, progress)
    }
}

export class LuckPills extends Drop {
    constructor(left, top, amount, progress) {
        super(15, left, top, 'luckpills', 'luck pills', amount, 1, 
            'Increases critical chance by 1.9%. (Default critical chance is 1%)', 20, progress)
    }
}

export class EnergyDrink extends Drop {
    constructor(left, top, amount, progress) {
        super(15, left, top, 'energydrink', 'energy drink', amount, 1, 
            'Refills stamina completely and increases max stamina by 60 units. (Default stamina is 600 units)', 20, progress)
    }
}

export class BodyArmor extends Drop {
    constructor(left, top, progress) {
        super(15, left, top, 'armor', 'body armor', 1, 1, 'Equipping this will reduce damage taken by 50%', 50, progress)
    }
}

export class Note extends Drop {
    constructor(left, top, heading, description, data, progress, code) {
        super(15, left, top, 'note', heading, 1, 1, description, null, progress)
        this.data =     data ?? null
        this.code =     code ?? null
        this.examined = false
    }
}

class Vaccine extends Drop {
    constructor(left, top, color, amount, progress) {
        super(20, left, top, `${color}vaccine`, `${color} vaccine`, amount, 1, 
            `Vaccine used for defusing virus ${color}`, 1/3, progress)
    }
}

export class RedVaccine extends Vaccine {
    constructor(left, top, amount, progress) {
        super(left, top, 'red', amount, progress)
    }
}

export class GreenVaccine extends Vaccine {
    constructor(left, top, amount, progress) {
        super(left, top, 'green', amount, progress)
    }
}

export class YellowVaccine extends Vaccine {
    constructor(left, top, amount, progress) {
        super(left, top, 'yellow', amount, progress)
    }
}

export class PurpleVaccine extends Vaccine {
    constructor(left, top, amount, progress) {
        super(left, top, 'purple', amount, progress)
    }
}

export class BlueVaccine extends Vaccine {
    constructor(left, top, amount, progress) {
        super(left, top, 'blue', amount, progress)
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
    ],[9, 
        []
    ],[16, 
        [
        new WeaponDrop(500, 600, 'famas', 50, 5, 5, 5, 5, 5),
        new SmgAmmo(500, 700, 90),
        new Bandage(600, 700, 5),
        new Antidote(600, 600, 5),
        new Grenade(500, 800, 3),
        new Flashbang(600, 800, 5),
        new Crate(100, 700, new Loot(HARDDRIVE_LOOT, 2), Progress.builder().setKillAll('1')),
        new RedVaccine(200, 700, 2, Progress.builder().setKillAll('4')),
        new KeyDrop(300, 700, 3, 'Test key', 'beauty', Progress.builder().setRenderProgress('6'))
        ]
    ],[37, 
        [
        new PistolAmmo(100, 100, 10),
        new ShotgunShells(200, 100, 11),
        new SmgAmmo(300, 100, 100),
        new MagnumAmmo(400, 100, 1),
        new RifleAmmo(500, 100, 2),
        new Crate(600, 100, new SingleLoot(PISTOL4)),
        ]
    ]
])