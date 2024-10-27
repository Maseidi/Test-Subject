import { GunDrop } from '../../interactables.js'
import { getAttributesEl } from '../elements.js'
import { itemsMap1, itemsMap4 } from './interactable.js'
import { getGunDetails, isGun } from '../../gun-details.js'
import { autocomplete, checkbox, textField } from './shared.js'
import { KeyLoot, Loot, NoteLoot, RANDOM, SingleLoot } from '../../loot.js'

export const manageLootAttribute = (model, reRenderCallback, canHaveKeyAsLoot = false) => {
    const { 'loot-name': name, 'loot-amount': amount, 'loot-active': active, 'loot-deactive': deactive } = model    
    getAttributesEl().append(
        checkbox('has loot', name, (value) => {
            resetAllLootValues(model)
            if ( value ) {
                model['loot-amount'] = 1
                model['loot-name'] = RANDOM
            }
            reRenderCallback()
        })
    )

    if ( model['loot-name'] ) {
        getAttributesEl().append(
            autocomplete('name', name.includes('key') ? 'key' : name, (value) => {
                let loot = findLoot(value, model)
                if ( !loot ) return
                resetAllLootValues(model)
                model['loot-name'] = loot.name
                model['loot-amount'] = loot.amount
                model['loot-active'] = loot.progress2Active
                model['loot-deactive'] = loot.progress2Deactive
                if ( value === 'note' ) {
                    model['note-data'] = loot.data
                    model['note-code'] = loot.code
                    model['note-heading'] = loot.heading
                    model['note-description'] = loot.description
                } else if ( value === 'key' ) {
                    model['key-code'] = loot.code
                    model['key-heading'] = loot.heading
                    model['key-unlocks'] = loot.unlocks
                    model['key-description'] = loot.description
                }
                reRenderCallback()
            }, Array.from([
                {heading: 'random', name: 'random'},
                {heading: 'note', name: 'note'},
                ...[...itemsMap1.values()].map(Int => new Int()),
                ...[...getGunDetails().keys()].map(gunName => new GunDrop(0, 0, gunName, 0, 1, 1, 1, 1, 1)),
                ...(canHaveKeyAsLoot ? [{heading: 'key', name: 'key'}] : [])
            ]).map(item => ({label: item.heading || item.name, value: item.name})))
        )

        if ( !isGun(name) && name !== 'note' && name !== 'key' ) {
            getAttributesEl().append(
                textField('loot amount', amount, 
                    (value) => model['loot-amount'] = value, 'number', Number.MAX_SAFE_INTEGER, 1)
            )
        }

        if ( name === 'note' ) {
            const { 'note-heading': heading, 'note-description': description, 'note-data': data, 'note-code': code } = model
            getAttributesEl().append(
                textField('note heading', heading, (value) => model['note-heading'] = value, 'text')
            )
    
            getAttributesEl().append(
                textField('note description', description, (value) => model['note-description'] = value, 'text')
            )
    
            getAttributesEl().append(
                textField('note data', data, (value) => model['note-data'] = value, 'textarea')
            )

            getAttributesEl().append(
                textField('note code', code, (value) => model['note-code'] = value, 'text')
            )
        }        

        if ( name.includes('key') ) {
            const { 'key-heading': heading, 'key-description': description, 'key-unlocks': unlocks, 'key-code': code } = model
            getAttributesEl().append(
                textField('key heading', heading, (value) => model['key-heading'] = value, 'text')
            )
    
            getAttributesEl().append(
                textField('key description', description, (value) => model['key-description'] = value, 'text')
            )
    
            getAttributesEl().append(
                textField('key unlocks', unlocks, (value) => model['key-unlocks'] = value, 'textarea')
            )

            getAttributesEl().append(
                textField('key code', code, (value) => {
                    model['key-code'] = value
                    model['loot-name'] = `key-${value}`
                }, 'number', 15, 1)
            )
        }

        getAttributesEl().append(
            textField('loot progress to active', active, (value) => model['loot-active'] = value, 'number')
        )

        getAttributesEl().append(
            textField('loot progress to deactive', deactive, (value) => model['loot-deactive'] = value, 'number')
        )
    }
}

const resetAllLootValues = (model) => {
    resetKeyLootValues(model)
    resetNoteLootValues(model)
    model['loot-name'] = null
    model['loot-amount'] = null
    model['loot-active'] = null
    model['loot-deactive'] = null
}

const resetKeyLootValues = (model) => {
    model['key-code'] = null
    model['key-heading'] = null
    model['key-unlocks'] = null
    model['key-description'] = null
}

const resetNoteLootValues = (model) => {
    model['note-data'] = null
    model['note-code'] = null
    model['note-heading'] = null
    model['note-description'] = null
}

const findLoot = (name, src) => {
    const { 'loot-amount': amount, 'loot-active': progress2Active, 'loot-deactive': progress2Deactive } = src
    const progress = {progress2Active, progress2Deactive}

    if ( itemsMap1.has(name) || itemsMap4.has(name) || name.includes('ammo') || name === 'random' )
        return new Loot(name, amount, progress)

    if ( isGun(name) ) return new SingleLoot(name, progress)

    if ( name === 'note' ) return new NoteLoot('heading', 'description', 'data PLACE_CODE_HERE', 'dorm-code', progress)

    if ( name === 'key' ) return new KeyLoot('heading', 'description', 1, 'unlocks', progress)
}