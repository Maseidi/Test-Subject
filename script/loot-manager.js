import { MAX_PACKSIZE, removeDrop } from './inventory.js'
import { renderInteractable } from './room-loader.js'
import { element2Object, isStatUpgrader, nextId } from './util.js'
import { getCurrentRoomSolid, setCurrentRoomSolid } from './elements.js'
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
    BlueVaccine,
    Coin,
    EnergyDrink,
    Flashbang,
    GreenVaccine,
    Grenade,
    HardDrive,
    HealthPotion,
    KeyDrop,
    LuckPills,
    MagnumAmmo,
    Note,
    PistolAmmo,
    PurpleVaccine,
    RedVaccine,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo, 
    Stick, 
    GunDrop,
    YellowVaccine } from './interactables.js'
import { 
    ADRENALINE,
    ANTIDOTE_LOOT,
    BANDAGE_LOOT,
    BLUE_VACCINE,
    COIN_LOOT,
    ENERGY_DRINK,
    FLASHBANG_LOOT,
    GREEN_VACCINE,
    GRENADE_LOOT,
    HARDDRIVE_LOOT,
    HEALTH_POTION,
    LUCK_PILLS,
    MAGNUM_AMMO_LOOT,
    NOTE,
    PISTOL_AMMO_LOOT,
    PURPLE_VACCINE,
    RANDOM,
    RED_VACCINE,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT,
    SMG_AMMO_LOOT, 
    STICK_LOOT, 
    YELLOW_VACCINE } from './loot.js'
import { getInteractables } from './entities.js'

export const dropLoot = (rootElem, isEnemy) => {
    const root = element2Object(rootElem)
    const {
        left, top, 
        'loot-name': decision, 'loot-amount': amount, 
        'loot-active': progress2Active, 'loot-deactive': progress2Deactive } = root

    let loot
    if ( decision === RANDOM ) loot = dropRandomLoot(left, top)
    else if ( !decision ) loot = null
    else if ( decision === NOTE ) {
        const { 'note-heading': heading, 'note-description' : description, 'note-data' : data, 'note-code' : code } = root
        loot = new Note(left, top, heading, description, data, null, code)
    }
    else if ( decision.includes('key') ) {
        const { 'key-heading': heading, 'key-unlocks' : unlocks, 'key-code' : code, 'key-description' : description } = root
        loot = new KeyDrop(left, top, code, heading, description, unlocks)
    }
    else loot = dropDeterminedLoot(decision, left, top, amount)
    if ( !isEnemy ) removeDrop(rootElem)
    else setCurrentRoomSolid(getCurrentRoomSolid().filter(solid => solid !== rootElem.firstElementChild))
    if ( !loot ) return
    let interactable = {...loot, left: left, top: top, id: nextId()}
    if ( progress2Active ) interactable = {...interactable, progress2Active}
    if ( progress2Deactive ) interactable = {...interactable, progress2Deactive}
    getInteractables().get(getCurrentRoomId()).push(interactable)
    renderInteractable(interactable)
}

const dropRandomLoot = (left, top) => {
    return [
        {obj: SmgAmmo, chance: 0.3},         {obj: Coin, chance: 0.4},
        {obj: PistolAmmo, chance: 0.5},      {obj: null, chance: 0.1},
        {obj: PurpleVaccine, chance: 0.1},   {obj: Stick, chance: 0.1},
        {obj: Bandage, chance: 0.1},         {obj: Antidote, chance: 0.1},
        {obj: Grenade, chance: 0.01},        {obj: Flashbang, chance: 0.01},
        {obj: MagnumAmmo, chance: 0.02},     {obj: HardDrive, chance: 0.04},
        {obj: YellowVaccine, chance: 0.1},   {obj: BlueVaccine, chance: 0.1},
        {obj: RedVaccine, chance: 0.1},      {obj: GreenVaccine, chance: 0.1},
        {obj: RifleAmmo, chance: 0.1},       {obj: ShotgunShells, chance: 0.2},
        {obj: LuckPills, chance: 0.0001,     predicate: getLuckPillsDropped},
        {obj: Adrenaline, chance: 0.0001,    predicate: getAdrenalinesDropped},
        {obj: EnergyDrink, chance: 0.0001,   predicate: getEnergyDrinksDropped},
        {obj: HealthPotion, chance: 0.0001,  predicate: getHealthPotionsDropped}, 
    ]
    .sort(() => Math.random() - 0.5)
    .filter((item) => !item.predicate || item.predicate() < 10)
    .map((item) => decideItemDrop(item.obj, item.chance, left, top, Math.floor(Math.random() * (item.obj ? MAX_PACKSIZE[new item.obj().name] : 1)) + 1))
    .find(drop => drop)
}

