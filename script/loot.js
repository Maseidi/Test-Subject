export const NOTE = 'note'
export const RANDOM = 'random'
export const COIN_LOOT = 'coin'
export const STICK_LOOT = 'stick'
export const GRENADE_LOOT = 'grenade'
export const BANDAGE_LOOT = 'bandage'
export const LUCK_PILLS = 'luckpills'
export const SMG_AMMO_LOOT = 'smgammo'
export const ADRENALINE = 'adrenaline'
export const ANTIDOTE_LOOT = 'antidote'
export const HARDDRIVE_LOOT = 'harddrive'
export const FLASHBANG_LOOT = 'flashbang'
export const ENERGY_DRINK = 'energydrink'
export const RIFLE_AMMO_LOOT = 'rifleammo'
export const HEALTH_POTION = 'healthpotion'
export const PISTOL_AMMO_LOOT = 'pistolammo'
export const MAGNUM_AMMO_LOOT = 'magnumammo'
export const SHOTGUN_SHELLS_LOOT = 'shotgunshells'

export const RED_VACCINE = 'redvaccine'
export const BLUE_VACCINE = 'bluevaccine'
export const GREEN_VACCINE = 'greenvaccine'
export const PURPLE_VACCINE = 'purplevaccine'
export const YELLOW_VACCINE = 'yellowvaccine'

export const UZI = 'uzi'
export const P90 = 'p90'
export const PPSH = 'ppsh'
export const MP5K = 'mp5k'
export const SPAS = 'spas'
export const M1911 = 'm1911'
export const GLOCK = 'glock'
export const MAUSER = 'mauser'
export const REVOLVER = 'revolver'
export const BENELLI_M4 = 'benellim4'
export const STEYR_SSG_69 = 'steyrssg69'
export const REMINGTON_870 = 'remington870'
export const ARCTIC_WARFERE = 'arcticwarfare'
export const REMINGTON_1858 = 'remington1858'
export const PARKER_HALE_M_85 = 'parkerhalem85'

export class Loot {
    constructor(name, amount, progress) {
        this.name =              name                        ?? null
        this.amount =            amount                      ?? 0
        this.progress2Active =   progress?.progress2Active   ?? []
        this.progress2Deactive = progress?.progress2Deactive ?? []
    }
}

export class SingleLoot extends Loot {
    constructor(name, progress) {
        super(name, 1, progress)
    }
}

export class NoteLoot extends SingleLoot {
    constructor(heading, description, data, code, progress) {
        super(NOTE, progress)
        this.heading = heading
        this.description = description
        this.code = code
        this.data = data
    }
}

export class KeyLoot extends SingleLoot {
    constructor(heading, description, code, unlocks, progress) {
        super('key-' + code, progress)
        this.heading = heading
        this.description = description
        this.code = code
        this.unlocks = unlocks
    }
}

export const initLootValues = (src, loot) => {
    src['loot-name'] =        loot.name              ?? null
    src['loot-amount'] =      loot.amount            ?? 0
    src['loot-active'] =      loot.progress2Active   ?? null
    src['loot-deactive'] =    loot.progress2Deactive ?? null
    initNoteLootValues(src, loot)
    initKeyLootValues(src, loot)
}

const initNoteLootValues = (src, loot) => {
    if ( loot.name === NOTE ) return
    src['note-data'] =        loot.data        ?? null
    src['note-code'] =        loot.code        ?? null
    src['note-heading'] =     loot.heading     ?? null
    src['note-description'] = loot.description ?? null
}

const initKeyLootValues = (src, loot) => {
    if ( !loot.name?.includes('key') ) return
    src['key-code'] =        loot.code        ?? null
    src['key-heading'] =     loot.heading     ?? null
    src['key-unlocks'] =     loot.unlocks     ?? null
    src['key-description'] = loot.description ?? null 
}