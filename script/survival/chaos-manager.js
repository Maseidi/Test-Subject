import { add2Stash } from '../stash.js'
import { isGun } from '../gun-details.js'
import { createAndAddClass, nextId } from '../util.js'
import { Coin, Lever } from '../interactables.js'
import { getCurrentRoomInteractables } from '../elements.js'
import { renderInteractable, renderInteractables } from '../room-loader.js'
import { getEnemies, getInteractables, setEnemies, setInteractables } from '../entities.js'
import { getChaos, setChaos, setCurrentChaosEnemies, setCurrentChaosSpawned, setEnemyId, setSpawnCounter } from './variables.js'
import { 
    AdrenalineShopItem,
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
import { 
    ARCTIC_WARFERE,
    BENELLI_M4,
    M1911,
    MAUSER,
    MP5K,
    P90,
    PARKER_HALE_M_85,
    PPSH,
    REMINGTON_1858,
    REMINGTON_870,
    REVOLVER,
    SPAS,
    STEYR_SSG_69,
    UZI } from '../loot.js'

export const startChaos = () => {
    setEnemyId(0)
    setSpawnCounter(0)
    setChaos(getChaos() + 1)
    setCurrentChaosEnemies(4 + getChaos())
    setCurrentChaosSpawned(0)
    getEnemies().get(1).forEach(enemy => enemy?.sprite?.remove())
    setEnemies(new Map([[1, []]]))
    getCurrentRoomInteractables().forEach(int => int.remove())
    setInteractables(new Map([[1, [...getInteractables().get(1).filter((item, index) => index < 3 || isGun(item.name))]]]))
    renderInteractables()
    renderchaosPopup()
    setEnemies(new Map([[1, []]]))
}

export const endChaos = () => {
    const lever = new Lever(1400, 1000)
    renderInteractable(lever)
    setInteractables(new Map([[1, [...getInteractables().get(1), lever]]]))
    renderchaosPopup('end')
    add2Stash({...new Coin(), id: nextId()}, Math.min(20, getChaos()))
    updateShop()
}

const renderchaosPopup = (type = 'start') => {
    const lastPopup = document.querySelector('.chaos-container')
    if ( lastPopup ) lastPopup.remove()
    const container = createAndAddClass('div', 'chaos-container', 'ui-theme')
    const text1 = document.createElement('p')
    text1.textContent = type === 'start' ? `Chaos ${getChaos()}` : 'Chaos survived!'
    container.append(text1)
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
        if ( chaos < 80 ) {
            console.log('here');
            vendingMachine.push(new Pouch())
            console.log(vendingMachine);
        }
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(PurpleVaccineShopItem)
        if ( chaos > 10 ) vendingMachine.push(new AdrenalineShopItem())
    }

    if ( chaos === 20 )  vendingMachine.push(new ArmorShopItem())
    if ( chaos === 2 )   vendingMachine.push(new GunShopItem(MP5K))
    if ( chaos === 4 )   vendingMachine.push(new GunShopItem(REMINGTON_870))
    if ( chaos === 6 )   vendingMachine.push(new GunShopItem(ARCTIC_WARFERE))
    if ( chaos === 8 )   vendingMachine.push(new GunShopItem(M1911))
    if ( chaos === 10 )  vendingMachine.push(new GunShopItem(UZI))
    if ( chaos === 12 )  vendingMachine.push(new GunShopItem(SPAS))
    if ( chaos === 14 )  vendingMachine.push(new GunShopItem(STEYR_SSG_69))
    if ( chaos === 16 )  vendingMachine.push(new GunShopItem(REVOLVER))
    if ( chaos === 18 )  vendingMachine.push(new GunShopItem(MAUSER))
    if ( chaos === 20 )  vendingMachine.push(new GunShopItem(PPSH))
    if ( chaos === 22 )  vendingMachine.push(new GunShopItem(BENELLI_M4))
    if ( chaos === 24 )  vendingMachine.push(new GunShopItem(PARKER_HALE_M_85))
    if ( chaos === 26 )  vendingMachine.push(new GunShopItem(P90))
    if ( chaos === 28 )  vendingMachine.push(new GunShopItem(REMINGTON_1858))

    manageRepeatedItem(PistolAmmoShopItem)
    if ( chaos % 2 === 0 ) manageRepeatedItem(SmgAmmoShopItem)
    if ( chaos % 3 === 0 ) manageRepeatedItem(ShotgunShellsShopItem)
    if ( chaos % 4 === 0 ) manageRepeatedItem(RifleAmmoShopItem)
    if ( chaos % 5 === 0 ) manageRepeatedItem(MagnumAmmoShopItem)
}

const manageRepeatedItem = (Item) => {
    const instance = new Item()
    if ( getShopItems().find(item => !item.sold && item.name === instance.name) ) return
    getShopItems().push(instance)
}