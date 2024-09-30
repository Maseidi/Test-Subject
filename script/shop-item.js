import { Progress } from './progress.js'
import { getGunDetails } from './gun-details.js'
import { 
    Adrenaline,
    Bandage,
    BlueVaccine,
    BodyArmor,
    EnergyDrink,
    Flashbang,
    GreenVaccine,
    Grenade,
    HardDrive,
    HealthPotion,
    LuckPills,
    MagnumAmmo,
    PistolAmmo,
    PurpleVaccine,
    RedVaccine,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo,
    Stick,
    GunDrop, 
    YellowVaccine } from './interactables.js'

class ShopItem {
    constructor(drop, amount, price) {
        this.width =          drop.width          ?? 0
        this.name =           drop.name           ?? null
        this.heading =        drop.heading        ?? null
        this.popup =          drop.popup          ?? null
        this.space =          drop.space          ?? null
        this.description =    drop.description    ?? null
        this.renderProgress = drop.renderProgress ?? null
        this.amount =         amount              ?? 0
        this.price =          price               ?? 0
        this.sold =           false
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

class GunShopItem extends ShopItem {
    constructor(name, renderProgress) {
        super(new GunDrop(null, null, name, 0, 1, 1, 1, 1, 1, 
            Progress.builder().setRenderProgress(renderProgress)), 1, getGunDetails().get(name).price)
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
        super(new Adrenaline(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class HealthPotionShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new HealthPotion(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class LuckPillsShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new LuckPills(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class EnergyDrinkShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new EnergyDrink(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

class ArmorShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new BodyArmor(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 100)
    }
}

class RedVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new RedVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class GreenVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new GreenVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class BlueVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new BlueVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class YellowVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new YellowVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class PurpleVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new PurpleVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

class StickShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Stick(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 3)
    }
}

let shopItems = null
export const setShopItems = (val) => {
    shopItems = val
}
export const getShopItems = () => shopItems

export const getShopItemsWithId = () => shopItems.map((item, index) => ({...item, id:index}))

export const initialShopItems = [
    new BandageShopItem(Number.MAX_SAFE_INTEGER),
    new BandageShopItem(Number.MAX_SAFE_INTEGER),
    new BandageShopItem(Number.MAX_SAFE_INTEGER),
]