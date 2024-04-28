import { getWeaponSpecs } from "./weapon-specs.js"

export class OwnedWeapon {
    constructor(name, currMag, damageLvl, rangeLvl, reloadSpeedLvl, magazineLvl, fireRateLvl) {
        this.name = name
        this.currMag = currMag
        this.damageLvl = damageLvl
        this.rangeLvl = rangeLvl
        this.reloadSpeedLvl = reloadSpeedLvl
        this.magazineLvl = magazineLvl
        this.fireRateLvl = fireRateLvl
    }

    getAmmoType() {
        return getWeaponSpecs().get(this.name).ammoType
    }

    getHeight() {
        return getWeaponSpecs().get(this.name).height
    }

    getColor() {
        return getWeaponSpecs().get(this.name).color
    }

    getAntivirus() {
        return getWeaponSpecs().get(this.name).antivirus
    }

    getAutomatic() {
        return getWeaponSpecs().get(this.name).automatic
    }

    getSpace() {
        return getWeaponSpecs().get(this.name).space
    }

    getCurrMag() {
        return this.currMag
    }

    getDamage() {
        return getWeaponSpecs().get(this.name).damage[this.damageLvl - 1]
    }

    getRange() {
        return getWeaponSpecs().get(this.name).range[this.rangeLvl - 1]
    }

    getReloadSpeed() {
        return getWeaponSpecs().get(this.name).reloadSpeed[this.reloadSpeedLvl - 1]
    }

    getMagazine() {
        return getWeaponSpecs().get(this.name).magazine[this.magazineLvl - 1]
    }

    getFireRate() {
        return getWeaponSpecs().get(this.name).fireRate[this.fireRateLvl - 1]
    }

}

let ownedWeapons = new Map([])

export const setOwnedWeapons = (val) => {
    ownedWeapons = val
}
export const getOwnedWeapons = () => {
    return ownedWeapons
}