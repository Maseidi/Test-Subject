import { OwnedWeapon, getOwnedWeapons, setOwnedWeapons } from "./owned-weapons.js"
import { rooms } from "./rooms.js"
import { elementToObject, putToMap } from "./util.js"
import { getCurrentRoomId, getIntObj, getWeaponWheel, setWeaponWheel } from "./variables.js"
import { getWeaponSpecs } from "./weapon-specs.js"

const MAX_PACKSIZE = {
    bandage: 2,
    coin: 5,
    hardDrive: 1,
    smgAmmo: 100,
    pistolAmmo: 40,
    shotgunShells: 30,
    rifleAmmo: 20,
    magnumAmmo: 10
}

let inventory = [
    [null, null, null, null],
    [null, null, null, null],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
]

export const setInventory = (val) => {
    inventory = val
}

export const getInventory = () => {
    return inventory
}

export const pickupDrop = () => {
    searchPack()
    searchEmpty()
    if ( Number(getIntObj().getAttribute("amount")) === 0 ) removeDrop()
}

const searchPack = () => {
    const drop = elementToObject(getIntObj())
    const pack = MAX_PACKSIZE[drop.name] || 1
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item && item.name === drop.name ) {
                let diff = Math.min(pack, pack + drop.amount) - item.amount
                item.amount += diff
                updateAmount(drop.amount - diff)
            }
        }
    }
}

const searchEmpty = () => {
    const drop = elementToObject(getIntObj())
    if ( drop.amount === 0 ) return
    const pack = MAX_PACKSIZE[drop.name] || 1
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item === null && j + drop.space <= 4 ) {
                let skip = false
                for ( let k = 1; k < drop.space; k++ )
                    if ( inventory[i][j+k] !== null ) skip = true
                if ( skip ) continue   
                let diff = Math.min(pack, drop.amount)
                inventory[i][j] = {...drop, amount: diff, layout: `${i}-${j}`}
                for ( let k = 1; k < drop.space; k++ ) inventory[i][j+k] = "taken"
                updateAmount(drop.amount - diff)
                if ( drop.amount > 0 && inventoryFull() ) return
                searchEmpty()
                return
            }
        }
    }
}

const inventoryFull = () => {
    for (const row of inventory) {
        for ( const item of row ) {
            if ( item === null ) {
                return false
            }
        }
    }  
    return true 
}

const updateAmount = (newValue) => {
    getIntObj().setAttribute("amount", newValue)
    getIntObj().children[1].children[0].textContent = `x${newValue} ${getIntObj().getAttribute("heading")}`
    rooms.get(getCurrentRoomId()).interactables = 
    Array.from(rooms.get(getCurrentRoomId()).interactables).map((int, index) => {
        return `${getCurrentRoomId()}-${index}` === getIntObj().getAttribute("id") ? 
        {
            ...int,
            amount: newValue
        } : int
    })
}

const removeDrop = () => {
    if ( getWeaponSpecs().get(getIntObj().getAttribute("name")) ) handleNewWeaponPickup()
    getIntObj().remove()
    rooms.get(getCurrentRoomId()).interactables = 
    Array.from(rooms.get(getCurrentRoomId()).interactables).map((elem, index) => {
        return `${getCurrentRoomId()}-${index}` === getIntObj().getAttribute("id") ? null : elem
    })
}

const handleNewWeaponPickup = () => {
    const weapon = elementToObject(getIntObj())
    putToMap(getOwnedWeapons, setOwnedWeapons, weapon.id, new OwnedWeapon(
        weapon.name, weapon.currmag, weapon.damagelvl, weapon.rangelvl, weapon.reloadspeedlvl, weapon.magazinelvl, weapon.fireratelvl 
    ))
    updateWeaponWheel()
}

const updateWeaponWheel = () => {
    let weaponWheelCopy = getWeaponWheel()
    for (const key in getWeaponWheel()) {
        if ( getWeaponWheel()[key] === null ) {
            weaponWheelCopy[key] = getIntObj().getAttribute('id')
            break
        }
    }
    setWeaponWheel(weaponWheelCopy)
}

export const inventoryHasId = (id) => {
    for (const row of inventory) {
        for ( const item of row ) {
            if ( item?.id === id ) {
                return true
            }
        }
    }  
    return false
}