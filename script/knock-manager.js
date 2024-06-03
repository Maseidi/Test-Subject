import { getCurrentRoomSolid } from "./elements.js"

export const manageKnock = (direction, entity, knock) => directionMapper.get(direction)(entity, knock)

const handleDownKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = Array.from(getCurrentRoomSolid())
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => 
            solidBound.top + 5 > entityBound.bottom &&
            ((solidBound.left < entityBound.left && entityBound.left < solidBound.right) ||
            (solidBound.right > entityBound.right && entityBound.right > solidBound.left))
        ).sort((a,b) => a.top - b.top)[0]
    if ( !wallBound ) return knock
    const distance = wallBound.top - entityBound.bottom
    if ( distance < knock ) return distance
    else return knock
}

const handleRightKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = Array.from(getCurrentRoomSolid())
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => 
            solidBound.left + 5 > entityBound.right &&
            ((solidBound.top < entityBound.bottom && entityBound.bottom < solidBound.bottom) ||
            (solidBound.bottom > entityBound.top && entityBound.top > solidBound.top))
        ).sort((a,b) => a.left - b.left)[0]
    if ( !wallBound ) return knock
    const distance = wallBound.left - entityBound.right
    if ( distance < knock ) return distance
    else return knock
}

const handleLeftKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = Array.from(getCurrentRoomSolid())
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => 
            solidBound.right - 5 < entityBound.left &&
            ((solidBound.top < entityBound.bottom && entityBound.bottom < solidBound.bottom) ||
            (solidBound.bottom > entityBound.top && entityBound.top > solidBound.top))
        ).sort((a,b) => b.right - a.right)[0]
    if ( !wallBound ) return knock
    const distance = entityBound.left - wallBound.right
    if ( distance < knock ) return distance
    else return knock
}

const handleUpKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = Array.from(getCurrentRoomSolid())
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => 
            solidBound.bottom - 5 < entityBound.top &&
            ((solidBound.left < entityBound.left && entityBound.left < solidBound.right) ||
            (solidBound.right > entityBound.right && entityBound.right > solidBound.left))
        ).sort((a,b) => b.bottom - a.bottom)[0]
    if ( !wallBound ) return knock
    const distance = entityBound.top - wallBound.bottom
    if ( distance < knock ) return distance
    else return knock
}

const directionMapper = new Map([
    ['to-down', handleDownKnock],
    ['to-right', handleRightKnock],
    ['to-left', handleLeftKnock],
    ['to-up', handleUpKnock],
])