import { getGunDetails } from './gun-details.js'

const descriptions = {
    pistolAmmo: 'Ammo for all sorts of handguns',
    shotgunShells: 'Shells for all sorts of shotguns',
    smgAmmo: 'Ammo for all sorts of sub-machine guns',
    rifleAmmo: 'Ammo for all sorts of rifles',
    magnumAmmo: 'Ammo for all sorts of magnums',
    bandage: 'Might come in handy in case of injuries',
    harddrive: 'PC needs one of these to save your progress',
    antidote: 'An emergency when poison is all over the place',
    grenade: 'Toss one to witness your foes fly high!',
    flashbang: 'Blinding enemies can be a game changer in many situations',
    coin: 'A necessity when trading with the vending machine',
    armor: 'Equipping this will reduce damage taken by 50%',
    pouch: 'Adds two inventory slots',
    adrenaline: 'Increases movement speed by 0.1 units',
    healthpotion: 'Refills health completely and increases max health by 10 units',
    luckpills: 'Increases critical chance by 1.9%',
    energydrink: 'Refills stamina completely and increases max stamina by 60 units',
}

export const getItemDescription = name => {
    if (getGunDetails().has(name)) return getGunDetails().get(name).description
    if (name?.endsWith('vaccine')) return `Vaccine used for defusing virus ${name.replace('vaccine', '')}`
    return descriptions[name] || ''
}
