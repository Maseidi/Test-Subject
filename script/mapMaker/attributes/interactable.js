import { Progress } from '../../progress.js'
import { getGunDetails, isGun } from '../../gun-details.js'
import { Loot, NoteLoot, RANDOM, SingleLoot } from '../../loot.js'
import { getAttributesEl, getElemBeingModified } from '../elements.js'
import { decideDifficulty, difficulties as difficultyMap } from '../../util.js'
import { autocomplete, checkbox, renderAttributes, textField } from './shared.js'
import { getInteractables, getItemBeingModified, getRoomBeingMade, setItemBeingModified } from '../variables.js'
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

const itemsMap1 = new Map([
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

const itemsMap4 = new Map([
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
            getInteractables().set(
                getRoomBeingMade(), 
                getInteractables().get(getRoomBeingMade())
                .map((int, index) => 
                    index === Number(getElemBeingModified().id.replace('interactable-', '')) ? newInteractable : int
                )
            )
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
        textField('left', left, (value) => {
            interactable.left = value
            getElemBeingModified().style.left = `${value}px`
        })
    )

    getAttributesEl().append(
        textField('top', top, (value) => {
            interactable.top = value
            getElemBeingModified().style.top = `${value}px`
        })
    )

    if ( !itemsMap2.has(name) && !['stick', 'note', 'lighter', 'lever', 'crate', 'armor'].includes(name) && 
         !name.includes('key') && !isGun(name) ) 
        getAttributesEl().append(
            textField('amount', amount, (value) => interactable.amount = value)
        )

    if ( isGun(name) ) {
        getAttributesEl().append(
            textField('current magazine', interactable.currmag, (value) => interactable.currmag = value)
        )

        getAttributesEl().append(
            textField('damage level', interactable.damageLvl, (value) => interactable.damageLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            textField('range level', interactable.rangeLvl, (value) => interactable.rangeLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            textField('reload speed level', interactable.reloadspeedLvl, 
                (value) => interactable.reloadspeedLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            textField('magazine level', interactable.magazineLvl, 
                (value) => interactable.magazineLvl = value, 'number', 5, 1)
        )

        getAttributesEl().append(
            textField('fire rate level', interactable.fireratelvl, 
                (value) => interactable.fireratelvl = value, 'number', 5, 1)
        )
    }

    if ( name === 'stick' )
        getAttributesEl().append(
            textField('health', interactable.health, 
                (value) => interactable.health = value, 'number', 100, 1)
        )

    if ( name === 'note' || name.includes('key') ) {
        getAttributesEl().append(
            textField('heading', interactable.heading, 
                (value) => interactable.heading = value, 'text')
        )

        getAttributesEl().append(
            textField('description', interactable.description, 
                (value) => interactable.description = value, 'text')
        )
    }

    if ( name === 'note' ) {
        getAttributesEl().append(
            textField('heading', interactable.heading, 
                (value) => interactable.heading = value, 'text')
        )

        getAttributesEl().append(
            textField('description', interactable.description, 
                (value) => interactable.description = value, 'text')
        )

        getAttributesEl().append(
            textField('data', interactable.data, 
                (value) => interactable.data = value, 'textarea')
        )

        getAttributesEl().append(
            textField('code', interactable.code, 
                (value) => interactable.code = value, 'text')
        )
    }

    if ( name.includes('key') )
        getAttributesEl().append(
            textField('unlocks', interactable.unlocks, 
                (value) => interactable.unlocks = value, 'text')
        )
    
    if ( !itemsMap2.has(name) ) {
        getAttributesEl().append(
            textField('render progress', interactable.renderProgress, 
                (value) => interactable.renderProgress = value, 'number')
        )

        getAttributesEl().append(
            textField('progresses to active', interactable.progress2Active.join(','), 
                (value) => interactable.progress2Active = value.split(','), 'text')
        )

        getAttributesEl().append(
            textField('progresses to deactive', interactable.progress2Deactive.join(','), 
                (value) => interactable.progress2Deactive = value.split(','), 'text')
        )

        getAttributesEl().append(
            textField('kill all', interactable.killAll, 
                (value) => interactable.killAll = value, 'number')
        )

        if ( name === 'note' ) {
            getAttributesEl().append(
                textField('on examine progress to active', interactable.onexamine.join(','), 
                    (value) => interactable.onexamine.split(',') = value, 'text')
            )
        }
    }

    if ( !itemsMap2.has(name) && !itemsMap3.has(name) && !itemsMap4.has(name) && name !== 'note' && !name.includes('key') ) {
        getAttributesEl().append(
            autocomplete('render difficulty', parseDifficulty(interactable.difficulties), 
                (value) => interactable.difficulties = decideDifficulty(value), 
                [
                    {label: 'mild',     value: difficultyMap.MILD},
                    {label: 'middle',   value: difficultyMap.MIDDLE},
                    {label: 'survival', value: difficultyMap.SURVIVAL}
                ]
            )
        )
    }

    if ( name === 'crate' ) {
        getAttributesEl().append(
            checkbox('has loot', interactable['loot-name'], (value) => {
                interactable['loot-data'] = null
                interactable['loot-code'] = null
                interactable['loot-active'] = null
                interactable['loot-heading'] = null
                interactable['loot-deactive'] = null
                interactable['loot-description'] = null
                if ( value ) {
                    interactable['loot-name'] = RANDOM
                    interactable['loot-amount'] = 1
                }
                else {
                    interactable['loot-name'] = null
                    interactable['loot-amount'] = null
                }
                renderInteractableAttributes()
            })
        )
        
        if ( interactable['loot-name'] ) {
            getAttributesEl().append(
                autocomplete('name', interactable['loot-name'], (value) => {
                    let loot = findLoot(value, interactable)
                    if ( !loot ) return
                    interactable['loot-name'] = loot.name
                    interactable['loot-amount'] = loot.amount
                    interactable['loot-active'] = loot.progress2Active
                    interactable['loot-deactive'] = loot.progress2Deactive
                    if ( value === 'note' ) {
                        interactable['loot-data'] = loot.data
                        interactable['loot-code'] = loot.code
                        interactable['loot-heading'] = loot.heading
                        interactable['loot-description'] = loot.description
                    } else {
                        interactable['loot-data'] = null
                        interactable['loot-code'] = null
                        interactable['loot-heading'] = null
                        interactable['loot-description'] = null
                    }
                    renderInteractableAttributes()
                }, Array.from([
                    {heading: 'random', name: 'random'},
                    {heading: 'note', name: 'note'},
                    ...[...itemsMap1.values()].map(Int => new Int()),
                    ...[...getGunDetails().keys()].map(gunName => new GunDrop(0, 0, gunName, 0, 1, 1, 1, 1, 1)),
                ]).map(item => ({label: item.heading || item.name, value: item.name})))
            )

            if ( !isGun(interactable['loot-name']) && name !== 'note' ) {
                getAttributesEl().append(
                    textField('loot amount', interactable['loot-amount'], 
                        (value) => interactable['loot-amount'] = value, 'number', Number.MAX_SAFE_INTEGER, 1)
                )
            }

            if ( interactable['loot-name'] === 'note' ) {
                getAttributesEl().append(
                    textField('loot heading', interactable['loot-heading'], 
                        (value) => interactable['loot-heading'] = value, 'text')
                )
        
                getAttributesEl().append(
                    textField('loot description', interactable['loot-description'], 
                        (value) => interactable['loot-description'] = value, 'text')
                )
        
                getAttributesEl().append(
                    textField('loot data', interactable['loot-data'], 
                        (value) => interactable['loot-data'] = value, 'textarea')
                )
    
                getAttributesEl().append(
                    textField('loot code', interactable['loot-code'], 
                        (value) => interactable['loot-code'] = value, 'text')
                )
            }

            getAttributesEl().append(
                textField('loot progress to active', interactable['loot-active'], 
                    (value) => interactable['loot-active'] = value, 'number')
            )

            getAttributesEl().append(
                textField('loot progress to deactive', interactable['loot-deactive'], 
                    (value) => interactable['loot-deactive'] = value, 'number')
            )
        }
    }

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

const parseDifficulty = (difficulties) => {
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

const findLoot = (name, crate) => {
    const { 'loot-amount': amount, 'loot-active': progress2Active, 'loot-deactive': progress2Deactive } = crate
    const progress = {progress2Active, progress2Deactive}

    if ( itemsMap1.has(name) || itemsMap4.has(name) || name.includes('ammo') )
        return new Loot(name, amount, progress)

    if ( name === 'random' ) 
        return new Loot(name, amount, progress)

    if ( isGun(name) )
        return new SingleLoot(name, progress)

    if ( name === 'note' ) 
        return new NoteLoot('heading', 'description', 'data PLACE_CODE_HERE', 'dorm-code', progress)

}