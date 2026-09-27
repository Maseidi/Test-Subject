import { getSpeedPerFrame } from './util.js'
import {
    getAimMode,
    getDownPressed,
    getLeftPressed,
    getPlayerSpeed,
    getPlayerX,
    getPlayerY,
    getRightPressed,
    getRoomLeft,
    getRoomTop,
    getSprint,
    getUpPressed,
} from './variables.js'

export const getPlayerVelocityPerFrame = () => {
    let x = Number(getRightPressed()) - Number(getLeftPressed())
    let y = Number(getDownPressed()) - Number(getUpPressed())
    if (x && y) {
        x /= Math.SQRT2
        y /= Math.SQRT2
    }
    const speed = getSpeedPerFrame(getPlayerSpeed() * (getSprint() ? 2 : 1) * (getAimMode() ? 1 / 3 : 1))
    return { x: x * speed, y: y * speed }
}

export const getPlayerCenterInRoom = () => ({
    x: getPlayerX() - getRoomLeft() + 17,
    y: getPlayerY() - getRoomTop() + 17,
})

export const getPredictedShot = (sourceX, sourceY, pixelsPerFrame) => {
    const target = getPlayerCenterInRoom()
    const velocity = getPlayerVelocityPerFrame()
    const relativeX = target.x - sourceX
    const relativeY = target.y - sourceY
    const a = velocity.x ** 2 + velocity.y ** 2 - pixelsPerFrame ** 2
    const b = 2 * (relativeX * velocity.x + relativeY * velocity.y)
    const c = relativeX ** 2 + relativeY ** 2
    const discriminant = b ** 2 - 4 * a * c
    let time = Math.hypot(relativeX, relativeY) / pixelsPerFrame
    if (discriminant >= 0 && Math.abs(a) > 0.0001) {
        const root = Math.sqrt(discriminant)
        const candidates = [(-b - root) / (2 * a), (-b + root) / (2 * a)].filter(value => value > 0)
        if (candidates.length) time = Math.min(...candidates)
    }
    time = Math.min(time, 120)
    const destinationX = target.x + velocity.x * time
    const destinationY = target.y + velocity.y * time
    const dx = destinationX - sourceX
    const dy = destinationY - sourceY
    const length = Math.hypot(dx, dy) || 1
    return {
        destinationX,
        destinationY,
        speedX: (dx / length) * pixelsPerFrame,
        speedY: (dy / length) * pixelsPerFrame,
    }
}
