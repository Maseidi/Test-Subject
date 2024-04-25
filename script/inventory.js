import { OwnedWeapon, getOwnedWeapons, setOwnedWeapons } from "./owned-weapons.js"
import { addToArray } from "./util.js"
import { getIntObj, getWeaponId, setIntObj, setWeaponId } from "./variables.js"

let inventory = {
    bandage: 0,
    coin: 0,
    famas: 0,
    harddrive: 0,
    magnumammo: 0,
    mauser: 0,
    mp5k: 0,
    p90: 0,
    pistolammo: 0,
    pistol: 0,
    pistol2: 0,
    pistol3: 0,
    pistol4: 0,
    ppsh: 0,
    remington1858: 0,
    revolver: 0,
    rifleammo: 0,
    riotgun: 0,
    shotgunshells: 0,
    shotgun: 0,
    shotgun2: 0,
    shotgun3: 0,
    smgammo: 0,
    sniper: 0,
    sniper2: 0,
    sniper3: 0,
    spas: 0,
    uzi: 0
}

export const setInventory = (val) => {
    inventory = val
}
export const getInventory = () => {
    return inventory
}

export const itemPickup = () => {
    const name = getIntObj().getAttribute("name")
    const amount = getIntObj().getAttribute("amount")

    weaponPickup(name, amount)
    
    const prevAmount = inventory[name]
    inventory = {
        ...inventory,
        [name] : prevAmount + Number(amount)
    }

    getIntObj().remove()
    setIntObj(undefined)
}

const weaponPickup = (name) => {
    if ( name !== 'bandage' && name !== 'coin' && name !== 'harddrive' && !name.endsWith('ammo') && !name.endsWith('shells') ) {
        if ( !checkIfFits() ) return
        const weapon = new OwnedWeapon(
            getWeaponId(),
            getIntObj().classList[0],
            1,
            1,
            1,
            1,
            1
        )
        addToArray(getOwnedWeapons, setOwnedWeapons, weapon)
        setWeaponId(getWeaponId() + 1)
    }

}   

const checkIfFits = () => {

}