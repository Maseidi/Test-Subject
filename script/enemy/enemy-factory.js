import { Ranger } from './type/ranger.js'
import { Spiker } from './type/spiker.js'
import { Progress } from '../progress.js'
import { Tracker } from './type/tracker.js'
import { Stinger } from './type/stinger.js'
import { Grabber } from './type/grabber.js'
import { Scorcher } from './type/scorcher.js'
import { RockCrusher, SoulDrinker, Torturer } from './type/normal-enemy.js'

export const ENEMIES_BY_TYPE = new Map([
    ['ranger', Ranger],
    ['spiker', Spiker],
    ['grabber', Grabber],
    ['stinger', Stinger],
    ['torturer', Torturer],
    ['scorcher', Scorcher],
    ['rock-crusher', RockCrusher],
    ['soul-drinker', SoulDrinker],
])

export const buildEnemy = (data) => {
    const { x, y, health, killAll, renderProgress, progress2Active, progress2Deactive, difficulties, damage } = data

    const progress = Progress.builder()
        .setKillAll(killAll)
        .setRenderProgress(renderProgress)
        .setProgress2Active(progress2Active)
        .setProgress2Deactive(progress2Deactive)
        
    if ( data.type === 'tracker' ) var enemy = buildTracker(data, progress)
    else {
        const { waypoint, loot, virus } = data
        var enemy = new (ENEMIES_BY_TYPE.get(data.type))(null, waypoint, loot, progress, virus)
    }

    enemy.x = x
    enemy.y = y
    enemy.health = health
    enemy.damage = damage
    enemy.difficulties = difficulties

    return enemy
}

const buildTracker = (data, progress) => {
    const { x, y, loot, virus } = data
    return new Tracker(null, x, y, loot, progress, virus)
}