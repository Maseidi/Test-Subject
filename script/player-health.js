import { healthManager } from "./user-interface.js"
import { getInventory, useInventoryResource } from "./inventory.js"
import { getHealth, getMaxHealth, setHealth } from "./variables.js"

export const heal = () => {
    if ( getHealth() === getMaxHealth() ) return
    const bandage = getInventory().flat().find(x => x && x.name === 'bandage')
    if ( !bandage ) return
    let newHealth = Math.min(getHealth() + 20, getMaxHealth())
    useInventoryResource('bandage', 1)
    modifyHealth(newHealth)
}

export const useBandage = (bandage) => {
    if ( getHealth() === getMaxHealth() ) return
    let newHealth = Math.min(getHealth() + 20, getMaxHealth())
    bandage.amount -= 1
    modifyHealth(newHealth)
}

export const takeDamage = (damage) => {
    let newHealth = getHealth() - damage
    newHealth = newHealth < 0 ? 0 : newHealth
    modifyHealth(newHealth)
}

const modifyHealth = (val) => {
    setHealth(val)
    healthManager(getHealth())
}