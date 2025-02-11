import {
    getCurrentRoomInteractables,
    getToggleMenuButton,
    setCurrentRoomBullets,
    setCurrentRoomEnemies,
    setCurrentRoomExplosions,
    setCurrentRoomFlames,
    setCurrentRoomInteractables,
    setCurrentRoomPoisons,
    setCurrentRoomThrowables,
} from '../elements.js'
import { getEnemies, getInteractables, getPopups, setEnemies, setInteractables } from '../entities.js'
import { isGun } from '../gun-details.js'
import { Coin, Lever, PC } from '../interactables.js'
import { Popup } from '../popup-manager.js'
import { activateAllProgresses, getProgressValueByNumber } from '../progress-manager.js'
import { Progress } from '../progress.js'
import { renderInteractable, renderInteractables } from '../room-loader.js'
import { IS_MOBILE } from '../script.js'
import { getSettings } from '../settings.js'
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
    YellowVaccineShopItem,
} from '../shop-item.js'
import { getPlayingMusic, playActionMusic, playPeaceMusic, playPickup } from '../sound-manager.js'
import { add2Stash } from '../stash.js'
import { renderToggleMenuButton } from '../user-interface.js'
import { addClass, appendAll, createAndAddClass, element2Object } from '../util.js'
import {
    getAnimatedElements,
    getPlayerX,
    getPlayerY,
    getRoomLeft,
    getRoomTop,
    setAnimatedElements,
} from '../variables.js'
import {
    getChaos,
    getRandomizedWeapons,
    setChaos,
    setCurrentChaosEnemies,
    setCurrentChaosSpawned,
    setEnemiesKilled,
    setEnemyId,
    setSpawnCounter,
} from './variables.js'

export const startChaos = () => {
    setEnemyId(0)
    setSpawnCounter(0)
    setEnemiesKilled(0)
    setChaos(getChaos() + 1)
    setCurrentChaosEnemies(4 + getChaos())
    setCurrentChaosSpawned(0)
    resetRoom()
    renderInteractables()
    renderchaosPopup()
    getPlayingMusic()?.pause()
    playActionMusic()
    getToggleMenuButton()?.remove()
}

const resetRoom = () => {
    setCurrentRoomFlames([])
    setCurrentRoomBullets([])
    setCurrentRoomPoisons([])
    setCurrentRoomEnemies([])
    setCurrentRoomExplosions([])
    setCurrentRoomThrowables([])

    getEnemies()
        .get(1)
        .forEach(enemy => enemy?.sprite?.remove())
    setEnemies(new Map([[1, []]]))

    setInteractables(
        new Map([
            [
                1,
                [
                    ...getInteractables()
                        .get(1)
                        .filter(item => isGun(item.name)),
                ],
            ],
        ]),
    )
    getCurrentRoomInteractables().forEach(int => int.remove())
    setCurrentRoomInteractables([])
}

export const endChaos = () => {
    getInteractables()
        .get(1)
        .forEach(int => add2Stash(int, int.amount))
    getCurrentRoomInteractables().forEach(animateDrop)
    const lever = new Lever(1400, 1000)
    const pc = new PC(20, 20)
    renderInteractable(lever)
    renderInteractable(pc)
    setInteractables(new Map([[1, [pc, lever]]]))
    renderchaosPopup('end')
    add2Stash(new Coin(), Math.min(20, getChaos()))
    updateShop()
    getPlayingMusic()?.pause()
    playPeaceMusic()
    notifyPlayerOfStashAndShopAndPC()
}

const animateDrop = interactable => {
    const intObj = element2Object(interactable)
    if (intObj.solid) {
        interactable.remove()
        return
    }
    const { left, top } = intObj
    const animatedInteractable = interactable.animate(
        [
            { left: `${left}px`, top: `${top}px` },
            { left: `${getPlayerX() - getRoomLeft()}px`, top: `${getPlayerY() - getRoomTop()}px` },
        ],
        {
            duration: 200,
        },
    )
    setAnimatedElements([...getAnimatedElements(), animatedInteractable])
    interactable.setAttribute('moving-towards-player', 'true')
    animatedInteractable.addEventListener('finish', () => {
        setAnimatedElements(getAnimatedElements().filter(item => item !== animatedInteractable))
        playPickup(interactable.getAttribute('name'))
        interactable.remove()
    })
}

