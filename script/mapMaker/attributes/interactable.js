import { getGunDetails, isGun } from '../../gun-details.js'
import {
    Adrenaline,
    Antidote,
    Bandage,
    BlueVaccine,
    BodyArmor,
    Coin,
    Crate,
    EnergyDrink,
    Flashbang,
    GreenVaccine,
    Grenade,
    GunDrop,
    HardDrive,
    HealthPotion,
    KeyDrop,
    Lever,
    Lighter,
    LuckPills,
    MagnumAmmo,
    Note,
    PC,
    PistolAmmo,
    PurpleVaccine,
    RedVaccine,
    RifleAmmo,
    ShotgunShells,
    SmgAmmo,
    Speaker,
    Stash,
    Stick,
    VendingMachine,
    YellowVaccine,
} from '../../interactables.js'
import { Loot, RANDOM } from '../../loot.js'
import { Progress } from '../../progress.js'
import { containsClass, difficulties as difficultyMap } from '../../util.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl } from '../elements.js'
import { addInteractableContents, renderInteractables } from '../map-maker.js'
import { getInteractables, getItemBeingModified, getRoomBeingMade, setItemBeingModified } from '../variables.js'
import { manageLootAttribute } from './loot.js'
import { autocomplete, deleteButton, difficultyAutoComplete, input, renderAttributes, updateMap } from './shared.js'

const interactables = [
    Coin,
    HardDrive,
    PistolAmmo,
    ShotgunShells,
    MagnumAmmo,
    SmgAmmo,
    RifleAmmo,
    Antidote,
    Grenade,
    Flashbang,
    Stick,
    Lighter,
    Adrenaline,
    HealthPotion,
    PC,
    Stash,
    VendingMachine,
    Speaker,
    Crate,
    Lever,
    Bandage,
    LuckPills,
    EnergyDrink,
    BodyArmor,
    Note,
    RedVaccine,
    GreenVaccine,
    PurpleVaccine,
    YellowVaccine,
    BlueVaccine,
]

const itemsMap1 = new Map([
    ['purplevaccine', PurpleVaccine],
    ['smgAmmo', SmgAmmo],
    ['coin', Coin],
    ['antidote', Antidote],
    ['bandage', Bandage],
    ['rifleAmmo', RifleAmmo],
    ['harddrive', HardDrive],
    ['grenade', Grenade],
    ['flashbang', Flashbang],
    ['redvaccine', RedVaccine],
    ['pistolAmmo', PistolAmmo],
    ['shotgunShells', ShotgunShells],
    ['magnumAmmo', MagnumAmmo],
    ['greenvaccine', GreenVaccine],
    ['yellowvaccine', YellowVaccine],
    ['bluevaccine', BlueVaccine],
])

const itemsMap2 = new Map([
    ['computer', PC],
    ['stash', Stash],
    ['vendingMachine', VendingMachine],
    ['speaker', Speaker],
])

const itemsMap3 = new Map([
    ['armor', BodyArmor],
    ['lever', Lever],
    ['lighter', Lighter],
])

const itemsMap4 = new Map([
    ['adrenaline', Adrenaline],
    ['luckpills', LuckPills],
    ['healthpotion', HealthPotion],
    ['energydrink', EnergyDrink],
])

