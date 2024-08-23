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
        this.progress = drop.progress
        this.amount = amount
        this.price = price
        this.sold = false
    }
}

class BandageShopItem extends ShopItem {
    constructor(progress) {
        super(new Bandage(null, null, null, progress), 3, 1, false)
    }
}

class HardDriveShopItem extends ShopItem {
    constructor(progress) {
        super(new HardDrive(null, null, null, progress), 2, 1, false)
    }
}

class PistolAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new PistolAmmo(null, null, null, progress), 30, 1, false)
    }
}

class ShotgunShellsShopItem extends ShopItem {
    constructor(progress) {
        super(new ShotgunShells(null, null, null, progress), 20, 1, false)
    }
}

class MagnumAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new MagnumAmmo(null, null, null, progress), 5, 1, false)
    }
}

class SmgAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new SmgAmmo(null, null, null, progress), 90, 1,false)
    }
}

class RifleAmmoShopItem extends ShopItem {
    constructor(progress) {
        super(new RifleAmmo(null, null, null, progress), 10, 1, false)
    }
}

class WeaponShopItem extends ShopItem {
    constructor(name, progress) {
        super(new WeaponDrop(null, null, name, 0, 1, 1, 1, 1, 1, progress), 1, getWeaponDetails().get(name).price, false)
    }
}

class GrenadeShopItem extends ShopItem {
    constructor(progress) {
        super(new Grenade(null, null, null, progress), 2, 1, false)
    }
}

class FlashbangShopItem extends ShopItem {
    constructor(progress) {
        super(new Flashbang(null, null, null, progress), 3, 1, false)
    }
}

class Pouch extends ShopItem {
    constructor(progress) {
        super({name: 'pouch', heading: 'pouch', description: 'Increases your carry capacity by 2 slots', progress}, 1, 5, false)
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
    new FlashbangShopItem('11')
]

export const setShopItems = (val) => {
    shopItems = val
}
export const getShopItems = () => shopItems

export const getShopItemsWithId = () => shopItems.map((item, index) => ({...item, id:index}))