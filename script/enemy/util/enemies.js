import { Ranger } from '../type/ranger.js'
import { Spiker } from '../type/spiker.js'
import { Grabber } from '../type/grabber.js'
import { Progress } from '../../progress.js'
import { Stinger } from '../type/stinger.js'
import { Tracker } from '../type/tracker.js'
import { Scorcher } from '../type/scorcher.js'
import { RockCrusher, Torturer } from '../type/normal-enemy.js'
import { Path, Point, SinglePointPath, SquarePath, VerDoublePointPath } from '../../path.js'
import { 
    ENERGY_DRINK,
    HEALTH_POTION,
    SingleLoot } from '../../loot.js'

export const enemies = new Map([
    [1, []],
    [2, []],
    [9, []],
    [16, [
        new Torturer(1, new SinglePointPath(400, 400), undefined, Progress.builder().setRenderProgress('100')),
        new RockCrusher(1, new SinglePointPath(500, 400), undefined, Progress.builder().setRenderProgress('400')),
        new Stinger(1, new SinglePointPath(600, 400), undefined, Progress.builder().setRenderProgress('1000')),
        new Scorcher(1, new SinglePointPath(600, 100), undefined, Progress.builder().setRenderProgress('0'), 'purple')
    ]],
    [37, [
        new Tracker(1, 1000, 140, new SingleLoot(HEALTH_POTION), 
            Progress.builder().setRenderProgress('2').setProgress2Active('3')
        ),
        new Tracker(1, 1000, 240, new SingleLoot(HEALTH_POTION), 
            Progress.builder().setRenderProgress('3').setProgress2Active('4')
        ),
        new Tracker(1, 1000, 340, new SingleLoot(ENERGY_DRINK, '5'), 
            Progress.builder().setRenderProgress('4')
        ),
        new Ranger(1, new SquarePath(1000, 100, 300), new SingleLoot(HEALTH_POTION), 
            Progress.builder().setKillAll('4').setProgress2Active('6')
        ),
        new Ranger(1, new SquarePath(1100, 100, 300), new SingleLoot(ENERGY_DRINK), 
            Progress.builder().setRenderProgress('5')
        ),
        new Ranger(1, new SquarePath(1200, 100, 300), new SingleLoot(ENERGY_DRINK), 
            Progress.builder().setRenderProgress('6')
        ),
        new Spiker(1, new SquarePath(600, 600, 100), undefined, 
            Progress.builder().setKillAll('6').setProgress2Active('7')
        ),
        new Spiker(1, new SquarePath(700, 600, 100), undefined, 
            Progress.builder().setRenderProgress('8')
        ),
        new Spiker(1, new SquarePath(800, 600, 100), undefined, 
            Progress.builder().setRenderProgress('8')
        ),
        new Grabber(1, new VerDoublePointPath(1400, 100, 600), undefined, 
            Progress.builder().setRenderProgress('9')
        ),
        new Scorcher(1, new Path([new Point(100, 100), new Point(500, 500), new Point(700, 700)]), undefined, 
            Progress.builder().setRenderProgress('10')
        ),
        new Stinger(1, new SinglePointPath(100, 100), undefined, 
            Progress.builder().setRenderProgress('11')
        )
    ]]
])