export const renderInteractableAttributes = () => {
    const interactable = getItemBeingModified()
    const { name, left, top, amount } = interactable
    renderAttributes()

    getAttributesEl().append(
        autocomplete(
            'type',
            name,
            value => {
                let newInteractable = findInteractable(value, interactable)
                if (!newInteractable) return
                setItemBeingModified(newInteractable)
                updateMap(getInteractables(), newInteractable, 'interactable')
                getElemBeingModified().firstElementChild.src = `./assets/images/${value}.png`
                getElemBeingModified().style.width = `${getItemBeingModified().width}px`
                renderInteractableAttributes()
            },
            Array.from([
                ...interactables.map(Int => new Int()),
                ...[...getGunDetails().keys()].map(gunName => new GunDrop(0, 0, gunName, 0, 1, 1, 1, 1, 1)),
                ...new Array(15).fill(1).map((item, index) => new KeyDrop(null, null, index + 1)),
            ]).map(item => ({ label: item.heading || item.name, value: item.name })),
            'Set the desired interactable type from the various options',
        ),
    )

    getAttributesEl().append(
        input(
            'left',
            left,
            value => {
                interactable.left = value
                getElemBeingModified().style.left = `${value}px`
            },
            null,
            null,
            null,
            null,
            'Modify the left offset of the interactable',
        ),
    )

    getAttributesEl().append(
        input(
            'top',
            top,
            value => {
                interactable.top = value
                getElemBeingModified().style.top = `${value}px`
            },
            null,
            null,
            null,
            null,
            'Modify the top offset of the interactable',
        ),
    )

    if (
        !itemsMap2.has(name) &&
        !['stick', 'note', 'lighter', 'lever', 'crate', 'armor'].includes(name) &&
        !name.includes('key') &&
        !isGun(name)
    )
        getAttributesEl().append(
            input(
                'amount',
                amount,
                value => (interactable.amount = value),
                null,
                null,
                null,
                null,
                'Set how many of the interactable should be in the pack',
            ),
        )

    if (isGun(name)) {
        getAttributesEl().append(
            input(
                'current magazine',
                interactable.currmag,
                value => (interactable.currmag = value),
                'number',
                null,
                null,
                null,
                'Set how many bullets should this weapon have at its clip',
            ),
        )

        getAttributesEl().append(
            input(
                'damage level',
                interactable.damageLvl,
                value => (interactable.damageLvl = value),
                'number',
                5,
                1,
                null,
                'Set the damage level of the current weapon. Should be numbers 1 to 5',
            ),
        )

        getAttributesEl().append(
            input(
                'range level',
                interactable.rangeLvl,
                value => (interactable.rangeLvl = value),
                'number',
                5,
                1,
                null,
                'Set the range level of the current weapon. Should be numbers 1 to 5',
            ),
        )

        getAttributesEl().append(
            input(
                'reload speed level',
                interactable.reloadspeedLvl,
                value => (interactable.reloadspeedLvl = value),
                'number',
                5,
                1,
                null,
                'Set the reload speed level of the current weapon. Should be numbers 1 to 5',
            ),
        )

        getAttributesEl().append(
            input(
                'magazine level',
                interactable.magazineLvl,
                value => (interactable.magazineLvl = value),
                'number',
                5,
                1,
                null,
                'Set the max magazine capacity level of the current weapon. Should be numbers 1 to 5',
            ),
        )

        getAttributesEl().append(
            input(
                'fire rate level',
                interactable.fireratelvl,
                value => (interactable.fireratelvl = value),
                'number',
                5,
                1,
                null,
                'Set the fire rate level of the current weapon. Should be numbers 1 to 5',
            ),
        )
    }

    if (name === 'stick')
        getAttributesEl().append(
            input(
                'health',
                interactable.health,
                value => (interactable.health = value),
                'number',
                100,
                1,
                null,
                'Set the initial health of the stick',
            ),
        )

    if (name === 'note' || name.includes('key')) {
        getAttributesEl().append(
            input(
                'heading',
                interactable.heading,
                value => (interactable.heading = value),
                'text',
                null,
                null,
                null,
                'The heading of the item that will be visible when interacting with it',
            ),
        )

        getAttributesEl().append(
            input(
                'description',
                interactable.description,
                value => (interactable.description = value),
                'text',
                null,
                null,
                null,
                'A short description of the item that will be visible when interacting with it',
            ),
        )
    }

    if (name === 'note') {
        getAttributesEl().append(
            input(
                'data',
                interactable.data,
                value => (interactable.data = value),
                'textarea',
                null,
                null,
                null,
                'Insert the data that the peace of paper will reveal to the player. If you wish to add a code in the text of the note, first set a name for the <b>code</b> property of the note, and the use <b>PLACE_CODE_HERE</b> in the note data so that the generated code will be revealed at the desired position',
            ),
        )

        getAttributesEl().append(
            input(
                'code',
                interactable.code,
                value => (interactable.code = value),
                'text',
                null,
                null,
                null,
                'The code used for some doors. This property <b>MUST</b> be equal to the door code property of the desired doors. Keep in mind, <b>PLACE_CODE_HERE MUST</b> be provided in the data',
            ),
        )
    }

    if (name.includes('key'))
        getAttributesEl().append(
            input(
                'unlocks',
                interactable.unlocks,
                value => (interactable.unlocks = value),
                'text',
                null,
                null,
                null,
                'Doors will be opened by this key if they have the same <b>key</b> property as this value',
            ),
        )

    if (!itemsMap2.has(name)) {
        getAttributesEl().append(
            input(
                'render progress',
                interactable.renderProgress,
                value => (interactable.renderProgress = String(value)),
                'number',
                null,
                null,
                null,
                'Indicates that which progress flag should be active so that this interactable will be visible to the player',
            ),
        )

        getAttributesEl().append(
            input(
                'progresses to active',
                interactable.progress2Active.join(','),
                value => (interactable.progress2Active = value.split(',')),
                'text',
                null,
                null,
                null,
                'The progress flags that will be activated if the player picks up this item. Example inputs: <b>1000</b>, <b>1000,2000,3000</b>',
            ),
        )

        getAttributesEl().append(
            input(
                'progresses to deactive',
                interactable.progress2Deactive.join(','),
                value => (interactable.progress2Deactive = value.split(',')),
                'text',
                null,
                null,
                null,
                'The progress flags that will be deactivated if the player picks up this item. Example inputs: <b>1000</b>, <b>1000,2000,3000</b>',
            ),
        )

        getAttributesEl().append(
            input(
                'kill all',
                interactable.killAll,
                value => (interactable.killAll = String(value)),
                'number',
                null,
                null,
                null,
                'Indicates that which enemies of the room with the render progress property equal or lower than this property must die so that this interactable will be visible to the player',
            ),
        )

        if (name === 'note') {
            getAttributesEl().append(
                input(
                    'on examine progress to active',
                    interactable.onexamine.join(','),
                    value => (interactable.onexamine = value.split(',')),
                    'text',
                    null,
                    null,
                    null,
                    'The progress flags that will be activated if the player examines this note. Example inputs: <b>1000</b>, <b>1000,2000,3000</b>',
                ),
            )
        }
    }

    if (
        !itemsMap2.has(name) &&
        !itemsMap3.has(name) &&
        !itemsMap4.has(name) &&
        name !== 'note' &&
        !name.includes('key')
    )
        getAttributesEl().append(difficultyAutoComplete(interactable))

    if (name === 'crate') manageLootAttribute(interactable, renderInteractableAttributes)

    getAttributesEl().append(
        deleteButton(() => {
            const currentRoomInteractables = getInteractables().get(getRoomBeingMade())
            const filteredInteractables = currentRoomInteractables.filter(
                (item, index) => index !== Number(getElemBeingModified().id.replace(`interactable-`, '')),
            )

            getInteractables().set(getRoomBeingMade(), filteredInteractables)
            getElemBeingModified().remove()
            Array.from(document.querySelectorAll('.map-maker-interactable')).forEach(item => item.remove())
            renderInteractables()
            const parent = getSelectedToolEl().parentElement
            Array.from(parent.children)
                .filter(child => !containsClass(child, 'add-item'))
                .forEach(child => child.remove())
            addInteractableContents(parent)
            if (parent.children.length === 1) parent.previousSibling.click()
            else parent.firstElementChild.click()
        }),
    )
}

