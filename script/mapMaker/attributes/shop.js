import { getGunDetails, isGun } from '../../gun-details.js'
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
    YellowVaccineShopItem,
} from '../../shop-item.js'
import { containsClass } from '../../util.js'
import { getAttributesEl, getSelectedToolEl } from '../elements.js'
import { addShopContents } from '../map-maker.js'
import { getItemBeingModified, getShop, setItemBeingModified, setShop } from '../variables.js'
import { autocomplete, deleteButton, input, renderAttributes } from './shared.js'

export const renderShopItemAttributes = () => {
    renderAttributes()
    const shopItem = getItemBeingModified()

    getAttributesEl().append(
        autocomplete(
            'item',
            shopItem.name,
            value => {
                const currentIndex = getShop().findIndex(item => item === getItemBeingModified())
                const newShopItem =
                    shopItems.find(item => item.name === value) || (isGun(value) ? new GunShopItem(value) : null)
                if (!newShopItem) return
                newShopItem.renderProgress = shopItem.renderProgress
                setItemBeingModified(newShopItem)
                getShop()[currentIndex] = getItemBeingModified()
                renderShopItemAttributes()
            },
            [...shopItems, ...[...getGunDetails().keys()].map(gunName => new GunShopItem(gunName))].map(item => ({
                label: item.heading,
                value: item.name,
            })),
            'Select the item to be available for sale',
        ),
    )

    getAttributesEl().append(
        input(
            'render progress',
            shopItem.renderProgress,
            value => (shopItem.renderProgress = value),
            'number',
            undefined,
            undefined,
            undefined,
            'Indicates that which progress flag should be active so that this item will be available for sale',
        ),
    )

    getAttributesEl().append(
        deleteButton(() => {
            const filteredItems = getShop().filter(item => item !== shopItem)
            setShop(filteredItems)
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addShopContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}

const shopItems = [
    new BandageShopItem(),
    new HardDriveShopItem(),
    new PistolAmmoShopItem(),
    new ShotgunShellsShopItem(),
    new MagnumAmmoShopItem(),
    new SmgAmmoShopItem(),
    new RifleAmmoShopItem(),
    new GrenadeShopItem(),
    new FlashbangShopItem(),
    new Pouch(),
    new AdrenalineShopItem(),
    new HealthPotionShopItem(),
    new LuckPillsShopItem(),
    new EnergyDrinkShopItem(),
    new ArmorShopItem(),
    new RedVaccineShopItem(),
    new GreenVaccineShopItem(),
    new BlueVaccineShopItem(),
    new YellowVaccineShopItem(),
    new PurpleVaccineShopItem(),
    new StickShopItem(),
    new AntidoteShopItem(),
    new LighterShopItem(),
]
