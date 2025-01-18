import { Grabber } from '../enemy/type/grabber.js'
import { RockCrusher, SoulDrinker, Torturer } from '../enemy/type/normal-enemy.js'
import { Ranger } from '../enemy/type/ranger.js'
import { Scorcher } from '../enemy/type/scorcher.js'
import { Spiker } from '../enemy/type/spiker.js'
import { Stinger } from '../enemy/type/stinger.js'
import { Tracker } from '../enemy/type/tracker.js'
import { getEnemies } from '../entities.js'
import { Loot, RANDOM } from '../loot.js'
import { SinglePointPath } from '../path.js'
import { spawnEnemy } from '../room-loader.js'
import { distanceFormula } from '../util.js'
import { getPlayerX, getPlayerY, getRoomLeft, getRoomTop } from '../variables.js'
import {
    getChaos,
    getCurrentChaosEnemies,
    getCurrentChaosSpawned,
    getEnemyId,
    getSpawnCounter,
    setCurrentChaosSpawned,
    setEnemyId,
    setSpawnCounter,
} from './variables.js'

const spawnLocations = [
    { x: 100, y: 100 },
    { x: 100, y: 500 },
    { x: 100, y: 900 },
    { x: 100, y: 1300 },
    { x: 100, y: 1700 },
    { x: 500, y: 100 },
    { x: 500, y: 500 },
    { x: 500, y: 900 },
    { x: 500, y: 1300 },
    { x: 500, y: 1700 },
    { x: 900, y: 100 },
    { x: 900, y: 500 },
    { x: 900, y: 900 },
    { x: 900, y: 1300 },
    { x: 900, y: 1700 },
    { x: 1300, y: 100 },
    { x: 1300, y: 500 },
    { x: 1300, y: 900 },
    { x: 1300, y: 1300 },
    { x: 1300, y: 1700 },
    { x: 1700, y: 100 },
    { x: 1700, y: 500 },
    { x: 1700, y: 900 },
    { x: 1700, y: 1300 },
    { x: 2100, y: 100 },
    { x: 2100, y: 1300 },
    { x: 2100, y: 1700 },
    { x: 2500, y: 100 },
    { x: 2500, y: 500 },
    { x: 2500, y: 900 },
    { x: 2500, y: 1300 },
    { x: 2500, y: 1700 },
    { x: 2900, y: 100 },
    { x: 2900, y: 500 },
    { x: 2900, y: 900 },
    { x: 2900, y: 1300 },
    { x: 2900, y: 1700 },
]

export const manageSpawns = () => {
    if (getCurrentChaosSpawned() >= getCurrentChaosEnemies()) return
    if (
        getEnemies()
            .get(1)
            .filter(enemy => enemy.health !== 0).length >= 50
    )
        return

    setSpawnCounter(getSpawnCounter() + 1)
    if (getSpawnCounter() !== 60) return
    setSpawnCounter(-1)

    const playerX = getPlayerX() - getRoomLeft()
    const playerY = getPlayerY() - getRoomTop()

    const { x, y } = spawnLocations
        .filter(({ x, y }) => {
            const dist = distanceFormula(playerX, playerY, x, y)
            return dist > 1500 && dist < 2000
        })
        .sort(() => Math.random() - 0.5)[0]

    let enemy
    const chaos = getChaos()
    const level = Math.min(chaos / 10, 5)
    const chance = Math.random()

    if (chaos < 2) {
        enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else if (chaos < 4) {
        if (chance < 0.5) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else if (chaos < 7) {
        if (chance < 0.3) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.7) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else if (chaos < 11) {
        if (chance < 0.25) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.5) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.75) enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new Ranger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else if (chaos < 16) {
        if (chance < 0.2) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.4) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.6) enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.8) enemy = new Ranger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new Spiker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else if (chaos < 22) {
        if (chance < 0.18) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.36) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.54) enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.72) enemy = new Ranger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.9) enemy = new Spiker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new Tracker(level, x, y, new Loot(RANDOM, 1))
    } else if (chaos < 29) {
        if (chance < 0.14) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.28) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.42) enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.56) enemy = new Ranger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.7) enemy = new Spiker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.84) enemy = new Tracker(level, x, y, new Loot(RANDOM, 1))
        else enemy = new Grabber(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else if (chaos < 38) {
        if (chance < 0.12) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.25) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.37) enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.5) enemy = new Ranger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.62) enemy = new Spiker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.75) enemy = new Tracker(level, x, y, new Loot(RANDOM, 1))
        else if (chance < 0.87) enemy = new Grabber(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new Scorcher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    } else {
        if (chance < 0.11) enemy = new Torturer(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.22) enemy = new SoulDrinker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.33) enemy = new RockCrusher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.44) enemy = new Ranger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.55) enemy = new Spiker(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.66) enemy = new Tracker(level, x, y, new Loot(RANDOM, 1))
        else if (chance < 0.77) enemy = new Grabber(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else if (chance < 0.88) enemy = new Scorcher(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
        else enemy = new Stinger(level, new SinglePointPath(x, y), new Loot(RANDOM, 1))
    }

    enemy.index = getEnemyId()
    spawnEnemy(enemy)
    getEnemies().set(1, [...getEnemies().get(1), enemy])
    setEnemyId(getEnemyId() + 1)
    setCurrentChaosSpawned(getCurrentChaosSpawned() + 1)
}
