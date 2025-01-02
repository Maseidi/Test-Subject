import { add2Stash } from '../stash.js'
import { isGun } from '../gun-details.js'
import { createAndAddClass } from '../util.js'
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
    renderchaosPopup()
    getCurrentRoomInteractables().forEach(int => int.remove())
    setInteractables(new Map([[1, [...getInteractables().get(1).filter((item, index) => index < 3 || isGun(item.name))]]]))
    renderInteractables()
    setEnemies(new Map([[1, []]]))
}

export const endChaos = () => {
    getEnemies().get(1).forEach(enemy => enemy.sprite.remove())
    setEnemies(new Map([[1, []]]))
    renderInteractable(new Lever(1400, 1000))
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
    document.querySelector('body').append(container)
    setTimeout(() => container.remove(), 3000)
}

const updateShop = () => {
    const chaos = getChaos()
    const vendingMachine = getShopItems()
    if ( chaos % 10 === 1 ) {
        vendingMachine.push(new PistolAmmoShopItem())
        vendingMachine.push(new RedVaccineShopItem())
    }
    if ( chaos % 10 === 2 ) {
        vendingMachine.push(new BandageShopItem())
        vendingMachine.push(new SmgAmmoShopItem())
        vendingMachine.push(new BlueVaccineShopItem())
        if ( chaos > 10 ) vendingMachine.push(new HealthPotionShopItem())
    }
    if ( chaos % 10 === 3 ) {
        vendingMachine.push(new HardDriveShopItem())
        vendingMachine.push(new FlashbangShopItem())
        vendingMachine.push(new ShotgunShellsShopItem())
        vendingMachine.push(new YellowVaccineShopItem())
    }
    if ( chaos % 10 === 4 ) {
        vendingMachine.push(new BandageShopItem())
        vendingMachine.push(new RifleAmmoShopItem())
        vendingMachine.push(new GreenVaccineShopItem())
        if ( chaos > 10 ) vendingMachine.push(new EnergyDrinkShopItem())
    }
    if ( chaos % 10 === 5 ) {
        vendingMachine.push(new MagnumAmmoShopItem())
        vendingMachine.push(new PurpleVaccineShopItem())
    }
    if ( chaos % 10 === 6 ) {
        vendingMachine.push(new BandageShopItem())
        vendingMachine.push(new HardDriveShopItem())
        vendingMachine.push(new PistolAmmoShopItem())
        vendingMachine.push(new RedVaccineShopItem())
    }
    if ( chaos % 10 === 7 ) {
        vendingMachine.push(new SmgAmmoShopItem())
        vendingMachine.push(new BlueVaccineShopItem())
    }
    if ( chaos % 10 === 8 ) {
        vendingMachine.push(new BandageShopItem())
        vendingMachine.push(new GreenVaccineShopItem())
        vendingMachine.push(new YellowVaccineShopItem())
        vendingMachine.push(new ShotgunShellsShopItem())
        if ( chaos > 10 ) vendingMachine.push(new LuckPillsShopItem())
    }
    if ( chaos % 10 === 9 ) {
        vendingMachine.push(new HardDriveShopItem())
        vendingMachine.push(new RifleAmmoShopItem())
        vendingMachine.push(new GreenVaccineShopItem())
    }
    if ( chaos % 10 === 0 ) {
        vendingMachine.push(new Pouch())
        vendingMachine.push(new BandageShopItem())
        vendingMachine.push(new MagnumAmmoShopItem())
        vendingMachine.push(new PurpleVaccineShopItem())
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
}
