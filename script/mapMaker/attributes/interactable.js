import { Progress } from '../../progress.js'
import { Loot, RANDOM } from '../../loot.js'
import { manageLootAttribute } from './loot.js'
import { getGunDetails, isGun } from '../../gun-details.js'
import { containsClass, difficulties as difficultyMap } from '../../util.js'
import { addInteractableContents, renderInteractables } from '../map-maker.js'
import { getAttributesEl, getElemBeingModified, getSelectedToolEl } from '../elements.js'
import { getInteractables, getItemBeingModified, getRoomBeingMade, setItemBeingModified } from '../variables.js'
import { autocomplete, difficultyAutoComplete, renderAttributes, input, updateMap, deleteButton } from './shared.js'
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
    YellowVaccine } from '../../interactables.js'

const interactables = [
    Coin,          HardDrive,   PistolAmmo,     ShotgunShells,  MagnumAmmo, SmgAmmo,      RifleAmmo, 
    Antidote,      Grenade,     Flashbang,      Stick,          Lighter,    Adrenaline,   HealthPotion, 
    PC,            Stash,       VendingMachine, Speaker,        Crate,      Lever,        Bandage, 
    LuckPills,     EnergyDrink, BodyArmor,      Note,           RedVaccine, GreenVaccine, PurpleVaccine,
    YellowVaccine, BlueVaccine
]

export const itemsMap1 = new Map([
    ['purplevaccine', PurpleVaccine], 
    ['smgAmmo', SmgAmmo],             ['coin', Coin],                   ['antidote', Antidote],
    ['bandage', Bandage],             ['rifleAmmo', RifleAmmo],         ['hardDrive', HardDrive], 
    ['grenade', Grenade],             ['flashbang', Flashbang],         ['redvaccine', RedVaccine],
    ['pistolAmmo', PistolAmmo],       ['shotgunShells', ShotgunShells], ['magnumAmmo', MagnumAmmo],
    ['greenvaccine', GreenVaccine],   ['yellowvaccine', YellowVaccine], ['bluevaccine', BlueVaccine],
])

const itemsMap2 = new Map([
    ['computer', PC], ['stash', Stash], ['vendingMachine', VendingMachine], ['speaker', Speaker]
])

const itemsMap3 = new Map([
    ['armor', BodyArmor], ['lever', Lever], ['lighter', Lighter]
])

export const itemsMap4 = new Map([
    ['adrenaline', Adrenaline], ['luckpills', LuckPills], ['healthpotion', HealthPotion], ['energydrink', EnergyDrink]
])

