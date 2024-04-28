import { getPauseContainer } from "./elements.js"
import { getInventory } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { addClass } from "./util.js"
import { getWeaponSpecs } from "./weapon-specs.js"

export const renderInventory = () => {
    const invUi = document.createElement("div")
    addClass(invUi, 'inventory-ui')
    const inventory = document.createElement("div")
    addClass(inventory, 'inventory')
    getInventory().forEach((row) => {
        row.forEach((block) => {
            const theBlock = document.createElement("div")
            let skip = false
            if ( block === "taken" ) skip = true
            else if (block === null || block === undefined) theBlock.style.width = `25%`
            else {
                theBlock.style.width = `${block.space * 25}%`
                const amount = document.createElement("div")
                addClass(amount, 'amount')
                const amountText = document.createElement("p")
                if ( getWeaponSpecs().get(block.name) === undefined ) amountText.textContent = `${block.amount}`
                else amountText.textContent = `${getOwnedWeapons().get(block.id).getCurrMag()}`
                amount.append(amountText)
                theBlock.append(amount)
            }
            if ( !skip ) {                
                if ( block === undefined ) theBlock.style.backgroundColor = `rgba(255, 0, 0, 0.1)`
                if ( block === null || block === undefined ) skip = true   
                if ( !skip ) {
                    const image = document.createElement("img")
                    image.src = `../assets/images/${block.name}.png`
                    theBlock.append(image)
                }
    
                inventory.append(theBlock)
            }          
        })
    })
    
    invUi.append(inventory)
    getPauseContainer().append(invUi)
}

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
}