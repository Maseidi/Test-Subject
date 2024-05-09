import { getWeaponSpecs } from "./weapon-specs.js";
import { 
    Bandage,
    Drop,
    HardDrive,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo,
    WeaponDrop } from "./interactables.js";

class ShopItem extends Drop {
    constructor(drop, amount, price, progress, sold) {
        super(drop.width, drop.left, drop.top, drop.name, drop.heading, drop.popup, amount, drop.space, drop.description)
        this.price = price
        this.progress = progress
        this.sold = sold
    }
}

class BandageShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new Bandage(null, null, null), amount, price, progress, sold)
    }
}

class HardDriveShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new HardDrive(null, null, null), amount, price, progress, sold)
    }
}

class PistolAmmoShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new PistolAmmo(null, null, null), amount, price, progress, sold)
    }
}

class ShotgunShellsShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new ShotgunShells(null, null, null), amount, price, progress, sold)
    }
}

class MagnumAmmoShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new MagnumAmmo(null, null, null), amount, price, progress, sold)
    }
}

class SmgAmmoShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new SmgAmmo(null, null, null), amount, price, progress, sold)
    }
}

class RifleAmmoShopItem extends ShopItem {
    constructor(amount, price, progress, sold) {
        super(new RifleAmmo(null, null, null), amount, price, progress, sold)
    }
}

class WeaponShopItem extends ShopItem {
    constructor(name, progress, sold) {
        super(new WeaponDrop(null, null, name, 0, 1, 1, 1, 1, 1), 1, getWeaponSpecs().get(name).price, progress, sold)
    }
}

class Pouch extends ShopItem {
    constructor(amount, price, progress, sold) {
        super({name: 'pouch', heading: 'pouch', description: 'Increases your carry capacity by 2 slots'}, amount, price, progress, sold)
    }
}

let shopItems = [
    new BandageShopItem(3, 1, 3, false),
    new HardDriveShopItem(2, 1, 0, true),
    new PistolAmmoShopItem(30, 1, 0, false),
    new ShotgunShellsShopItem(20, 1, 0, false),
    new MagnumAmmoShopItem(5, 1, 0, false),
    new SmgAmmoShopItem(90, 1, 0, false),
    new RifleAmmoShopItem(10, 1, 0, false),
    new WeaponShopItem('uzi', 0, false),
    new WeaponShopItem('mp5k', 0, false),
    new WeaponShopItem('riotgun', 0, false),
    new Pouch(1, 3, 0, false)
]

export const setShopItems = (val) => {
    shopItems = val
}
export const getShopItems = () => {
    return shopItems
}
export const getShopItemsWithId = () => {
    return shopItems.map((item, index) => { 
        return {...item, id:index}
    })
}