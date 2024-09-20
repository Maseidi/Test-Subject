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
export const FAMAS = 'famas'
export const SNIPER = 'sniper'
export const MUASER = 'mauser'
export const PISTOL = 'pistol'
export const PISTOL2 = 'pistol2'
export const PISTOL3 = 'pistol3'
export const PISTOL4 = 'pistol4'
export const RIOTGUN = 'riotgun'
export const SHOTGUN = 'shotgun'
export const SNIPER2 = 'sniper2'
export const SNIPER3 = 'sniper3'
export const SHOTGUN2 = 'shotgun2'
export const SHOTGUN3 = 'shotgun3'
export const REVOLVER = 'revolver'
export const REMINGTON_1858 = 'remington1858'

export class Loot {
    constructor(name, amount, progress) {
        this.name =              name ?? null
        this.amount =            amount ?? 0
        this.progress2Active =   progress?.progress2Active ?? null
        this.progress2Deactive = progress?.progress2Deactive ?? null
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