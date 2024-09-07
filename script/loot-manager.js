import { removeDrop } from './inventory.js'
import { renderInteractable } from './room-loader.js'
import { element2Object, isStatUpgrader, nextId } from './util.js'
import { getCurrentRoom, getCurrentRoomSolid, setCurrentRoomSolid } from './elements.js'
import { 
    getAdrenalinesDropped,
    getCurrentRoomId,
    getEnergyDrinksDropped,
    getHealthPotionsDropped,
    getLuckPillsDropped, 
    setAdrenalinesDropped,
    setEnergyDrinksDropped,
    setHealthPotionsDropped,
    setLuckPillsDropped } from './variables.js'
import { 
    Adrenaline,
    Antidote,
    Bandage,
    Coin,
    EnergyDrink,
    Flashbang,
    Grenade,
    HardDrive,
    HealthPotion,
    interactables,
    LuckPills,
    MagnumAmmo,
    Note,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo, 
    WeaponDrop} from './interactables.js'
import { 
    ADRENALINE,
    ANTIDOTE_LOOT,
    BANDAGE_LOOT,
    COIN_LOOT,
    ENERGY_DRINK,
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    HARDDRIVE_LOOT,
    HEALTH_POTION,
    LUCK_PILLS,
    MAGNUM_AMMO_LOOT,
    NOTE,
    PISTOL_AMMO_LOOT,
    RANDOM,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT,
    SMG_AMMO_LOOT } from './loot.js'

export const dropLoot = (rootElem, isEnemy) => {
    const root = element2Object(rootElem)
    const {
        left, top, loot: decision, 'loot-amount': amount, 'loot-active': progress2Active, 'loot-deactive': progress2Deactive,
        'loot-data': data, 'loot-heading': heading, 'loot-description': description, 'loot-code': code } = root
    let loot
    if ( decision === RANDOM ) loot = dropRandomLoot(left, top)
    else if ( !decision ) loot = undefined
    else if ( decision === NOTE ) loot = new Note(left, top, heading, description, data, undefined, code)
    else loot = dropDeterminedLoot(decision, left, top, amount, data)
    if ( !isEnemy ) removeDrop(rootElem)
    else setCurrentRoomSolid(getCurrentRoomSolid().filter(solid => solid !== rootElem.firstElementChild))
    if ( !loot ) return
    let interactable = {...loot, left: left, top: top, id: nextId()}
    if ( progress2Active !== 'undefined' ) interactable = {...interactable, progress2Active}
    if ( progress2Deactive !== 'undefined' ) interactable = {...interactable, progress2Deactive}
    interactables.get(getCurrentRoomId()).push(interactable)
    renderInteractable(getCurrentRoom(), interactable)
}

const dropRandomLoot = (left, top) => {
    return [
        {obj: Grenade, chance: 0.01},        {obj: Flashbang, chance: 0.01},
        {obj: MagnumAmmo, chance: 0.02},     {obj: HardDrive, chance: 0.04},
        {obj: Bandage, chance: 0.1},         {obj: Antidote, chance: 0.1},
        {obj: RifleAmmo, chance: 0.1},       {obj: ShotgunShells, chance: 0.2},
        {obj: SmgAmmo, chance: 0.3},         {obj: Coin, chance: 0.4},
        {obj: PistolAmmo, chance: 0.6},
        {obj: Adrenaline, chance: 0.0001,    predicate: getAdrenalinesDropped},
        {obj: HealthPotion, chance: 0.0001,  predicate: getHealthPotionsDropped}, 
        {obj: EnergyDrink, chance: 0.0001,   predicate: getEnergyDrinksDropped},
        {obj: LuckPills, chance: 0.0001,     predicate: getLuckPillsDropped},
    ]
    .sort(() => Math.random() - 0.5)
    .filter((item) => item.predicate === undefined || predicate() < 10)
    .map((item) => new decideItemDrop(item.obj, item.chance, left, top, amount))
    .find(drop => drop)
}

const lootMap = new Map([
    [GRENADE_LOOT, Grenade],        [FLASHBANG_LOOT, Flashbang],
    [MAGNUM_AMMO_LOOT, MagnumAmmo], [HARDDRIVE_LOOT, HardDrive],
    [BANDAGE_LOOT, Bandage],        [ANTIDOTE_LOOT, Antidote],
    [RIFLE_AMMO_LOOT, RifleAmmo],   [SHOTGUN_SHELLS_LOOT, ShotgunShells],
    [SMG_AMMO_LOOT, SmgAmmo],       [COIN_LOOT, Coin],
    [PISTOL_AMMO_LOOT, PistolAmmo], [ADRENALINE, Grenade],
    [HEALTH_POTION, Grenade],       [ENERGY_DRINK, Grenade],
    [LUCK_PILLS, Grenade],
])

const dropDeterminedLoot = (decision, left, top, amount) => {
    if ( isStatUpgrader({name: decision}) ) {
        const result = [
            {name: ADRENALINE,    obj: Adrenaline,   predicate: getAdrenalinesDropped}, 
            {name: HEALTH_POTION, obj: HealthPotion, predicate: getHealthPotionsDropped},
            {name: ENERGY_DRINK,  obj: EnergyDrink,  predicate: getEnergyDrinksDropped},
            {name: LUCK_PILLS,    obj: LuckPills,    predicate: getLuckPillsDropped}
        ].find((elem) => elem.name === decision && elem.predicate() < 10)
        return decideItemDrop(result.obj, 1, left, top, 1)
    } else if ( lootMap.get(decision) ) {
        const drop = lootMap.get(decision)
        return decideItemDrop(drop, 1, left, top, amount)
    } else return dropWeaponLoot(left, top, decision)
}

const decideItemDrop = (drop, chance, left, top, amount) => {
    if ( Math.random() < chance ) var result = new drop(left, top, amount)
    Array.from([
        {expected: ADRENALINE,    setter: setAdrenalinesDropped,   getter: getAdrenalinesDropped},
        {expected: HEALTH_POTION, setter: setHealthPotionsDropped, getter: getHealthPotionsDropped},
        {expected: ENERGY_DRINK,  setter: setEnergyDrinksDropped,  getter: getEnergyDrinksDropped},
        {expected: LUCK_PILLS,    setter: setLuckPillsDropped,     getter: getLuckPillsDropped}
    ]).forEach(elem => handleStatUpgraderDrop(result?.name, elem.expected, elem.setter, elem.getter))
    return result
}

const handleStatUpgraderDrop = (name, expected, setter, getter) => {
    if ( name === expected ) setter(getter() + 1)
}

const dropWeaponLoot = (left, top, name) => new WeaponDrop(left, top, name, 0, 1, 1, 1, 1, 1)