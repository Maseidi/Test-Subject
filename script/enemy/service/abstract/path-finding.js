import { getCurrentRoomSolid } from '../../../elements.js'
import { getRooms } from '../../../entities.js'
import { containsClass, getProperty } from '../../../util.js'
import { getCurrentRoomId } from '../../../variables.js'

const wallRect = (wall, padding = 0) => ({
    left: getProperty(wall, 'left', 'px') - padding,
    top: getProperty(wall, 'top', 'px') - padding,
    right: getProperty(wall, 'left', 'px') + getProperty(wall, 'width', 'px') + padding,
    bottom: getProperty(wall, 'top', 'px') + getProperty(wall, 'height', 'px') + padding,
    wall,
})

const segmentHitsRect = (x1, y1, x2, y2, rect) => {
    const dx = x2 - x1
    const dy = y2 - y1
    let near = 0
    let far = 1
    for (const [start, delta, min, max] of [
        [x1, dx, rect.left, rect.right],
        [y1, dy, rect.top, rect.bottom],
    ]) {
        if (delta === 0) {
            if (start < min || start > max) return false
            continue
        }
        const first = (min - start) / delta
        const second = (max - start) / delta
        near = Math.max(near, Math.min(first, second))
        far = Math.min(far, Math.max(first, second))
        if (near > far) return false
    }
    return far >= 0 && near <= 1
}

const navigationWalls = () =>
    getCurrentRoomSolid().filter(
        solid => containsClass(solid, 'wall') || (containsClass(solid, 'door') && !containsClass(solid, 'open')),
    )

const rectanglesOverlap = (first, second) =>
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top

export const findBlockingWall = (x1, y1, x2, y2, padding = 4) =>
    navigationWalls()
        .map(wall => wallRect(wall, padding))
        .filter(rect => segmentHitsRect(x1, y1, x2, y2, rect))
        .sort((a, b) => {
            const distanceTo = rect =>
                Math.hypot(
                    Math.max(rect.left - x1, 0, x1 - rect.right),
                    Math.max(rect.top - y1, 0, y1 - rect.bottom),
                )
            return distanceTo(a) - distanceTo(b)
        })[0]?.wall ?? null

export const hasLineOfSight = (x1, y1, x2, y2, padding = 4) =>
    !findBlockingWall(x1, y1, x2, y2, padding)

export const isEnemyPositionBlocked = (x, y, width, height, padding = 1) => {
    const candidate = {
        left: x - padding,
        top: y - padding,
        right: x + width + padding,
        bottom: y + height + padding,
    }
    return navigationWalls().some(wall => rectanglesOverlap(candidate, wallRect(wall)))
}

export class AbstractPathFindingService {
    constructor(enemy) {
        this.enemy = enemy
    }

    findPath() {
        const width = getProperty(this.enemy.sprite, 'width', 'px') || this.enemy.sprite.offsetWidth || 40
        const height = getProperty(this.enemy.sprite, 'height', 'px') || this.enemy.sprite.offsetHeight || width
        const radius = Math.max(width, height) / 2
        const collisionPadding = Math.max(2, radius - 4)
        const enemyCenterX = this.enemy.x + width / 2
        const enemyCenterY = this.enemy.y + height / 2
        const destinationX = this.enemy.destX + (this.enemy.destWidth ?? 0) / 2
        const destinationY = this.enemy.destY + (this.enemy.destWidth ?? 0) / 2
        const blockingWall = findBlockingWall(
            enemyCenterX,
            enemyCenterY,
            destinationX,
            destinationY,
            collisionPadding,
        )

        if (!blockingWall) {
            this.clearPath()
            return
        }

        if (this.hasReachableWaypoint(enemyCenterX, enemyCenterY, width, height, collisionPadding)) return

        const room = getRooms().get(getCurrentRoomId())
        const clearance = radius + 16
        const rect = wallRect(blockingWall, clearance)
        const candidates = [
            { x: rect.left, y: rect.top },
            { x: rect.right, y: rect.top },
            { x: rect.left, y: rect.bottom },
            { x: rect.right, y: rect.bottom },
        ]
            .map(point => ({
                centerX: Math.max(radius + 8, Math.min(room.width - radius - 8, point.x)),
                centerY: Math.max(radius + 8, Math.min(room.height - radius - 8, point.y)),
            }))
            .map(point => ({
                ...point,
                x: point.centerX - width / 2,
                y: point.centerY - height / 2,
            }))
            .filter(point => !isEnemyPositionBlocked(point.x, point.y, width, height, 2))
            .filter(point =>
                hasLineOfSight(
                    enemyCenterX,
                    enemyCenterY,
                    point.centerX,
                    point.centerY,
                    collisionPadding,
                ),
            )
            .sort(
                (a, b) =>
                    this.routeScore(a, enemyCenterX, enemyCenterY, destinationX, destinationY, collisionPadding) -
                    this.routeScore(b, enemyCenterX, enemyCenterY, destinationX, destinationY, collisionPadding),
            )

        const waypoint = candidates[0]
        if (!waypoint) {
            this.clearPath()
            return
        }
        this.enemy.pathFindingX = waypoint.x
        this.enemy.pathFindingY = waypoint.y
    }

    hasReachableWaypoint(enemyCenterX, enemyCenterY, width, height, collisionPadding) {
        if (!Number.isFinite(this.enemy.pathFindingX) || !Number.isFinite(this.enemy.pathFindingY)) return false
        const waypointX = this.enemy.pathFindingX + width / 2
        const waypointY = this.enemy.pathFindingY + height / 2
        if (Math.hypot(waypointX - enemyCenterX, waypointY - enemyCenterY) <= 8) {
            this.clearPath()
            return false
        }
        if (isEnemyPositionBlocked(this.enemy.pathFindingX, this.enemy.pathFindingY, width, height, 2)) {
            this.clearPath()
            return false
        }
        return hasLineOfSight(
            enemyCenterX,
            enemyCenterY,
            waypointX,
            waypointY,
            collisionPadding,
        )
    }

    routeScore(point, enemyX, enemyY, destinationX, destinationY, collisionPadding) {
        const firstLeg = Math.hypot(point.centerX - enemyX, point.centerY - enemyY)
        const secondLeg = Math.hypot(destinationX - point.centerX, destinationY - point.centerY)
        const anotherWall = findBlockingWall(
            point.centerX,
            point.centerY,
            destinationX,
            destinationY,
            collisionPadding,
        )
        return firstLeg + secondLeg + (anotherWall ? 1000 : 0)
    }

    clearPath() {
        this.enemy.pathFindingX = null
        this.enemy.pathFindingY = null
    }
}
