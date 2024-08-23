import { getWeaponDetails } from './weapon-details.js'
import { 
    Bandage,
    Drop,
    Flashbang,
    Grenade,
    HardDrive,
    MagnumAmmo,
    PistolAmmo,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo,
    WeaponDrop } from './interactables.js'

class ShopItem extends Drop {
    constructor(drop, amount, price, progress, sold) {
        super(drop.width, drop.left, drop.top, drop.name, drop.heading, drop.popup, amount, drop.space, drop.description)
        this.price = price
        this.progress = progress
        this.sold = sold
    }
}

class BandageShopItem extends ShopItem {
    constructor(progress) {
        super(new Bandage(null, null, null), 3, 1, progress, false)
    }
}

class HardDriveShopItem extends ShopItem {
    constructor(progress) {
        super(new HardDrive(null, null, null), 2, 1, progress, false)
    }
}

class PistolAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new PistolAmmo(null, null, null), 30, 1, progress, false)
    }
}

class ShotgunShellsShopItem extends ShopItem {
    constructor(progress) {
        super(new ShotgunShells(null, null, null), 20, 1, progress, false)
    }
}

class MagnumAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new MagnumAmmo(null, null, null), 5, 1, progress, false)
    }
}

class SmgAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new SmgAmmo(null, null, null), 90, 1, progress, false)
    }
}

class RifleAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new RifleAmmo(null, null, null), 10, 1, progress, false)
    }
}

class WeaponShopItem extends ShopItem {
    constructor(name, progress) {
        super(new WeaponDrop(null, null, name, 0, 1, 1, 1, 1, 1), 1, getWeaponDetails().get(name).price, progress)
    }
}

class GrenadeShopItem extends ShopItem {
    constructor(progress) {
        super(new Grenade(null, null, null), 2, 1, progress, false)
    }
}

class FlashbangShopItem extends ShopItem {
    constructor(progress) {
        super(new Flashbang(null, null, null), 3, 1, progress, false)
    }
}

class Pouch extends ShopItem {
    constructor(progress) {
        super({name: 'pouch', heading: 'pouch', description: 'Increases your carry capacity by 2 slots'}, 1, 5, progress, false)
    }
}

let shopItems = [
    new BandageShopItem('0'),
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
    new FlashbangShopItem('11')
]

export const setShopItems = (val) => {
    shopItems = val
}
export const getShopItems = () => shopItems

export const getShopItemsWithId = () => shopItems.map((item, index) => { return {...item, id:index}})