export const lootMap = new Map([
    [STICK_LOOT, Stick],
    [SMG_AMMO_LOOT, SmgAmmo],        [COIN_LOOT, Coin],
    [PISTOL_AMMO_LOOT, PistolAmmo],  [ADRENALINE, Adrenaline],
    [BANDAGE_LOOT, Bandage],         [ANTIDOTE_LOOT, Antidote],
    [LUCK_PILLS, LuckPills],         [RED_VACCINE, RedVaccine],
    [HEALTH_POTION, HealthPotion],   [ENERGY_DRINK, EnergyDrink],
    [GRENADE_LOOT, Grenade],         [FLASHBANG_LOOT, Flashbang],
    [MAGNUM_AMMO_LOOT, MagnumAmmo],  [HARDDRIVE_LOOT, HardDrive],
    [BLUE_VACCINE, BlueVaccine],     [GREEN_VACCINE, GreenVaccine],
    [PURPLE_VACCINE, PurpleVaccine], [YELLOW_VACCINE, YellowVaccine],
    [RIFLE_AMMO_LOOT, RifleAmmo],    [SHOTGUN_SHELLS_LOOT, ShotgunShells],
])

const dropDeterminedLoot = (decision, left, top, amount) => {
    if ( isStatUpgrader({name: decision}) ) {
        const result = [
            {name: LUCK_PILLS,    obj: LuckPills,    predicate: getLuckPillsDropped},
            {name: ADRENALINE,    obj: Adrenaline,   predicate: getAdrenalinesDropped}, 
            {name: ENERGY_DRINK,  obj: EnergyDrink,  predicate: getEnergyDrinksDropped},
            {name: HEALTH_POTION, obj: HealthPotion, predicate: getHealthPotionsDropped},
        ].find((elem) => elem.name === decision && elem.predicate() < 10)
        return decideItemDrop(result.obj, 1, left, top, 1)
    } else if ( lootMap.get(decision) ) {
        const drop = lootMap.get(decision)
        return decideItemDrop(drop, 1, left, top, amount)
    } else return dropWeaponLoot(left, top, decision)
}

const decideItemDrop = (drop, chance, left, top, amount) => {
    if ( !drop ) return null
    if ( drop.name === 'coin' && amount > 5 ) amount = 5
    if ( Math.random() < chance ) var result = new drop(left, top, amount)
    Array.from([
        {expected: LUCK_PILLS,    setter: setLuckPillsDropped,     getter: getLuckPillsDropped},
        {expected: ADRENALINE,    setter: setAdrenalinesDropped,   getter: getAdrenalinesDropped},
        {expected: ENERGY_DRINK,  setter: setEnergyDrinksDropped,  getter: getEnergyDrinksDropped},
        {expected: HEALTH_POTION, setter: setHealthPotionsDropped, getter: getHealthPotionsDropped}
    ]).forEach(elem => handleStatUpgraderDrop(result?.name, elem.expected, elem.setter, elem.getter))
    return result
}

const handleStatUpgraderDrop = (name, expected, setter, getter) => {
    if ( name === expected ) setter(getter() + 1)
}

const dropWeaponLoot = (left, top, name) => new GunDrop(left, top, name, 0, 1, 1, 1, 1, 1)