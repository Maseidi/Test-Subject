import { createHeader } from '../map-maker.js'
import { appendAll, createAndAddClass } from '../../util.js'
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

export const textField = (label, value, setValue, type = 'number', max = Number.MAX_SAFE_INTEGER) => {
    const textFieldContainer = createAndAddClass('div', 'text-field-container')
    const labelEl = document.createElement('p')
    labelEl.textContent = label
    const input = document.createElement('input')
    input.setAttribute('type', type)
    input.setAttribute('min', 0)
    input.setAttribute('max', max)
    input.value = value
    input.addEventListener('change', (e) => setValue(e.target.value))
    appendAll(textFieldContainer, labelEl, input)
    return textFieldContainer
}