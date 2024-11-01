import { getAttributesEl } from '../elements.js'
import { getGunDetails, isGun } from '../../gun-details.js'
import { autocomplete, renderAttributes, input, deleteButton } from './shared.js'
import { getItemBeingModified, getShop, setItemBeingModified, setShop } from '../variables.js'
import { 
    AdrenalineShopItem,
    AntidoteShopItem,
    ArmorShopItem,
    BandageShopItem,
    BlueVaccineShopItem,
    EnergyDrinkShopItem,
    FlashbangShopItem,
    GreenVaccineShopItem,
    GrenadeShopItem,
    GunShopItem,
    HardDriveShopItem,
    HealthPotionShopItem,
    LighterShopItem,
    LuckPillsShopItem,
    MagnumAmmoShopItem,
    PistolAmmoShopItem,
    Pouch,
    PurpleVaccineShopItem,
    RedVaccineShopItem,
    RifleAmmoShopItem,
    ShotgunShellsShopItem,
    SmgAmmoShopItem,
    StickShopItem,
    YellowVaccineShopItem } from '../../shop-item.js'

export const renderShopItemAttributes = () => {
    renderAttributes()
    const shopItem = getItemBeingModified()

    getAttributesEl().append(
        autocomplete('item', shopItem.name, (value) => {
            const currentIndex = getShop().findIndex(item => item === getItemBeingModified())
            const newShopItem = shopItems.find(item => item.name === value) || (isGun(value) ? new GunShopItem(value) : null)
            if ( !newShopItem ) return
            newShopItem.renderProgress = shopItem.renderProgress
            setItemBeingModified(newShopItem)
            getShop()[currentIndex] = getItemBeingModified()
            renderShopItemAttributes()
        }, [
                ...(shopItems), 
                ...[...getGunDetails().keys()].map(gunName => new GunShopItem(gunName))
           ].map(item => ({label: item.heading, value: item.name})))
    )

    getAttributesEl().append(
        input('render progress', shopItem.renderProgress, (value) => shopItem.renderProgress = value)
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredItems = getShop().filter(item => item !== shopItem)
            setShop(filteredItems)
        })
    )

}

const shopItems = [
    new BandageShopItem(),       new HardDriveShopItem(),
    new PistolAmmoShopItem(),    new ShotgunShellsShopItem(),
    new MagnumAmmoShopItem(),    new SmgAmmoShopItem(),
    new RifleAmmoShopItem(),     new GrenadeShopItem(),
    new FlashbangShopItem(),     new Pouch(),
    new AdrenalineShopItem(),    new HealthPotionShopItem(),
    new LuckPillsShopItem(),     new EnergyDrinkShopItem(),
    new ArmorShopItem(),         new RedVaccineShopItem(),
    new GreenVaccineShopItem(),  new BlueVaccineShopItem(),
    new YellowVaccineShopItem(), new PurpleVaccineShopItem(),
    new StickShopItem(),         new AntidoteShopItem(),
    new LighterShopItem(),
]