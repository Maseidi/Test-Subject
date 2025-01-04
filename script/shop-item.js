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
    YellowVaccine, 
    Antidote,
    Lighter} from './interactables.js'

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

export class BandageShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Bandage(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class HardDriveShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new HardDrive(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 2, 1)
    }
}

export class PistolAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new PistolAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 30, 1)
    }
}

export class ShotgunShellsShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new ShotgunShells(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 20, 1)
    }
}

export class MagnumAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new MagnumAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 5, 1)
    }
}

export class SmgAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new SmgAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 90, 1,false)
    }
}

export class RifleAmmoShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new RifleAmmo(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 10, 1)
    }
}

export class GunShopItem extends ShopItem {
    constructor(name, renderProgress) {
        super(new GunDrop(null, null, name, 0, 1, 1, 1, 1, 1, 
            Progress.builder().setRenderProgress(renderProgress)), 1, getGunDetails().get(name).price)
    }
}

export class GrenadeShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Grenade(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 2, 1)
    }
}

export class FlashbangShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Flashbang(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class Pouch extends ShopItem {
    constructor(renderProgress) {
        super({name: 'pouch', heading: 'pouch', description: 'Increases your carry capacity by 2 slots', 
            renderProgress: renderProgress ?? Number.MAX_SAFE_INTEGER}, 1, 5)
    }
}

export class AdrenalineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Adrenaline(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

export class HealthPotionShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new HealthPotion(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

export class LuckPillsShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new LuckPills(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

export class EnergyDrinkShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new EnergyDrink(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 10)
    }
}

export class ArmorShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new BodyArmor(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 100)
    }
}

export class RedVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new RedVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class GreenVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new GreenVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class BlueVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new BlueVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class YellowVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new YellowVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class PurpleVaccineShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new PurpleVaccine(null, null, null, Progress.builder().setRenderProgress(renderProgress)), 3, 1)
    }
}

export class StickShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Stick(null, null, Progress.builder().setRenderProgress(renderProgress), 100), 1, 3)
    }
}

export class AntidoteShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Antidote(null, null, 3, Progress.builder().setRenderProgress(renderProgress)), 1, 3)
    }
}

export class LighterShopItem extends ShopItem {
    constructor(renderProgress) {
        super(new Lighter(null, null, Progress.builder().setRenderProgress(renderProgress)), 1, 60)
    }
}

let shopItems = null
export const setShopItems = (val) => {
    shopItems = val
}
export const getShopItems = () => shopItems

export const getShopItemsWithId = () => shopItems.map((item, index) => ({...item, id:index}))

export const initShopItems = () => []