import { Ranger } from '../type/ranger.js'
import { Spiker } from '../type/spiker.js'
import { Tracker } from '../type/tracker.js'
import { Grabber } from '../type/grabber.js'
import { Stinger } from '../type/stinger.js'
import { Scorcher } from '../type/scorcher.js'
import { RockCrusher, SoulDrinker, Torturer } from '../type/normal-enemy.js'
import { HorDoublePointPath, Path, Point, SinglePointPath, SquarePath, VerDoublePointPath } from '../../path.js'
import { 
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    Loot,
    RIFLE_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT,
    SingleLoot,
    SNIPER2,
    SPAS } from '../../loot.js'

export const enemies = new Map([
    [37, [
        // new Torturer(1, new SquarePath(650, 240, 300), '2', undefined, '0'),
        // new SoulDrinker(1, new SinglePointPath(650, 140), '2', undefined, '1'),
        // new RockCrusher(1, new SinglePointPath(850, 140), '3'),
        new Tracker(1, 1000, 140, '2', new Loot(GRENADE_LOOT, 1), '3'),
        new Tracker(1, 1000, 240, '3', new Loot(FLASHBANG_LOOT, 2), '4'),
        new Tracker(1, 1000, 340, '4', new SingleLoot(SPAS), '5'),
        new Ranger(1, new SquarePath(1000, 100, 300), '5', undefined, '6'),
        new Ranger(1, new SquarePath(1100, 100, 300), '6', undefined, '7'),
        new Ranger(1, new SquarePath(1200, 100, 300), '7', undefined, '8'),
        new Spiker(1, new SquarePath(600, 600, 100), '8', undefined, '9'),
        new Spiker(1, new SquarePath(700, 600, 100), '9', undefined, '10'),
        new Spiker(1, new SquarePath(800, 600, 100), '10', undefined, '11'),
        new Grabber(1, new VerDoublePointPath(1400, 100, 600), '11', undefined, '12'),
        new Scorcher(1, new HorDoublePointPath(1000, 700, 600), '12', undefined, '13'),
        new Stinger(1, new Path([
            new Point(100, 100),
            new Point(500, 500),
            new Point(700, 700)
        ]), '13', undefined, '14')
    ]],
    [16, [
        new Scorcher(2, new SinglePointPath(100, 100), '16', new SingleLoot(SNIPER2)),
        new Stinger(2, new SinglePointPath(400, 400), '19', new Loot(RIFLE_AMMO_LOOT, 20, '20')),
        new Torturer(2, new SinglePointPath(400, 400), '20', new Loot(SHOTGUN_SHELLS_LOOT, 10)),
        new RockCrusher(2, new SinglePointPath(500, 400), '21')
    ]]
])