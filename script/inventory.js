import { getIntObj, setIntObj } from "./variables.js"

let inventory = {
    bandage: 0,
    coin: 0,
    famas: 0,
    harddrive: 0,
    magnumammo: 0,
    mauser: 0,
    mp5k: 0,
    p90: 0,
    pistolAmmo: 0,
    pistol: 0,
    pistol2: 0,
    pistol3: 0,
    pistol4: 0,
    ppsh: 0,
    remington1858: 0,
    revolver: 0,
    rifleAmmo: 0,
    riotgun: 0,
    shotgunShells: 0,
    shotgun: 0,
    shotgun2: 0,
    shotgun3: 0,
    smgAmmo: 0,
    sniper: 0,
    sniper2: 0,
    sniper3: 0,
    spas: 0,
    uzi: 0
}

export const itemPickup = () => {
    const name = getIntObj().getAttribute("name")
    const amount = getIntObj().getAttribute("amount")
    
    const prevAmount = inventory[name]
    inventory = {
        ...inventory,
        [name] : prevAmount + Number(amount)
    }

    getIntObj().remove()
    setIntObj(undefined)
}