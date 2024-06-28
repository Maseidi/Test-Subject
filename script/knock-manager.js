import { getCurrentRoomLoaders, getCurrentRoomSolid } from './elements.js'

export const manageKnock = (direction, entity, knock) => directionMapper.get(direction)(entity, knock)

const handleDownKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getCurrentRoomSolid(), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.top + 5 > entityBound.bottom && horizontalPredicate(solidBound, entityBound))
        .sort((a,b) => a.top - b.top)[0]
    if ( !wallBound ) return knock
    const distance = wallBound.top - entityBound.bottom
    if ( distance < knock ) return distance
    else return knock
}

const handleRightKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getCurrentRoomSolid(), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.left + 5 > entityBound.right && verticalPredicate(solidBound, entityBound))
        .sort((a,b) => a.left - b.left)[0]
    if ( !wallBound ) return knock
    const distance = wallBound.left - entityBound.right
    if ( distance < knock ) return distance
    else return knock
}

const handleLeftKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getCurrentRoomSolid(), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.right - 5 < entityBound.left && verticalPredicate(solidBound, entityBound))
        .sort((a,b) => b.right - a.right)[0]
    if ( !wallBound ) return knock
    const distance = entityBound.left - wallBound.right
    if ( distance < knock ) return distance
    else return knock
}

const handleUpKnock = (entity, knock) => {
    const entityBound = entity.getBoundingClientRect()
    const wallBound = [...getCurrentRoomSolid(), ...getCurrentRoomLoaders()]
        .map(solid => solid.getBoundingClientRect())
        .filter(solidBound => solidBound.bottom - 5 < entityBound.top && horizontalPredicate(solidBound, entityBound))
        .sort((a,b) => b.bottom - a.bottom)[0]
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

const verticalPredicate = (a, b) => 
    ((a.top < b.bottom && b.bottom < a.bottom) || (a.bottom > b.top && b.top > a.top)) ||
    ((a.top > b.top && b.bottom > a.top) || (a.bottom < b.bottom && b.top < a.bottom))

const horizontalPredicate = (a, b) =>
    ((a.left < b.left && b.left < a.right) || (a.right > b.right && b.right > a.left)) || 
    ((a.left > b.left && b.right > a.left) || (a.right < b.right && b.left < a.right))