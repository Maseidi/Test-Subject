import { getDownPressed, getLeftPressed, getRightPressed, getUpPressed } from "./variables.js"

export const collide = (first, second, offset) => {
    const firstBound = first.getBoundingClientRect()
    const secondBound = second.getBoundingClientRect()
    return firstBound.bottom > secondBound.top - offset &&
        firstBound.right > secondBound.left - offset &&
        firstBound.top < secondBound.bottom + offset &&
        firstBound.left < secondBound.right + offset
}

export const angleOfTwoPoints = (x1, y1, x2, y2) => {
    let sign2 = x1 > x2 ? 1 : -1
    let sign1 = y1 > y2 ? sign2 : -sign2
    return angleFormula(sign1, sign2, x1, y1, x2, y2)
}

const angleFormula = (s1, s2, x1, y1, x2, y2) => {
    let x3 = x1
    let y3 = y2
    let AB = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)  //AB = sqrt((Ax - Bx)^2 + (Ay - By)^2)
    let CB = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2)  //CB = sqrt((Cx - Bx)^2 + (Cy - By)^2)
    let AC = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2)  //AC = sqrt((Ax - Cx)^2 + (Ay - Cy)^2)

    //A^C = arccos((AB^2 + CB^2 - AC^2) / (2 * AB * CB))
    return (s1 * Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI + s2 * 90 
}

export const addClass = (elem, className) => {
    if ( !containsClass(elem, className) ) elem.classList.add(className)
}

export const removeClass = (elem, className) => {
    if ( containsClass(elem, className) ) elem.classList.remove(className)
}

export const containsClass = (elem, className) => {
    return elem.classList.contains(className)
}

export const isMoving = () => {
    return getUpPressed() || getDownPressed() || getLeftPressed() || getRightPressed()
}

export const addAttribute = (elem, name, value) => {
    const attr = document.createAttribute(name)
    attr.value = value
    elem.setAttributeNode(attr)
}

export const addToArray = (getter, setter, value) => {
    let copyArr = getter()
    copyArr.push(value)
    setter(copyArr)
}

export const putToMap = (getter, setter, key, value) => {
    let copyMap = getter()
    copyMap.set(key, value)
    setter(copyMap)
}

export const isNullOrUndefined = (input) => input === null || input === undefined

export const objectToElement = (obj) => {
    if ( isNullOrUndefined(obj) ) return document.createElement('div')
    const props = Object.getOwnPropertyNames(obj)
    const elem = document.createElement('div')
    for ( const prop of props )
         if ( !isNullOrUndefined(obj[prop]) ) addAttribute(elem, prop, obj[prop])
    return elem     
}

export const elementToObject = (elem) => {
    const attrs = elem.attributes
    let obj = {}
    for (const attr of attrs) {
        const name = attr.name
        const attrValue = elem.getAttribute(name)
        if ( name === 'style' || name === 'class' ) continue
        obj = {
            ...obj,
            [name] : isNaN(Number(attrValue)) ? (
                attrValue === "true" ? true : (
                    attrValue === "false" ? false : (
                        attrValue
                    )
                )
            ) : Number(attrValue)
        }
    }
    return obj
}