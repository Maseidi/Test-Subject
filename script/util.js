export const collide = (first, second, offset) => {
    const firstBound = first.getBoundingClientRect()
    const secondBound = second.getBoundingClientRect()
    return firstBound.bottom > secondBound.top - offset &&
        firstBound.right > secondBound.left - offset &&
        firstBound.top < secondBound.bottom + offset &&
        firstBound.left < secondBound.right + offset
}

export const angleOfTwoPoints = (x1, y1, x2, y2) => {
    let x3 = x1
    let y3 = y2
    //AB = sqrt((Ax - Bx)^2 + (Ay - By)^2)
    let AB = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    //CB = sqrt((Cx - Bx)^2 + (Cy - By)^2)
    let CB = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2)
    let AC = Math.sqrt((x1 - x3) ** 2 + (y1 - y3) ** 2)
    //A^C = arccos((AB^2 + CB^2 - AC^2) / (2 * AB * CB))
    let result
    if (x1 < x2 && y1 < y2)
        result = (Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI - 90
    else if (x1 < x2 && y1 > y2)
        result = (-Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI - 90
    else if (x1 > x2 && y1 < y2)
        result = (-Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI + 90
    else if (x1 > x2 && y1 > y2) 
        result = (Math.acos((AB ** 2 + CB ** 2 - AC ** 2) / (2 * AB * CB)) * 180) / Math.PI + 90
    return result;
}

export const addClass = (elem, className) => {
    if ( !elem.classList.contains(className) ) elem.classList.add(className)
}

export const removeClass = (elem, className) => {
    if ( elem.classList.contains(className) ) elem.classList.remove(className)
}