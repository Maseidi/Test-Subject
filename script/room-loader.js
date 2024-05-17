import { walls } from "./walls.js"
import { rooms } from "./rooms.js"
import { loaders } from "./loaders.js"
import { enemies } from "./enemies.js"
import { interactables } from "./interactables.js"
import { getWeaponSpecs } from "./weapon-specs.js"
import { getCurrentRoomId, getProgressCounter, getRoomLeft, getRoomTop } from "./variables.js"
import { addAttribute, addClass, appendAll, createAndAddClass, objectToElement } from "./util.js"
import { 
    getCurrentRoomEnemies,
    getCurrentRoomInteractables, 
    getCurrentRoomLoaders,
    getCurrentRoomSolid,
    getCurrentRoomTrackers,
    getRoomContainer,
    setCurrentRoom,
    setCurrentRoomEnemies,
    setCurrentRoomInteractables,
    setCurrentRoomLoaders,
    setCurrentRoomSolid,
    setCurrentRoomTrackers
    } from "./elements.js"

export const loadCurrentRoom = () => {
    const room = rooms.get(getCurrentRoomId())
    setCurrentRoomSolid([])
    setCurrentRoomLoaders([])
    setCurrentRoomInteractables([])
    setCurrentRoomTrackers([])
    setCurrentRoomEnemies([])
    const roomToRender = createAndAddClass('div', `${getCurrentRoomId()}`)
    roomToRender.style.width = `${room.width}px`
    roomToRender.style.height = `${room.height}px`
    roomToRender.style.left = `${getRoomLeft()}px`
    roomToRender.style.top = `${getRoomTop()}px`
    roomToRender.style.backgroundColor = `lightgray`
    renderWalls(roomToRender)
    renderLoaders(roomToRender)
    renderInteractables(roomToRender)
    renderEnemies(roomToRender)
    setCurrentRoom(roomToRender)
    getRoomContainer().append(roomToRender)
}

const renderWalls = (roomToRender) => {
    walls.get(getCurrentRoomId()).forEach((elem, index) => {
        const wall = createAndAddClass('div', `wall-${index+1}`, 'solid')
        wall.style.backgroundColor = `darkgray`
        wall.style.width = `${elem.width}px`
        wall.style.height = `${elem.height}px`
        if ( elem.left !== undefined ) wall.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) wall.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) wall.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) wall.style.bottom = `${elem.bottom}px`
        if ( !elem.side ) createTrackers(wall, elem)
        roomToRender.append(wall)
        getCurrentRoomSolid().push(wall)
    })
}

const renderLoaders = (roomToRender) => {
    loaders.get(getCurrentRoomId()).forEach((elem) => {
        const loader = createAndAddClass('div', elem.className, 'loader')
        loader.style.width = `${elem.width}px`
        loader.style.height = `${elem.height}px`
        loader.style.backgroundColor = `blue`
        if ( elem.left !== undefined ) loader.style.left = `${elem.left}px`
        else if ( elem.right !== undefined ) loader.style.right = `${elem.right}px`
        if ( elem.top !== undefined ) loader.style.top = `${elem.top}px`
        else if ( elem.bottom !== undefined ) loader.style.bottom = `${elem.bottom}px`
        roomToRender.append(loader)
        getCurrentRoomLoaders().push(loader)
    })
}

const createTrackers = (solid, elem) => {
    let left = true
    let top = true
    let right = true
    let bottom = true
    if ( elem.left === 0 ) left = false
    if ( elem.top === 0 ) top = false
    if ( elem.right === 0 ) right = false
    if ( elem.bottom === 0 ) bottom = false
    const topLeft = createAndAddClass('div', 'top-left')
    const topRight = createAndAddClass('div', 'top-right')
    const bottomLeft = createAndAddClass('div', 'bottom-left')
    const bottomRight = createAndAddClass('div', 'bottom-right')
    if ( left && top ) appendAndPushTracker(solid, topLeft)
    if ( left && bottom ) appendAndPushTracker(solid, bottomLeft)
    if ( right && top ) appendAndPushTracker(solid, topRight)
    if ( right && bottom ) appendAndPushTracker(solid, bottomRight)              
}

const appendAndPushTracker = (root, tracker) => {
    tracker.id = `tracker-${getCurrentRoomTrackers().length}`
    root.append(tracker)
    getCurrentRoomTrackers().push(tracker)
}

const renderInteractables = (roomToRender) => 
    interactables.get(getCurrentRoomId()).forEach((interactable, index) => renderInteractable(roomToRender, interactable, index))

export const renderInteractable = (root, interactable, index) => {
    const int = objectToElement(interactable)
    addClass(int, 'interactable')
    int.id = `${getCurrentRoomId()}-${index}`
    int.style.left = `${interactable.left}px`
    int.style.top = `${interactable.top}px`
    int.style.width = `${interactable.width}px`
    renderImage(int, interactable)
    renderPopUp(int, interactable)
    root.append(int)
    if ( interactable.solid ) {
        getCurrentRoomSolid().push(int)
        createTrackers(int, interactable)
    }    
    getCurrentRoomInteractables().push(int)
}

const renderImage = (int, interactable) => {
    const image = document.createElement("img")
    image.src = `../assets/images/${interactable.name}.png`
    int.append(image)
}

const renderPopUp = (int, interactable) => {
    const popup = createAndAddClass('div', 'ui-theme', 'popup')
    popup.style.bottom = `calc(100% - 20px)`
    popup.style.opacity = `0`
    renderHeading(popup, interactable)
    renderLine(popup)
    renderDescription(popup, interactable)
    int.append(popup)
}

const renderHeading = (popup, interactable) => {
    const heading = document.createElement("p")
    let content = interactable.amount && !getWeaponSpecs().get(interactable.name) ? 
    `${interactable.amount} ${interactable.heading}` : `${interactable.heading}`
    heading.textContent = content
    popup.append(heading)
}

const renderLine = (popup) => {
    const line = document.createElement("div")
    popup.append(line)
}

const renderDescription = (popup, interactable) => {
    const descContainer = document.createElement("div")
    const fButton = document.createElement("p")
    fButton.textContent = "F"
    const descText = document.createElement("p")
    descText.textContent = `${interactable.popup}`
    appendAll(descContainer, fButton, descText)
    popup.append(descContainer)
}

const renderEnemies = (roomToRender) => {
    if ( !enemies.get(getCurrentRoomId()) ) return
    enemies.get(getCurrentRoomId())
        .filter((elem => elem.progress >= getProgressCounter()))
        .forEach((elem) => {
            const enemy = createAndAddClass('div', `${elem.type}`)
            addAttribute(enemy, 'health', elem.health)
            addAttribute(enemy, 'damage', elem.damage)
            addAttribute(enemy, 'speed', elem.speed)
            addAttribute(enemy, 'virus', elem.virus)
            enemy.style.left = `${elem.left}px`
            enemy.style.top = `${elem.top}px`
            const enemyCollider = createAndAddClass('div', `${elem.type}-collider`)
            const enemyBody = createAndAddClass('div', `${elem.type}-body`, 'body-transition')
            enemyBody.style.backgroundColor = `${elem.virus}`
            for ( let i = 1; i < elem.components; i++ ) {
                const component = createAndAddClass('div', `${elem.type}-component`)
                component.style.backgroundColor = `${elem.virus}`
                enemyBody.append(component)
            }
            enemyCollider.append(enemyBody)
            enemy.append(enemyCollider)
            roomToRender.append(enemy)
            getCurrentRoomEnemies().push(enemy)
            getCurrentRoomSolid().push(enemyCollider)
        })
}