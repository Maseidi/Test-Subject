import { OwnedWeapon, getOwnedWeapons, setOwnedWeapons } from "./owned-weapons.js"
import { rooms } from "./rooms.js"
import { putToMap } from "./util.js"
import { getCurrentRoomId, getIntObj, getLootId, getWeaponWheel, setLootId, setWeaponWheel } from "./variables.js"

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

class Item {
    constructor(id, name, amount, space) {
        this.id = id
        this.name = name
        this.amount = amount
        this.space = space
    }
}

let inventory = [
    [null, null, null, null],
    [null, null, null, null],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
    [undefined, undefined, undefined, undefined],
]

export const getInventory = () => {
    return inventory
}

export const pickupDrop = () => {
    searchPack()
    searchEmpty()
    if ( Number(getIntObj().getAttribute("amount")) === 0 ) removeDrop()
}

const searchPack = () => {
    const dropName = getIntObj().getAttribute("name")
    const dropAmount = Number(getIntObj().getAttribute("amount"))
    const pack = MAX_PACKSIZE[dropName] || 1
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item && item.name === dropName ) {
                if ( item.amount !== pack ) {
                    let diff = Math.min(pack, pack + dropAmount) - item.amount
                    item.amount += diff
                    updateAmount(dropAmount - diff)
                }
            }
        }
    }
}

const searchEmpty = () => {
    const dropAmount = Number(getIntObj().getAttribute("amount"))
    if ( dropAmount === 0 ) return
    const dropName = getIntObj().getAttribute("name")
    const dropSpace = Number(getIntObj().getAttribute("space"))
    const pack = MAX_PACKSIZE[dropName] || 1
    for (let i = 0; i < inventory.length; i++) {
        for ( let j = 0; j < inventory[i].length; j++ ) {
            const item = inventory[i][j]
            if ( item === null && j + dropSpace <= 4 ) {
                let diff = Math.min(pack, dropAmount)
                setLootId(getLootId() + 1)
                inventory[i][j] = new Item(getLootId(), dropName, diff, dropSpace)
                for ( let k = 1; k < dropSpace; k++ ) inventory[i][j+k] = "taken"
                updateAmount(dropAmount - diff)
                if ( Number(getIntObj().getAttribute("amount")) > 0 && inventoryFull() ) return
                searchEmpty()
                return
            }
        }
    }
}

const inventoryFull = () => {
    let isFull = true
    for (const row of inventory) {
        for ( const item of row ) {
            if ( item === null ) {
                isFull = false
                return
            }
        }
    }  
    return isFull 
}

const updateAmount = (newValue) => {
    getIntObj().setAttribute("amount", newValue)
    getIntObj().children[1].children[0].textContent = `x${newValue} ${getIntObj().getAttribute("title")}`
    rooms.get(getCurrentRoomId()).interactables = 
    Array.from(rooms.get(getCurrentRoomId()).interactables).map((int, index) => {
        return index === Number(getIntObj().getAttribute("id")) ? {
            ...int,
            amount: newValue
        } : int
    })
}

const removeDrop = () => {
    if ( MAX_PACKSIZE[getIntObj().getAttribute("name")] === undefined ) handleNewWeaponPickup()
    getIntObj().remove()
    rooms.get(getCurrentRoomId()).interactables = 
    Array.from(rooms.get(getCurrentRoomId()).interactables).map((elem, index) => {
        return index === Number(getIntObj().getAttribute("id")) ? null : elem
    })
}

const handleNewWeaponPickup = () => {
    putToMap(getOwnedWeapons, setOwnedWeapons, getLootId(), new OwnedWeapon(
        getIntObj().getAttribute("name"), 0, 1, 1, 1, 1, 1
    ))
    updateWeaponWheel()
}

const updateWeaponWheel = () => {
    let weaponWheelCopy = getWeaponWheel()
    for (const key in getWeaponWheel()) {
        if ( getWeaponWheel()[key] === null ) {
            weaponWheelCopy[key] = getLootId()
            break
        }
    }
    setWeaponWheel(weaponWheelCopy)
}