import { loaders } from './loaders.js'
import { managePause } from './controls.js'
import { openDoor } from './progress-manager.js'
import { getPauseContainer } from './elements.js'
import { quitPage, renderQuit } from './user-interface.js'
import { createAndAddClass, getProperty } from './util.js'
import { getCurrentRoomId, getIntObj, setPauseCause } from './variables.js'

const passwords = new Map([
    ['main-hall', Math.floor(Math.random() * 99900) + 100],
    ['silver-gate', Math.floor(Math.random() * 99900) + 100],
])

export const getPasswords = () => new Map(passwords)

export const renderPasswordInput = () => {
    const code = getIntObj().getAttribute('code')
    const value = getIntObj().getAttribute('value')
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
    const doorValue = getIntObj().getAttribute('value')
    let newValue = ""
    for ( let i = 0; i < doorValue.length; i++ )
        newValue += ( i === digit ? bar.children[5].textContent : doorValue.charAt(i) ) 
    getIntObj().setAttribute('value', newValue)
    const loaderElem = getIntObj().nextSibling
    const loaderClass = Number(loaderElem.classList[0])
    const loaderObj = loaders.get(getCurrentRoomId()).find(loader => loader.className === loaderClass)
    loaderObj.door.value = newValue
}

const renderCheckBtn = () => {
    const button = createAndAddClass('button', 'check-password-btn')
    button.textContent = 'check'
    button.addEventListener('click', () => {
        const targetValue = passwords.get(getIntObj().getAttribute('code'))
        const valueMap = Array.from(button.previousSibling.children)
            .map(elem => elem.firstElementChild.firstElementChild.children[5].textContent)
        const value2check = Number(valueMap.join(""))
        if ( targetValue !== value2check ) return
        quitPage()
        openDoor(getIntObj()) 
    })
    return button
}