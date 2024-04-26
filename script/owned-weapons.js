export class OwnedWeapon {
    constructor(name, damageLvl, rangeLvl, reloadSpeed, magazineLvl, fireRateLvl) {
        this.name = name
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadSpeed = reloadSpeed
        this.magazineLvl = magazineLvl
        this.fireRateLvl = fireRateLvl
    }
}

let ownedWeapons = new Map([])

export const setOwnedWeapons = (val) => {
    ownedWeapons = val
}
export const getOwnedWeapons = () => {
    return ownedWeapons
}