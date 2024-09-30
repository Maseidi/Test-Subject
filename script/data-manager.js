import { setStash } from './stash.js'
import { setInventory } from './inventory.js'
import { setProgress } from './progress-manager.js'
import { initialShopItems, setShopItems } from './shop-item.js'
import { initialEnemies, initialInteractables, setEnemies, setInteractables } from './entities.js'

export const prepareNewGameData = () => {
    initNewGameProgress()
    initNewGameInventory()
    initNewGameStash()
    initNewGameShop()
    initNewGameEntities()
}

const initNewGameProgress = () =>
    setProgress({
        [Number.MAX_SAFE_INTEGER] : true,
    })

const initNewGameInventory = () =>
    setInventory([
        [null, null, null, null],
        [null, null, null, null],
        ['locked', 'locked', 'locked', 'locked'],
        ['locked', 'locked', 'locked', 'locked'],
        ['locked', 'locked', 'locked', 'locked'],
        ['locked', 'locked', 'locked', 'locked'],
    ])

const initNewGameStash = () => setStash([]) 

const initNewGameShop = () => setShopItems(initialShopItems)

const initNewGameEntities = () => {
    initNewGameEnemies()
    initNewGameInteractables()
}

const initNewGameEnemies = () => setEnemies(initialEnemies())

const initNewGameInteractables = () => setInteractables(initialInteractables)