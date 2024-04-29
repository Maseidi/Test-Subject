import { getPauseContainer } from "./elements.js"
import { getInventory } from "./inventory.js"
import { getOwnedWeapons } from "./owned-weapons.js"
import { addAttribute, addClass, containsClass } from "./util.js"
import { getWeaponWheel } from "./variables.js"
import { getWeaponSpecs } from "./weapon-specs.js"

export const renderInventory = () => {
    renderBackground()
    renderBlocks()
    renderHeadingAndDescription()
    inventoryEvents()
    renderWeaponWheel()
}

const renderBackground = () => {
    const background = document.createElement("div")
    addClass(background, 'inventory-ui')
    getPauseContainer().append(background)
}

const renderBlocks = () => {
    const background = getPauseContainer().firstElementChild
    const inventory = document.createElement("div")
    addClass(inventory, 'inventory')
    console.log(getInventory());
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
                addAttribute(theBlock, 'id', block.id)
                addAttribute(theBlock, 'name', block.name)
                addAttribute(theBlock, 'heading', block.heading)
                addAttribute(theBlock, 'description', block.description)
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
    background.append(inventory)
}

const renderHeadingAndDescription = () => {
    const background = getPauseContainer().firstElementChild
    const desc = document.createElement("div")
    addClass(desc, 'description')
    const heading = document.createElement("h2")
    desc.append(heading)
    const paragraph = document.createElement("p")
    desc.append(paragraph)
    background.firstElementChild.append(desc)
}

const inventoryEvents = () => {
    const background = getPauseContainer().firstElementChild
    Array.from(background.firstElementChild.children)
        .filter((block) => block.getAttribute('heading') && block.getAttribute('description'))
        .forEach((item) => {
            descriptionEvent(item)
            removeDescriptionEvent(item)
            optionsEvent(item)
            closeOptionsEvent(item)
        })
}

const descriptionEvent = (item) => {
    item.addEventListener('mousemove', () => {
        const desc = document.querySelector(".description")
        const heading = item.getAttribute('heading')
        const description = item.getAttribute('description')
        if (heading) desc.children[0].textContent = `${heading}`
        if (description) desc.children[1].textContent = `${description}`
    })
}

const removeDescriptionEvent = (item) => {
    item.addEventListener('mouseleave', () => {
        const desc = document.querySelector(".description")
        desc.children[0].textContent = ``
        desc.children[1].textContent = ``
    })
}

const optionsEvent = (item) => {
    item.addEventListener('click', () => {
        if ( item.lastElementChild && containsClass(item.lastElementChild, 'options') ) return
        const options = document.createElement('div')
        addClass(options, 'options')
        renderOptions(item, options)
        item.append(options)
    })
}

const renderOptions = (item, options) => {
    if ( item.getAttribute('name') === 'bandage' ) createOption(options, 'use')
    createOption(options, 'replace')
    if ( getWeaponSpecs().get(item.getAttribute('name')) ) {
        createOption(options, 'equip')
        createOption(options, 'shortcut')
    }
    createOption(options, 'drop')
}

const replace = (item) => {
    console.log('replace', item);
}

const use = (item) => {
    console.log('use', item);
}

const equip = (item) => {
    console.log('equip', item);
}

const shortcut = (item) => {
    console.log('shortcut', item);
}

const drop = (item) => {
    console.log('drop', item);
}

const OPTIONS_MAP = new Map([
    ['replace', replace],
    ['use', use],
    ['equip', equip],
    ['shortcut', shortcut],
    ['drop', drop]
])

const createOption = (options, text) => {
    const elem = document.createElement("div")
    elem.textContent = `${text}`
    elem.addEventListener('click', () => {
        OPTIONS_MAP.get(text)(options.parentElement)
    })
    options.append(elem)
}

const closeOptionsEvent = (item) => {
    item.addEventListener('mouseleave', () => {
        const options = item.children[2]
        options?.remove()
    })
}

const renderWeaponWheel = () => {
    const background = getPauseContainer().firstElementChild
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
    background.append(weaponWheel)
}

export const removeInventory = () => {
    getPauseContainer().firstElementChild.remove()
}