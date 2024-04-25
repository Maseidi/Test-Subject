class OwnedWeapon {
    constructor(id, name, damageLvl, rangeLvl, reloadSpeedLvl, magazineLvl, fireRateLvl) {
        this.id = id
        this.name = name
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadSpeedLvl = reloadSpeedLvl
        this.magazineLvl = magazineLvl
        this.fireRateLvl = fireRateLvl
    }
}

let ownedWeapons = []
export const setOwnedWeapons = (val) => {
    ownedWeapons = val
}
export const getOwnedWeapons = () => {
    return ownedWeapons
}