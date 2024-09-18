import { Spiker } from '../type/spiker.js'
import { Ranger } from '../type/ranger.js'
import { Progress } from '../../progress.js'
import { Grabber } from '../type/grabber.js'
import { Stinger } from '../type/stinger.js'
import { Tracker } from '../type/tracker.js'
import { Scorcher } from '../type/scorcher.js'
import { SinglePointPath } from '../../path.js'
import { KeyLoot, Loot, NoteLoot, RANDOM } from '../../loot.js'
import { RockCrusher, SoulDrinker, Torturer } from '../type/normal-enemy.js'

export const enemies = new Map([
    [1, []],
    [2, []],
    [9, []],
    [16, [
        new Stinger(
            1,
            new SinglePointPath(100, 100),
            new Loot(RANDOM, 2),
            Progress.builder().setProgress2Active('100')
        ),
        new SoulDrinker(
            1,
            new SinglePointPath(300, 100),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('1').setProgress2Active('2')
        ),
        new RockCrusher(
            1,
            new SinglePointPath(500, 100),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('2').setProgress2Active('3')
        ),
        new Tracker(
            1,
            700,
            100,
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('3').setProgress2Active('4')
        ),
        new Spiker(
            1,
            new SinglePointPath(100, 300),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('4').setProgress2Active('5')
        ),
        new Ranger(
            1,
            new SinglePointPath(200, 300),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('6').setProgress2Active('7')
        ),
        new Grabber(
            1,
            new SinglePointPath(500, 300),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('7').setProgress2Active('8')
        ),
        new Scorcher(
            1,
            new SinglePointPath(800, 300),
            new KeyLoot('Test key', 'Test key description', 12, 'generosity'),
            Progress.builder().setRenderProgress('7').setProgress2Active('8')
        ),
        new Stinger(
            1,
            new SinglePointPath(200, 300),
            new NoteLoot('test heading', 'test description', 'Main hall code PLACE_CODE_HERE', 'main-hall'),
            Progress.builder().setRenderProgress('7').setProgress2Active('8')
        ),
    ]],
    [37, [
        new Torturer(
            1,
            new SinglePointPath(100, 100),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new SoulDrinker(
            1,
            new SinglePointPath(400, 100),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new RockCrusher(
            1,
            new SinglePointPath(700, 100),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new Tracker(
            1,
            1000,
            100,
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new Spiker(
            1,
            new SinglePointPath(100, 700),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new Ranger(
            1,
            new SinglePointPath(400, 700),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new Grabber(
            1,
            new SinglePointPath(700, 700),
            new Loot(RANDOM, 2),
            Progress.builder().setRenderProgress('500')
        ),
        new Scorcher(
            1,
            new SinglePointPath(1000, 700),
            null,
            Progress.builder().setRenderProgress('500')
        ),
        new Stinger(
            1,
            new SinglePointPath(1300, 700),
            null,
            Progress.builder().setRenderProgress('500')
        ),
    ]]
])