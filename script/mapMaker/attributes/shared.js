import { createHeader } from '../map-maker.js'
import { addAllAttributes, appendAll, createAndAddClass } from '../../util.js'
import { getAttributesEl, getMapMakerEl, setAttributesEl } from '../elements.js'

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
        if ( type === 'number' ) setValue(Number(e.target.value === '' ? min : checkLimits(e.target.value, min, max)))
        else setValue(e.target.value === '' ? null : e.target.value)
    })
    appendAll(textFieldContainer, labelEl, input)
    return textFieldContainer
}


const checkLimits = (value, min, max) => {
    if ( value < min ) return min
    else if ( value > max ) return max
    else return value
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