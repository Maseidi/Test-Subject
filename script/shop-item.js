import { getWeaponDetails } from './weapon-details.js'
import { 
    AdrenalineDrop,
    Bandage,
    Drop,
    EnergyDrink,
    Flashbang,
    Grenade,
    HardDrive,
    HealthPotionDrop,
    LuckPillsDrop,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo,
    WeaponDrop } from './interactables.js'
import { Progress } from './progress.js'

class ShopItem {
    constructor(drop, amount, price) {
        this.width = drop.width
        this.left = drop.left
        this.top = drop.top
        this.name = drop.name
        this.heading = drop.heading
        this.popup = drop.popup
        this.space = drop.space
        this.description = drop.description
        this.renderProgress = drop.renderProgress
        this.amount = amount
        this.price = price
        this.sold = false
    }
}

class BandageShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Bandage(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class HardDriveShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new HardDrive(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 2, 1)
    }
}

class PistolAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new PistolAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 30, 1)
    }
}

class ShotgunShellsShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new ShotgunShells(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 20, 1)
    }
}

class MagnumAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new MagnumAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 5, 1)
    }
}

class SmgAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new SmgAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 90, 1,false)
    }
}

class RifleAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new RifleAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 10, 1)
    }
}

class WeaponShopItem extends ShopItem {
    constructor(name, renderProgress) {
        super(new WeaponDrop(null, null, name, 0, 1, 1, 1, 1, 1, 
            Progress.builder().setRenderProgress(renderProgress)), 1, getWeaponDetails().get(name).price)
    }
}

class GrenadeShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Grenade(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 2, 1)
    }
}

class FlashbangShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Flashbang(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class Pouch extends ShopItem {
    constructor(renderProgress) {
        super({name: 'pouch', heading: 'pouch', description: 'Increases your carry capacity by 2 slots', 
            renderprogress: Progress.builder().setRenderProgress(renderProgress)}, 1, 5)
    }
}

class AdrenalineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new AdrenalineDrop(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class HealthPotionShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new HealthPotionDrop(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class LuckPillsShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new LuckPillsDrop(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class EnergyDrinkShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new EnergyDrink(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

let shopItems = [
    new BandageShopItem(),
    new HardDriveShopItem('1'),
    new PistolAmmoShopItem('2'),
    new ShotgunShellsShopItem('3'),
    new MagnumAmmoShopItem('4'),
    new SmgAmmoShopItem('5'),
    new RifleAmmoShopItem('6'),
    new WeaponShopItem('uzi', '7'),
    new WeaponShopItem('mp5k', '8'),
    new Pouch('9'),
    new GrenadeShopItem('10'),
    new FlashbangShopItem('11'),
    new AdrenalineShopItem(),
    new HealthPotionShopItem('0'),
    new LuckPillsShopItem('1'),
    new EnergyDrinkShopItem('2')
]

export const setShopItems = (val) => {
    shopItems = val
}
export const getShopItems = () => shopItems

export const getShopItemsWithId = () => shopItems.map((item, index) => ({...item, id:index}))