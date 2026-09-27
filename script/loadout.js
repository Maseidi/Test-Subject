import {
    BENELLI_M4,
    MAUSER,
    MP5K,
    REVOLVER,
    STEYR_SSG_69,
    getGunDetail,
} from './gun-details.js'

export const AMMO_CAPACITY = Object.freeze({
    pistolAmmo: 90,
    smgAmmo: 180,
    shotgunShells: 30,
    rifleAmmo: 20,
    magnumAmmo: 10,
})

export const THROWABLE_CAPACITY = Object.freeze({ grenade: 2, flashbang: 3 })

const SLOT_WEAPONS = [MAUSER, BENELLI_M4, STEYR_SSG_69, MP5K, REVOLVER]

let weapons = []
let ammo = {}
let throwables = {}

const makeWeapon = (name, slot) => ({
    id: `weapon-${slot}`,
    slot,
    name,
    ammotype: getGunDetail(name, 'ammotype'),
    currmag: getGunDetail(name, 'magazine'),
})

export const resetLoadout = () => {
    weapons = SLOT_WEAPONS.map((name, index) => makeWeapon(name, index + 1))
    refillAllAmmo()
}

export const restoreLoadoutState = state => {
    if (!state) {
        resetLoadout()
        return
    }
    weapons = SLOT_WEAPONS.map((name, index) => {
        const saved = state.weapons?.find(weapon => weapon.name === name)
        return { ...makeWeapon(name, index + 1), currmag: saved?.currmag ?? getGunDetail(name, 'magazine') }
    })
    ammo = { ...AMMO_CAPACITY, ...state.ammo }
    throwables = { ...THROWABLE_CAPACITY, ...state.throwables }
}

export const getLoadoutState = () => ({
    weapons: weapons.map(weapon => ({ ...weapon })),
    ammo: { ...ammo },
    throwables: { ...throwables },
})

export const getWeapons = () => weapons

export const getWeaponById = id => weapons.find(weapon => weapon.id === id)

export const getWeaponInSlot = slot => weapons[Number(slot) - 1]

export const getWeaponWheel = () => weapons.map(weapon => weapon.id)

export const getReserveAmmo = weaponOrAmmoType => {
    const ammoType = typeof weaponOrAmmoType === 'string' ? weaponOrAmmoType : weaponOrAmmoType?.ammotype
    return ammo[ammoType] ?? 0
}

export const consumeReserveAmmo = (ammoType, amount) => {
    const used = Math.min(ammo[ammoType] ?? 0, amount)
    ammo[ammoType] = Math.max(0, (ammo[ammoType] ?? 0) - used)
    return used
}

export const setWeaponMagazine = (weapon, amount) => {
    weapon.currmag = Math.max(0, Math.min(getGunDetail(weapon.name, 'magazine'), amount))
}

export const refillAllAmmo = () => {
    ammo = { ...AMMO_CAPACITY }
    throwables = { ...THROWABLE_CAPACITY }
    weapons.forEach(weapon => setWeaponMagazine(weapon, getGunDetail(weapon.name, 'magazine')))
}

export const getThrowableCount = name => throwables[name] ?? 0

export const consumeThrowable = name => {
    if (!throwables[name]) return false
    throwables[name]--
    return true
}

resetLoadout()
