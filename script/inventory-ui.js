import { getPauseContainer } from "./elements.js"
import { getInventory } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { addAttribute, addClass } from "./util.js"
import { getWeaponWheel } from "./variables.js"
import { getWeaponSpecs } from "./weapon-specs.js"

export const renderInventory = () => {
    const invUi = document.createElement("div")
    addClass(invUi, 'inventory-ui')
    renderBlocks(invUi)
    renderHeadingAndDescription(invUi)
    eventListeners(invUi)
    renderWeaponWheel(invUi)
    getPauseContainer().append(invUi)
}

const renderBlocks = (invUi) => {
    const inventory = document.createElement("div")
    addClass(inventory, 'inventory')
    getInventory().forEach((row) => {
        row.forEach((block) => {
            const theBlock = document.createElement("div")
            addClass(theBlock, 'block')
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
                addAttribute(theBlock, 'description', block.description)
                addAttribute(theBlock, 'heading', block.heading)
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
}

const renderHeadingAndDescription = (invUi) => {
    const desc = document.createElement("div")
    addClass(desc, 'description')
    const heading = document.createElement("h2")
    desc.append(heading)
    const paragraph = document.createElement("p")
    desc.append(paragraph)
    invUi.firstElementChild.append(desc)
}

const eventListeners = (invUi) => {
    Array.from(invUi.firstElementChild.children).forEach((item) => {
        item.addEventListener('mousemove', () => {
            const desc = document.querySelector(".description")
            const heading = item.getAttribute('heading')
            const description = item.getAttribute('description')
            if (heading) desc.children[0].textContent = `${heading}`
            if (description) desc.children[1].textContent = `${description}`
        })
    })
}

const renderWeaponWheel = (invUi) => {
    const weaponWheel = document.createElement("div")
    addClass(weaponWheel, 'weapon-wheel')
    let slots = 4
    while (slots) {
        const slot = document.createElement("div")
        const image = document.createElement("img")
        const name = getOwnedWeapons().get(getWeaponWheel()[4-slots])?.name
        if ( name ) {
            image.src = `../assets/images/${name}.png`
            slot.append(image)
        } else {
            slot.style.width = `70px`
        }
        weaponWheel.append(slot)
        slots--
    }
    invUi.append(weaponWheel)
}

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
}