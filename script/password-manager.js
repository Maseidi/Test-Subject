import { managePause } from './actions.js'
import { getDoorObject } from './loader.js'
import { getPauseContainer } from './elements.js'
import { toggleDoor } from './progress-manager.js'
import { quitPage, renderQuit } from './user-interface.js'
import { createAndAddClass, getProperty } from './util.js'
import { getElementInteractedWith, setPauseCause } from './variables.js'

const passwordNames = [
    'library-entrance'
]

let passwords = new Map([])
export const setPasswords = (val) => {
    passwords = val
}
export const getPasswords = () => passwords

export const initPasswords = () => 
    passwordNames.forEach(name => passwords.set(name, Math.floor(Math.random() * 99900) + 100))

export const renderPasswordInput = () => {
    const code = getElementInteractedWith().getAttribute('code')
    if ( !passwords.get(code) ) return
    const value = getElementInteractedWith().getAttribute('value')
    const digits = passwords.get(code).toString().length
    managePause()
    setPauseCause('password')
    const passWrapper = createAndAddClass('div', 'password-wrapper', 'ui-theme')
    const passContainer = createAndAddClass('div', 'password-container')
    for ( let i = 0; i < digits; i++ ) {
        const currentDigit = Number(value.charAt(i))
        const digitContainer = createAndAddClass('div', 'digit-container')
        const digitBarContainer = createAndAddClass('div', 'digit-bar-container')
        const digitBar = createAndAddClass('div', 'digit-bar')        
        digitBar.style.top = `-500px`
        const before = calculateBefore(currentDigit)
        const after = calculateAfter(currentDigit)
        for ( let j = 0; j < 10; j++ ) {
            const digitBarItem = createAndAddClass('div', 'digit-bar-item')
            digitBarItem.textContent = j < 5 ? before[j] : j > 5 ? after[j - 6] : currentDigit
            digitBar.append(digitBarItem)
        }
        digitBarContainer.append(digitBar)
        digitContainer.append(digitBarContainer, renderIncreaseBtn(i, digitBar), renderDecreaseBtn(i, digitBar))
        passContainer.append(digitContainer)
    }
    passWrapper.append(passContainer, renderCheckBtn())
    getPauseContainer().append(passWrapper)
    renderQuit()
}

const calculateBefore = (end) => {
    let limiter = end - 1
    const result = []
    for ( let j = 0; j < 5; j++ ) {
        if ( limiter === -1 ) limiter = 9
        result.push(limiter)
        limiter = limiter - 1
    }
    return result.reverse()
}

const calculateAfter = (start) => {
    let limiter = start + 1
    const result = []
    for ( let j = 0; j < 4; j++ ) {
        if ( limiter === 10 ) limiter = 0
        result.push(limiter)
        limiter = limiter + 1
    }
    return result
}

const renderIncreaseBtn = (digit, bar) => {
    const increase = createAndAddClass('div', 'increase-digit')
    const increaseIcon = document.createElement('img')
    increaseIcon.src = `/assets/images/chev-up.png`
    increase.append(increaseIcon)
    increase.digit = digit
    increase.bar = bar
    increase.addEventListener('click', increaseDigit)
    return increase
}

let allowIncrease = true
const increaseDigit = (e) => {
    if ( !allowIncrease || !allowDecrease ) return
    const { digit, bar } = e.currentTarget
    const currTop = getProperty(bar, 'top', 'px')
    allowIncrease = false
    bar.animate([
        {top: currTop + 'px'},
        {top: (currTop + 100) + 'px'}
    ], {
        duration: 500,
    }).addEventListener('finish', () => {
        const last = bar.lastElementChild
        const newItem = last.cloneNode()
        newItem.textContent = last.textContent
        bar.insertBefore(newItem, bar.firstElementChild)
        last.remove()
        updateDoorCodeValue(digit, bar)
        allowIncrease = true
    })
}

const renderDecreaseBtn = (digit, bar) => {
    const decrease = createAndAddClass('div', 'decrease-digit')
    const decreaseIcon = document.createElement('img')
    decreaseIcon.src = `/assets/images/chev-down.png`
    decrease.append(decreaseIcon)
    decrease.digit = digit
    decrease.bar = bar
    decrease.addEventListener('click', decreaseDigit)
    return decrease
}

let allowDecrease = true
const decreaseDigit = (e) => {
    if ( !allowDecrease || !allowIncrease ) return
    const { digit, bar } = e.currentTarget
    const currTop = getProperty(bar, 'top', 'px')
    allowDecrease = false
    bar.animate([
        {top: currTop + 'px'},
        {top: (currTop - 100) + 'px'}
    ], {
        duration: 500,
    }).addEventListener('finish', () => {
        const first = bar.firstElementChild
        const newItem = first.cloneNode()
        newItem.textContent = first.textContent
        bar.append(newItem)
        first.remove()
        updateDoorCodeValue(digit, bar)
        allowDecrease = true
    })
}

const updateDoorCodeValue = (digit, bar) => {
    const doorValue = getElementInteractedWith().getAttribute('value')
    let newValue = ""
    for ( let i = 0; i < doorValue.length; i++ )
        newValue += ( i === digit ? bar.children[5].textContent : doorValue.charAt(i) ) 
    getElementInteractedWith().setAttribute('value', newValue)
    const doorObj = getDoorObject(getElementInteractedWith())
    doorObj.value = newValue
}

const renderCheckBtn = () => {
    const button = createAndAddClass('button', 'check-password-btn')
    button.textContent = 'check'
    button.addEventListener('click', () => {
        const targetValue = passwords.get(getElementInteractedWith().getAttribute('code'))
        const valueMap = Array.from(button.previousSibling.children)
            .map(elem => elem.firstElementChild.firstElementChild.children[5].textContent)
        const value2check = Number(valueMap.join(""))
        if ( targetValue !== value2check ) return
        quitPage()
        toggleDoor(getElementInteractedWith()) 
    })
    return button
}