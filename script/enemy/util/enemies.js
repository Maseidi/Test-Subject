import { Ranger } from '../type/ranger.js'
import { Spiker } from '../type/spiker.js'
import { Grabber } from '../type/grabber.js'
import { Progress } from '../../progress.js'
import { Stinger } from '../type/stinger.js'
import { Tracker } from '../type/tracker.js'
import { Scorcher } from '../type/scorcher.js'
import { HorDoublePointPath, Path, Point, SinglePointPath, SquarePath, VerDoublePointPath } from '../../path.js'
import { 
    FLASHBANG_LOOT,
    GRENADE_LOOT,
    HEALTH_POTION,
    Loot,
    SingleLoot,
    SPAS } from '../../loot.js'

export const enemies = new Map([
    [37, [
        new Tracker(1, 1000, 140, new Loot(GRENADE_LOOT, 1), Progress.builder().setRenderProgress('2').setProgress2Active('3')),
        new Tracker(1, 1000, 240, new Loot(FLASHBANG_LOOT, 2), Progress.builder().setRenderProgress('3').setProgress2Active('4')),
        new Tracker(1, 1000, 340, new SingleLoot(SPAS, '5'), Progress.builder().setRenderProgress('4')),
        new Ranger(1, new SquarePath(1000, 100, 300), new SingleLoot(HEALTH_POTION), Progress.builder().setKillAll('4').setProgress2Active('6')),
        new Ranger(1, new SquarePath(1100, 100, 300), undefined, Progress.builder().setRenderProgress('5')),
        new Ranger(1, new SquarePath(1200, 100, 300), undefined, Progress.builder().setRenderProgress('6')),
        new Spiker(1, new SquarePath(600, 600, 100), undefined, Progress.builder().setKillAll('6').setProgress2Active('7')),
        new Spiker(1, new SquarePath(700, 600, 100), undefined, Progress.builder().setRenderProgress('8')),
        new Spiker(1, new SquarePath(800, 600, 100), undefined, Progress.builder().setRenderProgress('8')),
        new Grabber(1, new VerDoublePointPath(1400, 100, 600), undefined, Progress.builder().setRenderProgress('9')),
        new Stinger(1, new Path([new Point(100, 100), new Point(500, 500), new Point(700, 700)]), undefined, 
            Progress.builder().setRenderProgress('10')
        ),
        new Stinger(1, new SinglePointPath(100, 100), undefined, Progress.builder().setRenderProgress('11'))
    ]]
])