export const renderInteractableAttributes = () => {
    const interactable = getItemBeingModified()
    const { name, left, top, amount } = interactable
    renderAttributes()

    getAttributesEl().append(
        autocomplete('type', name, (value) => {
            let newInteractable = findInteractable(value, interactable)
            if ( !newInteractable ) return
            setItemBeingModified(newInteractable)
            updateMap(getInteractables(), newInteractable, 'interactable')
            getElemBeingModified().firstElementChild.src = `./assets/images/${value}.png`
            getElemBeingModified().style.width =           `${getItemBeingModified().width}px`
            renderInteractableAttributes()
        }, Array.from([
            ...interactables.map(Int => new Int()),
            ...[...getGunDetails().keys()].map(gunName => new GunDrop(0, 0, gunName, 0, 1, 1, 1, 1, 1)),
            ...new Array(15).fill(1).map((item, index) => new KeyDrop(null, null, index + 1))
        ]).map(item => ({label: item.heading || item.name, value: item.name})))
    )

    getAttributesEl().append(
        input('left', left, (value) => {
            interactable.left = value
            getElemBeingModified().style.left = `${value}px`
        })
    )

    getAttributesEl().append(
        input('top', top, (value) => {
            interactable.top = value
            getElemBeingModified().style.top = `${value}px`
        })
    )

    if ( !itemsMap2.has(name) && !['stick', 'note', 'lighter', 'lever', 'crate', 'armor'].includes(name) && 
         !name.includes('key') && !isGun(name) ) 
        getAttributesEl().append(
            input('amount', amount, (value) => interactable.amount = value)
        )

    if ( isGun(name) ) {
        getAttributesEl().append(
            input('current magazine', interactable.currmag, (value) => interactable.currmag = value)
        )

        getAttributesEl().append(
            input('damage level', interactable.damageLvl, (value) => interactable.damageLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            input('range level', interactable.rangeLvl, (value) => interactable.rangeLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            input('reload speed level', interactable.reloadspeedLvl, 
                (value) => interactable.reloadspeedLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            input('magazine level', interactable.magazineLvl, 
                (value) => interactable.magazineLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            input('fire rate level', interactable.fireratelvl, 
                (value) => interactable.fireratelvl = value, 'number', 5, 1)
        )
    }

    if ( name === 'stick' )
        getAttributesEl().append(
            input('health', interactable.health, 
                (value) => interactable.health = value, 'number', 100, 1)
        )

    if ( name === 'note' || name.includes('key') ) {
        getAttributesEl().append(
            input('heading', interactable.heading, 
                (value) => interactable.heading = value, 'text')
        )

        getAttributesEl().append(
            input('description', interactable.description, 
                (value) => interactable.description = value, 'text')
        )
    }

    if ( name === 'note' ) {
        getAttributesEl().append(
            input('data', interactable.data, 
                (value) => interactable.data = value, 'textarea')
        )

        getAttributesEl().append(
            input('code', interactable.code, 
                (value) => interactable.code = value, 'text')
        )
    }

    if ( name.includes('key') )
        getAttributesEl().append(
            input('unlocks', interactable.unlocks, 
                (value) => interactable.unlocks = value, 'text')
        )
    
    if ( !itemsMap2.has(name) ) {
        getAttributesEl().append(
            input('render progress', interactable.renderProgress, 
                (value) => interactable.renderProgress = value, 'number')
        )

        getAttributesEl().append(
            input('progresses to active', interactable.progress2Active.join(','), 
                (value) => interactable.progress2Active = value.split(','), 'text')
        )

        getAttributesEl().append(
            input('progresses to deactive', interactable.progress2Deactive.join(','), 
                (value) => interactable.progress2Deactive = value.split(','), 'text')
        )

        getAttributesEl().append(
            input('kill all', interactable.killAll, 
                (value) => interactable.killAll = value, 'number')
        )

        if ( name === 'note' ) {
            getAttributesEl().append(
                input('on examine progress to active', interactable.onexamine.join(','), 
                    (value) => interactable.onexamine = value.split(','), 'text')
            )
        }
    }

    if ( !itemsMap2.has(name) && !itemsMap3.has(name) && !itemsMap4.has(name) && name !== 'note' && !name.includes('key') )
        getAttributesEl().append(difficultyAutoComplete(interactable))

    if ( name === 'crate' ) manageLootAttribute(interactable, renderInteractableAttributes)

    getAttributesEl().append(
        deleteButton(() => {
            const currentRoomInteractables = getInteractables().get(getRoomBeingMade())
            const filteredInteractables = 
                currentRoomInteractables
                .filter((item, index) => index !== Number(getElemBeingModified().id.replace(`interactable-`, '')))

            getInteractables().set(getRoomBeingMade(), filteredInteractables)
            getElemBeingModified().remove()
            Array.from(document.querySelectorAll('.map-maker-interactable')).forEach(item => item.remove())
            renderInteractables()
            const parent = getSelectedToolEl().parentElement 
            Array.from(parent.children).filter(child => !containsClass(child, 'add-item')).forEach(child => child.remove())
            addInteractableContents(parent)
            if ( parent.children.length === 1 ) parent.previousSibling.click()
            else parent.firstElementChild.click()
        })
    )

}

const extractProgress = (interactable) => {
    const { renderProgress, killAll, progress2Active, progress2Deactive, onExamine } = interactable
    return Progress.builder()
        .setRenderProgress(renderProgress)
        .setKillAll(killAll)
        .setProgress2Active(progress2Active)
        .setProgress2Deactive(progress2Deactive)
        .setOnExamineProgress2Active(onExamine)
}

export const parseDifficulty = (difficulties) => {
    const map = new Map([
        [3, difficultyMap.MILD],
        [2, difficultyMap.MIDDLE],
        [1, difficultyMap.SURVIVAL],
    ])
    return map.get(difficulties?.length || 1)
}

const findInteractable = (name, interactable) => {
    const { left, top, amount, difficulties } = interactable

    if ( itemsMap1.has(name) ) 
        return new (itemsMap1.get(name))(
            left, 
            top, 
            amount, 
            extractProgress(interactable), 
            parseDifficulty(difficulties)
        )

    if ( itemsMap2.has(name) )
        return new (itemsMap2.get(name))(left, top)

    if ( itemsMap3.has(name) )
        return new (itemsMap3.get(name))(left, top, extractProgress(interactable))

    if ( itemsMap4.has(name) )
        return new (itemsMap4.get(name))(left, top, amount, extractProgress(interactable))

    if ( isGun(name) )
        return new GunDrop(left, top, name, 0, 1, 1, 1, 1, 1, extractProgress(interactable), parseDifficulty(difficulties))
    
    if ( name === 'stick' )
        return new Stick(left, top, extractProgress(interactable), 100, parseDifficulty(difficulties))

    if ( name === 'note' )
        return new Note(left, top, 'heading', 'description', 'data PLACE_CODE_HERE', extractProgress(interactable), 'dorm-code')

    if ( name.includes('key') )
        return new KeyDrop(left, top, name.replace('key-', ''), 'heading', 'description', 'unlocks', extractProgress(interactable))

    if ( name === 'crate' )
        return new Crate(left, top, new Loot(RANDOM, 1, null), 
            extractProgress(interactable), parseDifficulty(difficulties)) 
}