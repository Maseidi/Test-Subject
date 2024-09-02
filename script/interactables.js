import { Progress } from './progress.js'
import { getWeaponDetails } from './weapon-details.js'
import { 
    BANDAGE_LOOT,
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    Loot,
    MAGNUM_AMMO_LOOT,
    NoteLoot,
    P90,
    PISTOL4,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT, 
    SingleLoot } from './loot.js'

class Interactable {
    constructor(width, left, top, name, heading, popup, solid, amount, space, description, price, progress) {
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
        this.renderProgress = progress?.renderProgress ?? '0'
        this.killAll= progress?.killAll
        this.progress2Active = progress?.progress2Active
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
        super(35, left, top, 'crate', 'crate', 'Break', true, undefined, undefined, undefined, undefined, progress)
        this.loot = loot.name
        this.data = loot.data
        this['loot-amount'] = loot.amount
        this['loot-progress'] = loot.progress2Active
    }
}

export class Lever extends Interactable {
    constructor(left, top, progress, toggle1, toggle2) {
        super(30, left, top, 'lever', 'lever', 'Toggle', true, undefined, undefined, undefined, undefined, progress)
        this.toggle1 = toggle1
        this.toggle2 = toggle2
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
            'A neccesity when trading with the vending machine', undefined, progress)
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
    constructor(left, top, code, heading, unlocks, progress) {
        super(10, left, top, `key-${code}`, heading, 1, 1, heading, undefined, progress)
        this.unlocks = unlocks
    }
}

export class AdrenalineDrop extends Drop {
    constructor(left, top, amount, progress) {
        super(10, left, top, 'adrenaline', 'adrenaline', amount, 1, 
            'Increases max speed by 0.1 units. (Default speed is 5 units)', 20, progress)
    }
}

export class HealthPotionDrop extends Drop {
    constructor(left, top, amount, progress) {
        super(5, left, top, 'healthpotion', 'health potion', amount, 1, 
            'Refills health completely and increases max health by 10 units. (Default health is 100 units)', 20, progress)
    }
}

export class LuckPillsDrop extends Drop {
    constructor(left, top, amount, progress) {
        super(15, left, top, 'luckpills', 'luck pills', amount, 1, 
            'Increases critical chance by 1.9%. (Default critical chance is 1%)', 20, progress)
    }
}

export class EnergyDrinkDrop extends Drop {
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
        super(15, left, top, 'note', heading, 1, 1, description, undefined, progress)
        this.data = data
        this.examined = false
        this.code = code
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
        new WeaponDrop(500, 600, 'famas', 50, 1, 1, 1, 1, 1),
        new SmgAmmo(500, 700, 90),
        new Bandage(600, 700, 5),
        new Antidote(600, 600, 5),
        new Grenade(500, 800, 3),
        new Flashbang(600, 800, 5),
        new Flashbang(700, 800, 2),
        new Lever(1000, 700, 
            Progress.builder().setRenderProgress('2'), '100', '200'
        ),
        new Coin(200, 200, 10, Progress.builder().setRenderProgress('100')),
        new Note(500, 500, 'Main hall code', 
            'A small letter containing the code for the main hall',
            'Main hall door code: PLACE_PASS_HERE', undefined, 'main-hall'
        ),
        ]
    ],[37, 
        [
        new PistolAmmo(100, 100, 10),
        new ShotgunShells(200, 100, 11),
        new SmgAmmo(300, 100, 100),
        new MagnumAmmo(400, 100, 1),
        new RifleAmmo(500, 100, 2, Progress.builder().setRenderProgress('10').setProgress2Active('11')),
        new Crate(600, 100, new SingleLoot(PISTOL4)),
        new KeyDrop(700, 100, 1, 'Test key', 'test', Progress.builder().setKillAll('8').setProgress2Active('9'))
        ]
    ]
])