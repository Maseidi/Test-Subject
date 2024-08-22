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
    MAGNUM_AMMO_LOOT,
    SHOTGUN_SHELLS_LOOT,
    SingleLoot,
    SPAS } from '../../loot.js'

export const enemies = new Map([
    [37, [
        // new Torturer(1, new SquarePath(650, 240, 300), '1'),
        // new Torturer(1, new VerDoublePointPath(800, 200, 300), '2'),
        // new Torturer(1, new VerDoublePointPath(800, 100, 300), '3'),
        new Torturer(1, new SquarePath(650, 240, 300), '3', undefined, '1'),
        new SoulDrinker(1, new SinglePointPath(650, 140), '3', undefined, '2'),
        new RockCrusher(1, new SinglePointPath(850, 140), '3'),
        new Tracker(1, 1000, 140, '3', new Loot(GRENADE_LOOT, 1), '4'),
        new Tracker(1, 1000, 240, '3', new Loot(FLASHBANG_LOOT, 2), '5'),
        new Tracker(1, 1000, 340, '3', new SingleLoot(SPAS), '6'),
        new Ranger(1, new SquarePath(1000, 100, 300), '3', undefined, '7'),
        new Ranger(1, new SquarePath(1100, 100, 300), '3', undefined, '8'),
        new Ranger(1, new SquarePath(1200, 100, 300), '3', undefined, '9'),
        new Spiker(1, new SquarePath(600, 600, 100), '3', undefined, '10'),
        new Spiker(1, new SquarePath(700, 600, 100), '3', undefined, '11'),
        new Spiker(1, new SquarePath(800, 600, 100), '3', undefined, '12'),
        new Grabber(1, new VerDoublePointPath(1400, 100, 600), '3', undefined, '13'),
        new Scorcher(1, new HorDoublePointPath(1000, 700, 600), '3'),
        new Stinger(1, new Path([
            new Point(100, 100),
            new Point(500, 500),
            new Point(700, 700)
        ]), '3')
    ]]
])