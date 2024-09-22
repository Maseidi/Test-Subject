import { NOTE } from './loot.js'
import { getGunDetails } from './gun-details.js'

class Interactable {
    constructor(width, left, top, name, heading, popup, solid, amount, space, description, price, progress) {
        this.width =             width                              ?? 0
        this.left =              left                               ?? 0
        this.top =               top                                ?? 0
        this.name =              name                               ?? null
        this.heading =           heading                            ?? null
        this.popup =             popup                              ?? null
        this.solid =             solid                              ?? false
        this.amount =            amount                             ?? 0
        this.space =             space                              ?? 0
        this.description =       description                        ?? null
        this.price =             price                              ?? 0
        this.renderProgress =    progress?.renderProgress           ?? String(Number.MAX_SAFE_INTEGER)
        this.killAll=            progress?.killAll                  ?? null
        this.progress2Active =   progress?.progress2Active          ?? []
        this.progress2Deactive = progress?.progress2Deactive        ?? []
        this.onexamine =         progress?.onExamineProgress2Active ?? []
    }
}

export class PC extends Interactable {
    constructor(left, top) {
        super(50, left, top, 'computer', 'computer', 'Save game', true)
    }
}

export class Stash extends Interactable {
    constructor(left, top) {
        super(50, left, top, 'stash', 'stash', 'Open stash', true)
    }
}

export class VendingMachine extends Interactable {
    constructor(left, top) {
        super(35, left, top, 'vendingMachine', 'vending machine', 'Trade', true)
    }
}

export class Speaker extends Interactable {
    constructor(left, top) {
        super(35, left, top, 'speaker', null, '', true)
    }
}

export class Crate extends Interactable {
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

export class Stick extends Drop {
    constructor(left, top, progress, health) {
        super(30, left, top, 'stick', 'stick', 1, 1, 
            'Coupling it with a lighter could be a life saver darkness', 3, progress)
        
        this.health = health  ?? 100
    }
}

export class Lighter extends Drop {
    constructor(left, top, progress) {
        super(15, left, top, 'lighter', 'lighter', 1, 1, 'Does its job just like any other lighter', null, progress)
    }
}

export class GunDrop extends Drop {
    constructor(left, top, name, currmag, damageLvl, rangeLvl, 
        reloadspeedLvl, magazineLvl, fireratelvl, progress) {
        super(
            35,
            left,
            top,
            name,
            getGunDetails().get(name).heading,
            1,
            getGunDetails().get(name).space,
            getGunDetails().get(name).description,
            getGunDetails().get(name).price,
            progress
        )
        this.currmag =        currmag                            ?? 0
        this.damageLvl =      damageLvl                          ?? 1
        this.rangeLvl =       rangeLvl                           ?? 1
        this.reloadspeedLvl = reloadspeedLvl                     ?? 1
        this.magazineLvl =    magazineLvl                        ?? 1
        this.fireratelvl =    fireratelvl                        ?? 1
        this.ammotype =       getGunDetails().get(name).ammotype ?? null
    }
}

export class KeyDrop extends Drop {
    constructor(left, top, code, heading, description, unlocks, progress) {
        super(10, left, top, `key-${code}`, heading, 1, 1, description, null, progress)
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