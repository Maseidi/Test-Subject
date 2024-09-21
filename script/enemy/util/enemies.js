import { Spiker } from '../type/spiker.js'
import { Ranger } from '../type/ranger.js'
import { Progress } from '../../progress.js'
import { Grabber } from '../type/grabber.js'
import { Stinger } from '../type/stinger.js'
import { Tracker } from '../type/tracker.js'
import { Scorcher } from '../type/scorcher.js'
import { RectPath, SinglePointPath } from '../../path.js'
import { KeyLoot, Loot, NoteLoot, RANDOM } from '../../loot.js'
import { RockCrusher, SoulDrinker, Torturer } from '../type/normal-enemy.js'

export const enemies = new Map([
    [1, []],
    [2, [
        new Torturer(1, new RectPath(350, 150, 300, 100))
    ]],
    [3, [
        new Torturer(1, new RectPath(100, 100, 200, 800), null, Progress.builder().setRenderProgress('1'), 'red'),
        new Torturer(1, new RectPath(700, 100, 200, 800), null, Progress.builder().setRenderProgress('1'), 'red'),
    ]]
])