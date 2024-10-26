import { createHeader } from '../map-maker.js'
import { GunDrop } from '../../interactables.js'
import { getRoomBeingMade } from '../variables.js'
import { getGunDetails, isGun } from '../../gun-details.js'
import { Loot, NoteLoot, RANDOM, SingleLoot } from '../../loot.js'
import { itemsMap1, itemsMap4, parseDifficulty } from './interactable.js'
import { getAttributesEl, getElemBeingModified, getMapMakerEl, setAttributesEl } from '../elements.js'
import { addAllAttributes, appendAll, createAndAddClass, decideDifficulty, difficulties } from '../../util.js'

export const renderAttributes = () => {
    if ( getAttributesEl() ) getAttributesEl().remove()
    getMapMakerEl().firstElementChild.prepend(attributesSidebar())
}

const attributesSidebar = () => {
    const attributesSidebar = createAndAddClass('div', 'attributes-sidebar')
    attributesSidebar.append(createHeader('attributes'))
    setAttributesEl(attributesSidebar)
    return attributesSidebar
}

export const textField = (label, value, setValue, type = 'number', max = Number.MAX_SAFE_INTEGER, min = 0) => {
    const textFieldContainer = createAndAddClass('div', 'input-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input')
    addAllAttributes(input, 'type', type, 'min', min, 'max', max, 'name', label, 'id', label)
    if ( type === 'textarea' ) input.setAttribute('rows', 15)
    input.value = value
    input.addEventListener('change', (e) => {
        if ( type === 'number' ) setValue(Number(e.target.value === '' ? min : checkLimits(e.target, min, max)))
        else setValue(e.target.value === '' ? null : e.target.value)
    })
    appendAll(textFieldContainer, labelEl, input)
    return textFieldContainer
}


const checkLimits = (target, min, max) => {
    const value = target.value
    const finalValue = (() => {
        if ( value < min ) return min
        else if ( value > max ) return max
        else return value
    })()
    target.value = finalValue
    return finalValue
}

export const autocomplete = (label, value, setValue, options) => {
    const autocompleteContainer = createAndAddClass('div', 'input-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const select = document.createElement('select')
    addAllAttributes(select, 'name', label, 'id', label)
    options.forEach(o => {
        const option = document.createElement('option')
        option.value = o.value
        option.textContent = o.label
        if ( value === o.value ) option.setAttribute('selected', true)
        select.append(option)
    })
    select.addEventListener('change', (e) => setValue(e.target.value))
    appendAll(autocompleteContainer, labelEl, select)
    return autocompleteContainer
}

export const difficultyAutoComplete = (instance) => {
    return autocomplete('render difficulty', parseDifficulty(instance.difficulties), 
        (value) => instance.difficulties = decideDifficulty(value), 
        [
            {label: 'mild',     value: difficulties.MILD},
            {label: 'middle',   value: difficulties.MIDDLE},
            {label: 'survival', value: difficulties.SURVIVAL}
        ]
    )
}

export const checkbox = (label, value, setValue) => {
    const checkboxContainer = createAndAddClass('div', 'checkbox-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const checkbox = document.createElement('input')
    addAllAttributes(checkbox, 'type', 'checkbox', 'name', label, 'id', label)
    if ( value ) checkbox.setAttribute('checked', true)
    checkbox.addEventListener('change', (e) => setValue(e.target.checked))
    appendAll(checkboxContainer, labelEl, checkbox)
    return checkboxContainer
}

export const updateMap = (hashMap, item2update, prefix) => 
    hashMap.set(
        getRoomBeingMade(), 
        hashMap.get(getRoomBeingMade())
        .map((item, index) => index === Number(getElemBeingModified().id.replace(`${prefix}-`, '')) ? item : item2update)
    )

export const handleLoot = (instance, reRenderCallback) => {
    getAttributesEl().append(
        checkbox('has loot', instance['loot-name'], (value) => {
            instance['loot-data'] = null
            instance['loot-code'] = null
            instance['loot-active'] = null
            instance['loot-heading'] = null
            instance['loot-deactive'] = null
            instance['loot-description'] = null
            if ( value ) {
                instance['loot-name'] = RANDOM
                instance['loot-amount'] = 1
            }
            else {
                instance['loot-name'] = null
                instance['loot-amount'] = null
            }
            reRenderCallback()
        })
    )
    
    if ( instance['loot-name'] ) {
        getAttributesEl().append(
            autocomplete('name', instance['loot-name'], (value) => {
                let loot = findLoot(value, instance)
                if ( !loot ) return
                instance['loot-name'] = loot.name
                instance['loot-amount'] = loot.amount
                instance['loot-active'] = loot.progress2Active
                instance['loot-deactive'] = loot.progress2Deactive
                if ( value === 'note' ) {
                    instance['loot-data'] = loot.data
                    instance['loot-code'] = loot.code
                    instance['loot-heading'] = loot.heading
                    instance['loot-description'] = loot.description
                } else {
                    instance['loot-data'] = null
                    instance['loot-code'] = null
                    instance['loot-heading'] = null
                    instance['loot-description'] = null
                }
                reRenderCallback()
            }, Array.from([
                {heading: 'random', name: 'random'},
                {heading: 'note', name: 'note'},
                ...[...itemsMap1.values()].map(Int => new Int()),
                ...[...getGunDetails().keys()].map(gunName => new GunDrop(0, 0, gunName, 0, 1, 1, 1, 1, 1)),
            ]).map(item => ({label: item.heading || item.name, value: item.name})))
        )

        if ( !isGun(instance['loot-name']) && instance['loot-name'] !== 'note' ) {
            getAttributesEl().append(
                textField('loot amount', instance['loot-amount'], 
                    (value) => instance['loot-amount'] = value, 'number', Number.MAX_SAFE_INTEGER, 1)
            )
        }

        if ( instance['loot-name'] === 'note' ) {
            getAttributesEl().append(
                textField('loot heading', instance['loot-heading'], 
                    (value) => instance['loot-heading'] = value, 'text')
            )
    
            getAttributesEl().append(
                textField('loot description', instance['loot-description'], 
                    (value) => instance['loot-description'] = value, 'text')
            )
    
            getAttributesEl().append(
                textField('loot data', instance['loot-data'], 
                    (value) => instance['loot-data'] = value, 'textarea')
            )

            getAttributesEl().append(
                textField('loot code', instance['loot-code'], 
                    (value) => instance['loot-code'] = value, 'text')
            )
        }

        getAttributesEl().append(
            textField('loot progress to active', instance['loot-active'], 
                (value) => instance['loot-active'] = value, 'number')
        )

        getAttributesEl().append(
            textField('loot progress to deactive', instance['loot-deactive'], 
                (value) => instance['loot-deactive'] = value, 'number')
        )
    }
}   

const findLoot = (name, src) => {
    const { 'loot-amount': amount, 'loot-active': progress2Active, 'loot-deactive': progress2Deactive } = src
    const progress = {progress2Active, progress2Deactive}

    if ( itemsMap1.has(name) || itemsMap4.has(name) || name.includes('ammo') || name === 'random' )
        return new Loot(name, amount, progress)

    if ( isGun(name) ) return new SingleLoot(name, progress)

    if ( name === 'note' ) return new NoteLoot('heading', 'description', 'data PLACE_CODE_HERE', 'dorm-code', progress)

}