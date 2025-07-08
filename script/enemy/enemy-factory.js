import { Progress } from '../progress.js'
import { Grabber } from './type/grabber.js'
import { RockCrusher, SoulDrinker, Torturer } from './type/normal-enemy.js'
import { Ranger } from './type/ranger.js'
import { Scorcher } from './type/scorcher.js'
import { Spiker } from './type/spiker.js'
import { Stinger } from './type/stinger.js'

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

export const buildEnemy = data => {
    const { x, y, killAll, renderProgress, progress2Active, progress2Deactive, difficulties, level } = data

    const progress = Progress.builder()
        .setKillAll(killAll)
        .setRenderProgress(renderProgress)
        .setProgress2Active(progress2Active)
        .setProgress2Deactive(progress2Deactive)

    const { waypoint, loot, virus } = data
    var enemy = new (ENEMIES_BY_TYPE.get(data.type))(level, waypoint, loot, progress, virus)

    enemy.x = x
    enemy.y = y
    enemy.difficulties = difficulties
    if (data.health === 0) enemy.health = 0

    return enemy
}
