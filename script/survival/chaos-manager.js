import { add2Stash } from '../stash.js'
import { isGun } from '../gun-details.js'
import { Coin, Lever } from '../interactables.js'
import { appendAll, createAndAddClass } from '../util.js'
import { renderInteractable, renderInteractables } from '../room-loader.js'
import { getEnemies, getInteractables, setEnemies, setInteractables } from '../entities.js'
import { 
    getChaos,
    getRandomizedWeapons,
    setChaos,
    setCurrentChaosEnemies,
    setCurrentChaosSpawned,
    setEnemyId,
    setSpawnCounter } from './variables.js'
import { 
    getCurrentRoomInteractables,
    setCurrentRoomBullets,
    setCurrentRoomEnemies,
    setCurrentRoomExplosions,
    setCurrentRoomFlames,
    setCurrentRoomInteractables,
    setCurrentRoomPoisons,
    setCurrentRoomThrowables } from '../elements.js'
import { 
    AdrenalineShopItem,
    AntidoteShopItem,
    ArmorShopItem,
    BandageShopItem,
    BlueVaccineShopItem,
    EnergyDrinkShopItem,
    FlashbangShopItem,
    getShopItems,
    GreenVaccineShopItem,
    GrenadeShopItem,
    GunShopItem,
    HardDriveShopItem,
    HealthPotionShopItem,
    LuckPillsShopItem,
    MagnumAmmoShopItem,
    PistolAmmoShopItem,
    Pouch,
    PurpleVaccineShopItem,
    RedVaccineShopItem,
    RifleAmmoShopItem,
    ShotgunShellsShopItem,
    SmgAmmoShopItem,
    YellowVaccineShopItem } from '../shop-item.js'

export const startChaos = () => {
    setEnemyId(0)
    setSpawnCounter(0)
    setChaos(getChaos() + 1)
    setCurrentChaosEnemies(4 + getChaos())
    setCurrentChaosSpawned(0)
    resetRoom()
    renderInteractables()
    renderchaosPopup()
}

const resetRoom = () => {
    setCurrentRoomFlames([])
    setCurrentRoomBullets([])
    setCurrentRoomPoisons([])
    setCurrentRoomEnemies([])
    setCurrentRoomExplosions([])
    setCurrentRoomThrowables([])

    getEnemies().get(1).forEach(enemy => enemy?.sprite?.remove())
    setEnemies(new Map([[1, []]]))

    setInteractables(new Map([[1, [...getInteractables().get(1).filter((item, index) => index < 3 || isGun(item.name))]]]))
    getCurrentRoomInteractables().forEach(int => int.remove())
    setCurrentRoomInteractables([])
}

export const endChaos = () => {
    const lever = new Lever(1400, 1000)
    renderInteractable(lever)
    setInteractables(new Map([[1, [...getInteractables().get(1), lever]]]))
    renderchaosPopup('end')
    add2Stash(new Coin(), Math.min(20, getChaos()))
    updateShop()
}

const renderchaosPopup = (type = 'start') => {
    const lastPopup = document.querySelector('.chaos-container')
    if ( lastPopup ) lastPopup.remove()
    const container = createAndAddClass('div', 'chaos-container', 'ui-theme')
    const text1 = document.createElement('p')
    text1.textContent = type === 'start' ? `Chaos ${getChaos()}` : 'Chaos survived!'
    container.append(text1)
    if ( type === 'end' ) {
        const coinContainer = createAndAddClass('div', 'chaos-container-coin')
        const amount = document.createElement('p')
        amount.textContent = `${Math.min(20, getChaos())}`
        const coinImg = new Image()
        coinImg.src = './assets/images/coin.png'
        const text2 = document.createElement('p')
        text2.textContent = ' added to stash'
        appendAll(coinContainer, amount, coinImg, text2)
        container.append(coinContainer)
    }
    document.querySelector('body').append(container)
    setTimeout(() => container.remove(), 3000)
}

const updateShop = () => {
    const chaos = getChaos()
    const vendingMachine = getShopItems()
    if ( chaos % 10 === 1 ) {
        manageRepeatedItem(RedVaccineShopItem)
    }
    if ( chaos % 10 === 2 ) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(BlueVaccineShopItem)
        if ( chaos > 10 ) vendingMachine.push(new HealthPotionShopItem())
    }
    if ( chaos % 10 === 3 ) {
        manageRepeatedItem(HardDriveShopItem)
        manageRepeatedItem(FlashbangShopItem)
        manageRepeatedItem(YellowVaccineShopItem)
    }
    if ( chaos % 10 === 4 ) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(GreenVaccineShopItem)
        if ( chaos > 10 ) vendingMachine.push(new EnergyDrinkShopItem())
    }
    if ( chaos % 10 === 5 ) {
        manageRepeatedItem(PurpleVaccineShopItem)
    }
    if ( chaos % 10 === 6 ) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(HardDriveShopItem)
        manageRepeatedItem(RedVaccineShopItem)
    }
    if ( chaos % 10 === 7 ) {
        manageRepeatedItem(BlueVaccineShopItem)
        manageRepeatedItem(AntidoteShopItem)
    }
    if ( chaos % 10 === 8 ) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(GrenadeShopItem)
        manageRepeatedItem(YellowVaccineShopItem)
        if ( chaos > 10 ) vendingMachine.push(new LuckPillsShopItem())
    }
    if ( chaos % 10 === 9 ) {
        manageRepeatedItem(HardDriveShopItem)
        manageRepeatedItem(GreenVaccineShopItem)
    }
    if ( chaos % 10 === 0 ) {
        if ( chaos < 80 ) vendingMachine.push(new Pouch())
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(PurpleVaccineShopItem)
        if ( chaos > 10 ) vendingMachine.push(new AdrenalineShopItem())
    }

    if ( chaos === 20 )  vendingMachine.push(new ArmorShopItem())

    addWeapon2Shop()
    manageRepeatedItem(PistolAmmoShopItem)
    if ( chaos % 2 === 0 ) manageRepeatedItem(SmgAmmoShopItem)
    if ( chaos % 3 === 0 ) manageRepeatedItem(ShotgunShellsShopItem)
    if ( chaos % 4 === 0 ) manageRepeatedItem(RifleAmmoShopItem)
    if ( chaos % 5 === 0 ) manageRepeatedItem(MagnumAmmoShopItem)
}

const addWeapon2Shop = () => getRandomizedWeapons().forEach((item, index) => {
    if ( (index + 1) * 2 === getChaos() ) getShopItems().push(new GunShopItem(item))
})

const manageRepeatedItem = (Item) => {
    const instance = new Item()
    if ( getShopItems().find(item => !item.sold && item.name === instance.name) ) return
    getShopItems().push(instance)
}