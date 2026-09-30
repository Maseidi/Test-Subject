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
    ['tracker', Tracker],
    ['grabber', Grabber],
    ['stinger', Stinger],
    ['torturer', Torturer],
    ['scorcher', Scorcher],
    ['rock-crusher', RockCrusher],
    ['soul-drinker', SoulDrinker],
    ['campaign-boss', CampaignBoss],
])

export const buildEnemy = data => {
    const Enemy = ENEMIES_BY_TYPE.get(data.type)
    if (!Enemy) throw new Error(`Unknown enemy type: ${data.type}`)

    const enemy =
        data.type === 'tracker'
            ? new Enemy(data.level, data.x, data.y, data.virus)
            : new Enemy(data.level, data.waypoint, data.virus)

    enemy.x = data.x
    enemy.y = data.y
    enemy.spawnState = data.spawnState ?? 'pending'
    enemy.knockImmune = data.knockImmune ?? enemy.knockImmune
    enemy.healthMultiplier = data.healthMultiplier ?? 1
    enemy.health *= enemy.healthMultiplier
    if (data.health != null) enemy.health = data.health
    enemy.maxHealth = data.maxHealth ?? enemy.health
    return enemy
}