const notifyPlayerOfStashAndShopAndPC = () => {
    if (getProgressValueByNumber('9999999997') || localStorage.getItem('survival-tutorial-done') === 'DONE') {
        if (IS_MOBILE) renderToggleMenuButton()
        return
    }
    getPopups().push(
        new Popup(
            `After each wave, all of the available loot will be collected automitically. You can check them in your stash.`,
            Progress.builder().setRenderProgress('9999999997').setProgress2Active('9999999998'),
            10000,
        ),
    )
    getPopups().push(
        new Popup(
            () => {
                if (IS_MOBILE) {
                    if (!getToggleMenuButton()) renderToggleMenuButton()
                    addClass(getToggleMenuButton(), 'glow')
                }
                return `Use ${
                    IS_MOBILE
                        ? 'the cart icon'
                        : `<span>${getSettings().controls.toggleMenu.replace('Key', '').replace('Digit', '')}</span>`
                } to manage your items in stash, or buy / sell / upgrade items using the shop. The menus can be toggled if you press this button repeatedly.`
            },
            Progress.builder().setRenderProgress('9999999998').setProgress2Active('9999999999'),
            10000,
        ),
    )
    getPopups().push(
        new Popup(
            `You can save your progress by using the computer at the top left corner of the map.`,
            Progress.builder().setRenderProgress('9999999999'),
            10000,
        ),
    )
    activateAllProgresses('9999999997')
}

const renderchaosPopup = (type = 'start') => {
    const lastPopup = document.querySelector('.chaos-container')
    if (lastPopup) lastPopup.remove()
    const container = createAndAddClass('div', 'chaos-container', 'ui-theme')
    const text1 = document.createElement('p')
    text1.textContent = type === 'start' ? `Chaos ${getChaos()}` : 'Chaos survived!'
    container.append(text1)
    if (type === 'end') {
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
    if (chaos % 10 === 1) {
        manageRepeatedItem(RedVaccineShopItem)
    }
    if (chaos % 10 === 2) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(BlueVaccineShopItem)
        if (chaos > 10) vendingMachine.push(new HealthPotionShopItem())
    }
    if (chaos % 10 === 3) {
        manageRepeatedItem(HardDriveShopItem)
        manageRepeatedItem(FlashbangShopItem)
        manageRepeatedItem(YellowVaccineShopItem)
    }
    if (chaos % 10 === 4) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(GreenVaccineShopItem)
        if (chaos > 10) vendingMachine.push(new EnergyDrinkShopItem())
    }
    if (chaos % 10 === 5) {
        manageRepeatedItem(PurpleVaccineShopItem)
    }
    if (chaos % 10 === 6) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(HardDriveShopItem)
        manageRepeatedItem(RedVaccineShopItem)
    }
    if (chaos % 10 === 7) {
        manageRepeatedItem(BlueVaccineShopItem)
        manageRepeatedItem(AntidoteShopItem)
    }
    if (chaos % 10 === 8) {
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(GrenadeShopItem)
        manageRepeatedItem(YellowVaccineShopItem)
        if (chaos > 10) vendingMachine.push(new LuckPillsShopItem())
    }
    if (chaos % 10 === 9) {
        manageRepeatedItem(HardDriveShopItem)
        manageRepeatedItem(GreenVaccineShopItem)
    }
    if (chaos % 10 === 0) {
        if (chaos < 80) vendingMachine.push(new Pouch())
        manageRepeatedItem(BandageShopItem)
        manageRepeatedItem(PurpleVaccineShopItem)
        if (chaos > 10) vendingMachine.push(new AdrenalineShopItem())
    }

    if (chaos === 20) vendingMachine.push(new ArmorShopItem())

    addWeapon2Shop()
    manageRepeatedItem(PistolAmmoShopItem)
    if (chaos % 2 === 0) manageRepeatedItem(SmgAmmoShopItem)
    if (chaos % 3 === 0) manageRepeatedItem(ShotgunShellsShopItem)
    if (chaos % 4 === 0) manageRepeatedItem(RifleAmmoShopItem)
    if (chaos % 5 === 0) manageRepeatedItem(MagnumAmmoShopItem)
}

const addWeapon2Shop = () =>
    getRandomizedWeapons().forEach((item, index) => {
        if ((index + 1) * 2 === getChaos()) getShopItems().push(new GunShopItem(item))
    })

const manageRepeatedItem = Item => {
    const instance = new Item()
    if (getShopItems().find(item => !item.sold && item.name === instance.name)) return
    getShopItems().push(instance)
}
