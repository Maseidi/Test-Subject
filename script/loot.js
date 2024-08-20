export const RANDOM = 'random'    
export const COIN_LOOT = 'coin'
export const GRENADE_LOOT = 'grenade'
export const BANDAGE_LOOT = 'bandage'    
export const SMG_AMMO_LOOT = 'smgammo'    
export const ANTIDOTE_LOOT = 'antidote'    
export const HARDDRIVE_LOOT = 'harddrive'    
export const FLASHBANG_LOOT = 'flashbang'  
export const RIFLE_AMMO_LOOT = 'rifleammo'    
export const PISTOL_AMMO_LOOT = 'pistolammo'    
export const MAGNUM_AMMO_LOOT = 'magnumammo'
export const SHOTGUN_SHELLS_LOOT = 'shotgunshells'

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
    constructor(name, amount) {
        this.name = name
        this.amount = amount
    }
}

export class SingleLoot extends Loot {
    constructor(name) {
        super(name, 1)
    }
}