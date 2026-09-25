import { Progress } from '../progress.js'
import { Grabber } from './type/grabber.js'
import { RockCrusher, SoulDrinker, Torturer } from './type/normal-enemy.js'
import { Ranger } from './type/ranger.js'
import { Scorcher } from './type/scorcher.js'
import { Spiker } from './type/spiker.js'
import { Stinger } from './type/stinger.js'
import { Tracker } from './type/tracker.js'
import { CampaignBoss } from './type/campaign-boss.js'

export const ENEMIES_BY_TYPE = new Map([
    ['ranger', Ranger],
    ['spiker', Spiker],
    ['grabber', Grabber],
    ['stinger', Stinger],
    ['torturer', Torturer],
    ['scorcher', Scorcher],
    ['rock-crusher', RockCrusher],
    ['soul-drinker', SoulDrinker],
    ['campaign-boss', CampaignBoss],
])

export const buildEnemy = data => {
    const { x, y, killAll, renderProgress, progress2Active, progress2Deactive, difficulties, level } = data

    const progress = Progress.builder()
        .setKillAll(killAll)
        .setRenderProgress(renderProgress)
        .setProgress2Active(progress2Active)
        .setProgress2Deactive(progress2Deactive)

    if (data.type === 'tracker') var enemy = buildTracker(data, progress)
    else {
        const { waypoint, loot, virus } = data
        var enemy = new (ENEMIES_BY_TYPE.get(data.type))(level, waypoint, loot, progress, virus)
    }

    enemy.x = x
    enemy.y = y
    enemy.knockImmune = data.knockImmune ?? false
    enemy.healthMultiplier = data.healthMultiplier ?? 1
    enemy.health *= enemy.healthMultiplier
    enemy.difficulties = difficulties
    if (data.health != null) enemy.health = data.health

    return enemy
}

const buildTracker = (data, progress) => {
    const { x, y, loot, virus, level } = data
    return new Tracker(level, x, y, loot, progress, virus)
}