const extractProgress = interactable => {
    const { renderProgress, killAll, progress2Active, progress2Deactive, onExamine } = interactable
    return Progress.builder()
        .setRenderProgress(renderProgress)
        .setKillAll(killAll)
        .setProgress2Active(progress2Active)
        .setProgress2Deactive(progress2Deactive)
        .setOnExamineProgress2Active(onExamine)
}

export const parseDifficulty = difficulties => {
    const map = new Map([
        [3, difficultyMap.MILD],
        [2, difficultyMap.MIDDLE],
        [1, difficultyMap.SURVIVAL],
    ])
    return map.get(difficulties?.length || 1)
}

const findInteractable = (name, interactable) => {
    const { left, top, amount, difficulties } = interactable

    if (itemsMap1.has(name))
        return new (itemsMap1.get(name))(
            left,
            top,
            amount,
            extractProgress(interactable),
            parseDifficulty(difficulties),
        )

    if (itemsMap2.has(name)) return new (itemsMap2.get(name))(left, top)

    if (itemsMap3.has(name)) return new (itemsMap3.get(name))(left, top, extractProgress(interactable))

    if (itemsMap4.has(name)) return new (itemsMap4.get(name))(left, top, amount, extractProgress(interactable))

    if (isGun(name))
        return new GunDrop(
            left,
            top,
            name,
            0,
            1,
            1,
            1,
            1,
            1,
            extractProgress(interactable),
            parseDifficulty(difficulties),
        )

    if (name === 'stick') return new Stick(left, top, extractProgress(interactable), 100, parseDifficulty(difficulties))

    if (name === 'note')
        return new Note(
            left,
            top,
            'heading',
            'description',
            'data PLACE_CODE_HERE',
            extractProgress(interactable),
            'dorm-code',
        )

    if (name.includes('key'))
        return new KeyDrop(
            left,
            top,
            name.replace('key-', ''),
            'heading',
            'description',
            'unlocks',
            extractProgress(interactable),
        )

    if (name === 'crate')
        return new Crate(
            left,
            top,
            new Loot(RANDOM, 1, null),
            extractProgress(interactable),
            parseDifficulty(difficulties),
        )
}
