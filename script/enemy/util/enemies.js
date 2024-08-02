import { Ranger } from '../type/ranger.js'
import { Spiker } from '../type/spiker.js'
import { Tracker } from '../type/tracker.js'
import { Grabber } from '../type/grabber.js'
import { Scorcher } from '../type/scorcher.js'
import { RockCrusher, SoulDrinker, Torturer } from '../type/normal-enemy.js'
import { HorDoublePointPath, Path, Point, SinglePointPath, SquarePath, VerDoublePointPath } from '../../path.js'
import { Stinger } from '../type/stinger.js'

export const enemies = new Map([
    [37, [
        // new Torturer(1, new SquarePath(650, 240, 300), '1'),
        // new Torturer(1, new VerDoublePointPath(800, 100, 300), '2'),
        // new Torturer(1, new SquarePath(650, 240, 300), '3'),
        // new SoulDrinker(1, new SinglePointPath(650, 140), '3'),
        // new RockCrusher(1, new SinglePointPath(850, 140), '3'),
        // new Tracker(1, 1000, 140, '3'),
        // new Tracker(1, 1000, 240, '3'),
        // new Tracker(1, 1000, 340, '3'),
        // new Ranger(1, new SquarePath(1000, 100, 300), '3'),
        // new Ranger(1, new SquarePath(1100, 100, 300), '3'),
        // new Ranger(1, new SquarePath(1200, 100, 300), '3'),
        // new Spiker(1, new SquarePath(600, 600, 100), '3'),
        // new Spiker(1, new SquarePath(700, 600, 100), '3'),
        // new Spiker(1, new SquarePath(800, 600, 100), '3'),
        // new Grabber(1, new VerDoublePointPath(1400, 100, 600), '3'),
        // new Scorcher(1, new HorDoublePointPath(1000, 700, 600), '3'),
        new Stinger(1, new Path([
            new Point(100, 100),
            new Point(500, 500),
            new Point(700, 700)
        ]), '3')
    ]]
])