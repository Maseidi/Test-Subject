import { addAllAttributes, appendAll, createAndAddClass, difficulties, getDifficultyList } from '../../util.js'
import { getAttributesEl, getElemBeingModified, getMapMakerEl, setAttributesEl } from '../elements.js'
import { createHeader } from '../map-maker.js'
import { getRoomBeingMade } from '../variables.js'
import { parseDifficulty } from './interactable.js'

export const renderAttributes = () => {
    if (getAttributesEl()) getAttributesEl().remove()
    getMapMakerEl().firstElementChild.prepend(attributesSidebar())
}

export const attributesSidebar = () => {
    const attributesSidebar = createAndAddClass('div', 'attributes-sidebar')
    attributesSidebar.append(createHeader('attributes'))
    setAttributesEl(attributesSidebar)
    return attributesSidebar
}

export const input = (
    label,
    value,
    setValue,
    type = 'number',
    max = Number.MAX_SAFE_INTEGER,
    min = 0,
    step = 1,
    tooltipMsg,
) => {
    const textFieldContainer = createAndAddClass('div', 'input-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const labelContainer = createAndAddClass('div', 'label-container')
    labelContainer.append(labelEl, tooltip(tooltipMsg))
    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input')
    addAllAttributes(input, 'type', type, 'min', min, 'max', max, 'name', label, 'id', label)
    if (type === 'textarea') input.setAttribute('rows', 15)
    if (type === 'number') input.setAttribute('step', step)
    input.value = value
    input.addEventListener('change', e => {
        if (type === 'number') setValue(Number(e.target.value === '' ? min : checkLimits(e.target, min, max)))
        else setValue(e.target.value === '' ? null : e.target.value)
    })
    appendAll(textFieldContainer, labelContainer, input)
    return textFieldContainer
}

const checkLimits = (target, min, max) => {
    const value = target.value
    const innerMin = typeof min === 'function' ? min() : min
    const innerMax = typeof max === 'function' ? max() : max
    const finalValue = (() => {
        if (value < innerMin) return innerMin
        else if (value > innerMax) return innerMax
        else return value
    })()
    target.value = finalValue
    return finalValue
}

export const autocomplete = (label, value, setValue, options, tooltipMsg) => {
    const autocompleteContainer = createAndAddClass('div', 'input-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const labelContainer = createAndAddClass('div', 'label-container')
    labelContainer.append(labelEl, tooltip(tooltipMsg))
    const select = document.createElement('select')
    addAllAttributes(select, 'name', label, 'id', label)
    options.forEach(o => {
        const option = document.createElement('option')
        option.value = o.value
        option.textContent = o.label
        if (value === o.value) option.setAttribute('selected', true)
        select.append(option)
    })
    select.addEventListener('change', e => setValue(e.target.value))
    appendAll(autocompleteContainer, tooltipMsg ? labelContainer : labelEl, select)
    return autocompleteContainer
}

export const difficultyAutoComplete = model => {
    return autocomplete(
        'render difficulty',
        parseDifficulty(model.difficulties),
        value => (model.difficulties = getDifficultyList(value)),
        [
            { label: 'mild', value: difficulties.MILD },
            { label: 'middle', value: difficulties.MIDDLE },
            { label: 'survival', value: difficulties.SURVIVAL },
        ],
        'The minimum difficulty in which this entity is alowed to be visible to the player',
    )
}

export const checkbox = (label, value, setValue, tooltipMsg) => {
    const checkboxContainer = createAndAddClass('div', 'input-container')
    const labelEl = document.createElement('label')
    labelEl.textContent = label
    labelEl.setAttribute('for', label)
    const checkbox = document.createElement('input')
    addAllAttributes(checkbox, 'type', 'checkbox', 'name', label, 'id', label)
    if (value) checkbox.setAttribute('checked', true)
    checkbox.addEventListener('change', e => setValue(e.target.checked))
    const labelContainer = createAndAddClass('div', 'label-container')
    labelContainer.append(labelEl, checkbox, tooltip(tooltipMsg))
    appendAll(checkboxContainer, labelContainer)
    return checkboxContainer
}

export const updateMap = (hashMap, item2update, prefix) =>
    hashMap.set(
        getRoomBeingMade(),
        hashMap
            .get(getRoomBeingMade())
            .map((item, index) =>
                index === Number(getElemBeingModified().id.replace(`${prefix}-`, '')) ? item2update : item,
            ),
    )

export const deleteButton = onClick => {
    const deleteNodeBtn = createAndAddClass('button', 'popup-cancel')
    deleteNodeBtn.textContent = 'delete node'
    deleteNodeBtn.addEventListener('click', onClick)
    return deleteNodeBtn
}

const tooltip = message => {
    const tooltipContainer = createAndAddClass('div', 'tooltip-container')
    const question = new Image()
    question.src = './assets/images/question.png'
    const tooltip = document.createElement('div')
    tooltip.innerHTML = message
    if (message && message.includes('investigation') && message.includes('x coordinate')) tooltip.style.left = '0'
    tooltipContainer.append(question, tooltip)
    return tooltipContainer
}
