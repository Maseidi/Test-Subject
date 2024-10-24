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
    const textFieldContainer = createAndAddClass('div', 'text-field-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const input = document.createElement('input')
    addAllAttributes(input, 'type', type, 'min', min, 'max', max, 'name', label, 'id', label)
    input.value = value
    input.addEventListener('change', (e) => setValue(e.target.value))
    appendAll(textFieldContainer, labelEl, input)
    return textFieldContainer
}