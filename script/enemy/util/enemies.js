import { Spiker } from '../type/spiker.js'
import { Ranger } from '../type/ranger.js'
import { Progress } from '../../progress.js'
import { Grabber } from '../type/grabber.js'
import { Stinger } from '../type/stinger.js'
import { Tracker } from '../type/tracker.js'
import { Scorcher } from '../type/scorcher.js'
import { Path, Point, RectPath, SinglePointPath, VerDoublePointPath } from '../../path.js'
import { BLUE_VACCINE, GREEN_VACCINE, KeyLoot, Loot, NoteLoot, PURPLE_VACCINE, RANDOM, RED_VACCINE, YELLOW_VACCINE } from '../../loot.js'
import { RockCrusher, SoulDrinker, Torturer } from '../type/normal-enemy.js'

export const enemies = new Map([
    [1, []],
    [2, [
        new Torturer(1, new RectPath(350, 150, 300, 100))
    ]],
    [3, [
        new Torturer(1, new RectPath(100, 100, 200, 800), null, Progress.builder().setRenderProgress('2000'), 'red'),
        new Torturer(1, new RectPath(700, 100, 200, 800), null, Progress.builder().setRenderProgress('2000'), 'red'),
    ]],
    [4, [
        new Torturer(1, new Path([
            new Point(675, 100), new Point(675, 350), new Point(75, 350), new Point(75, 100)
        ]), null, 
            Progress.builder().setRenderProgress('3000'), 'blue'
        ),
        new Torturer(1, new Path([
            new Point(75, 450), new Point(75, 650), new Point(675, 650), new Point(675, 450)
        ]), null, 
            Progress.builder().setRenderProgress('3000'), 'purple'
        ),
    ]],
    [5, [
        new Torturer(1, new Path([
            new Point(350, 275), new Point(150, 275)
        ]), null, 
            Progress.builder().setRenderProgress('4000'), 'green'
        ),
        new Torturer(1, new Path([
            new Point(425, 275), new Point(675, 275)
        ]), null, 
            Progress.builder().setRenderProgress('4000'), 'yellow'
        ),
    ]],
    [6, [
        new Torturer(1, new SinglePointPath(150, 500), null, Progress.builder().setRenderProgress('5000'), 'red'),
        new Torturer(1, new SinglePointPath(550, 500), null, Progress.builder().setRenderProgress('5000'), 'green'),
        new Torturer(1, new SinglePointPath(950, 500), null, Progress.builder().setRenderProgress('5000'), 'yellow'),
        new Torturer(1, new SinglePointPath(1350, 500), null, Progress.builder().setRenderProgress('5000'), 'blue'),
        new Torturer(1, new SinglePointPath(1750, 500), null, Progress.builder().setRenderProgress('5000'), 'purple'),
    ]],
    [7, [
        new Torturer(1, new VerDoublePointPath(300, 100, 400), new Loot(YELLOW_VACCINE, 2), 
            Progress.builder().setRenderProgress('6000'), 'purple'
        ),
        new Torturer(1, new VerDoublePointPath(300, 500, 400), new Loot(BLUE_VACCINE, 2), 
            Progress.builder().setRenderProgress('6000'), 'yellow'
        ),
        new Torturer(1, new VerDoublePointPath(1000, 100, 400), new Loot(GREEN_VACCINE, 2), 
            Progress.builder().setRenderProgress('6000'), 'blue'
        ),
        new Torturer(1, new VerDoublePointPath(1700, 100, 400), new Loot(RED_VACCINE, 2), 
            Progress.builder().setRenderProgress('6000'), 'green'
        ),
        new Torturer(1, new VerDoublePointPath(1700, 500, 400), new Loot(PURPLE_VACCINE, 2), 
            Progress.builder().setRenderProgress('6000'), 'red'
        ),
    ]]
])