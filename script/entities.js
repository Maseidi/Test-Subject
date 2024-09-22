import { Room } from './room.js'
import { Wall } from './wall.js'
import { Progress } from './progress.js'
import { Popup } from './popup-manager.js'
import { Chapter } from './chapter-manager.js'
import { Torturer } from './enemy/type/normal-enemy.js'
import { Dialogue, sources } from './dialogue-manager.js'
import { Path, Point, RectPath, SinglePointPath, VerDoublePointPath } from './path.js'
import { Bandage, Crate, GunDrop, KeyDrop, Lever, Lighter, Note, PistolAmmo, RedVaccine, Stick } from './interactables.js'
import { 
    BottomLoader_FromLeft,
    Door,
    LeftLoader_FromTop,
    RightLoader_FromTop,
    TopLoader_FromLeft } from './loader.model.js'
import { 
    BANDAGE_LOOT,
    BLUE_VACCINE,
    GREEN_VACCINE,
    Loot,
    PISTOL,
    PISTOL_AMMO_LOOT,
    PURPLE_VACCINE,
    RED_VACCINE,
    STICK_LOOT,
    YELLOW_VACCINE } from './loot.js'

// **********************************************************************************
// **********************************************************************************
// Rooms
// **********************************************************************************
// **********************************************************************************

export const rooms = new Map([
    [1, new Room(1, 500,  1000, 'Dormitory', 5, Progress.builder().setProgress2Active('1000'))],
    [2, new Room(2, 1000, 500,  'Bunker A' , 5, Progress.builder().setProgress2Active('2000'))],
    [3, new Room(3, 1000, 1000, 'Bunker B' , 5, Progress.builder().setProgress2Active('3000'))],
    [4, new Room(4, 750,  750,  'Bunker C',  5, Progress.builder().setProgress2Active('4000'))],
    [5, new Room(5, 800,  600,  'Bunker D',  5, Progress.builder().setProgress2Active('5000'))],
    [6, new Room(6, 2000, 1000, 'Bunker E',  4, Progress.builder().setProgress2Active('6000'))],
    [7, new Room(7, 2000, 1000, 'Bunker F',  3, Progress.builder().setProgress2Active('7000'))],
    [8, new Room(8, 1400,  500, 'Bunker G',  1, Progress.builder().setProgress2Active('8000'))],
    [9, new Room(9, 1000, 1200, 'Bunker H',  7, Progress.builder().setProgress2Active('9000'))],
])

// **********************************************************************************
// **********************************************************************************
// Walls
// **********************************************************************************
// **********************************************************************************

export const walls = new Map([
    [1, [
        new Wall(75, 25, 100, null, 100),
        new Wall(75, 25, 100, null, 200),
        new Wall(75, 25, 100, null, 300),
        new Wall(75, 25, 100, null, 400),
        new Wall(75, 25, 100, null, 500),
        new Wall(75, 25, 100, null, 600),
        new Wall(75, 25, 100, null, 700),
        new Wall(75, 25, 100, null, 800),
        new Wall(75, 25, 100, null, 900),
        new Wall(75, 25, null, 100, 100),
        new Wall(75, 25, null, 100, 200),
        new Wall(75, 25, null, 100, 300),
        new Wall(75, 25, null, 100, 400),
        new Wall(75, 25, null, 100, 500),
        new Wall(75, 25, null, 100, 600),
        new Wall(75, 25, null, 100, 700),
        new Wall(75, 25, null, 100, 800),
        new Wall(75, 25, null, 100, 900),
    ]],
    [2, [
        new Wall(400, 50, 300, null, 300),
        new Wall(200, 50, 400, null, 100)
    ]],
    [3, [
        new Wall(50, 700, 200, null, 150),
        new Wall(50, 700, null, 200, 150),
        new Wall(200, 50, 400, null, null, 200)
    ]],
    [4, [
        new Wall(500, 50, 125, null, 200),
        new Wall(500, 50, 125, null, null, 200),
    ]],
    [5, [
        new Wall(100, 100, 200, null, 250),
        new Wall(100, 100, 500, null, 250),
    ]],
    [6, [
        new Wall(100, 600, 300, null, 200),
        new Wall(100, 600, 700, null, 200),
        new Wall(100, 600, 1100, null, 200),
        new Wall(100, 600, 1500, null, 200),
    ]],
    [7, [
        new Wall(200, 200, 200, null, 200),
        new Wall(200, 200, 200, null, 600),
        new Wall(200, 200, null, 200, 200),
        new Wall(200, 200, null, 200, 600),
    ]],
    [8, [
        new Wall(200, 200, 200, null, 300),
        new Wall(200, 200, 400, null, 0),
        new Wall(200, 200, 600, null, 300),
        new Wall(200, 200, 800, null, 0),
        new Wall(200, 200, 1000, null, 300),
    ]],
    [9, [
        new Wall(200, 200, 0, null, 0),
        new Wall(200, 200, 0, null, 1000),
        new Wall(200, 200, 800, null, 0),
        new Wall(200, 200, 800, null, 1000),
    ]]
])

// **********************************************************************************
// **********************************************************************************
// Loaders
// **********************************************************************************
// **********************************************************************************

export const loaders = new Map([
    [1, [
        new TopLoader_FromLeft(2, 100, 200, 
            // new Door('black', 'Drom door', 'Danger outside', 'dorm', 
            //     Progress.builder().setRenderProgress('1009')
            // )
        ),
    ]],
    [2, [
        new BottomLoader_FromLeft(1, 100, 450),
        new TopLoader_FromLeft(3, 100, 450, 
            // new Door('black', 'Bunker B door', 'In need of right directions', null, 
            //     Progress.builder().setRenderProgress('2005')
            // )
        )
    ]],
    [3, [
        new BottomLoader_FromLeft(2, 100, 450),
        new TopLoader_FromLeft(4, 100, 450,
            // new Door('black', 'Bunker C Door', 'In need of right direction', null, 
            //     Progress.builder().setRenderProgress('3003')
            // )
        ),
    ]],
    [4, [
        new BottomLoader_FromLeft(3, 100, 400),
        new LeftLoader_FromTop(5, 200, 200, 
            // new Door('black', 'Bunker D door', 'Free the souls to free yourself', null, 
            //     Progress.builder().setKillAll('4000')
            // )
        )
    ]],
    [5, [
        new RightLoader_FromTop(4, 200, 200),
        new LeftLoader_FromTop(6, 100, 250, 
            // new Door('black', 'Bunker E door', 'Fetch the corpses to obtain freedom', null, 
            //     Progress.builder().setKillAll('5000')
            // )
        )
    ]],
    [6, [
        new RightLoader_FromTop(5, 100, 450),
        new TopLoader_FromLeft(7, 200, 900, 
            // new Door('black', 'Bunker F door', 'Prioritizing others', 'sacrifice', 
            //     Progress.builder().setRenderProgress('6002')
            // )
        )
    ]],
    [7, [
        new BottomLoader_FromLeft(6, 200, 900),
        new RightLoader_FromTop(8, 100, 450, 
            new Door('black', 'Bunker G door', 'Free the souls to free yourself', null, 
                Progress.builder().setKillAll('7000')
            )
        ),
        new LeftLoader_FromTop(9, 100, 450, 
            new Door('black', 'Bunker H door', 'In need of right direction', null, 
                Progress.builder().setRenderProgress('8001')
            )
        ),
        new TopLoader_FromLeft(10, 200, 900, 
            new Door('black', 'Bunker I door', "I'm the most important one", 'selfishness', 
                Progress.builder().setKillAll('9004')
            )
        )
    ]],
    [8, [
        new LeftLoader_FromTop(7, 100, 200, 
            new Door('black', 'Bunker F door', 'Free all the souls to free yourself', null, 
                Progress.builder().setKillAll('8001')
            )
        )
    ]],
    [9, [
        new RightLoader_FromTop(7, 100, 550, 
            new Door('black', 'Bunker F door', 'Free all souls to free yourself', null, 
                Progress.builder().setKillAll('9004')
            )
        )
    ]]
])

// **********************************************************************************
// **********************************************************************************
// Enemies
// **********************************************************************************
// **********************************************************************************

export const enemies = new Map([
    [1, []],
    [2, [
        new Torturer(1, new RectPath(350, 150, 300, 100))
    ]],
    [3, [
        new Torturer(1, new RectPath(100, 100, 200, 800), null, 
            Progress.builder().setRenderProgress('3000'), 'red'
        ),
        new Torturer(1, new RectPath(700, 100, 200, 800), null, 
            Progress.builder().setRenderProgress('3000'), 'red'
        ),
    ]],
    [4, [
        new Torturer(1, new Path([
            new Point(675, 100), new Point(675, 350), new Point(75, 350), new Point(75, 100)
        ]), null, 
            Progress.builder().setRenderProgress('4000'), 'blue'
        ),
        new Torturer(1, new Path([
            new Point(75, 450), new Point(75, 650), new Point(675, 650), new Point(675, 450)
        ]), null, 
            Progress.builder().setRenderProgress('4000'), 'purple'
        ),
    ]],
    [5, [
        new Torturer(1, new Path([
            new Point(350, 275), new Point(150, 275)
        ]), null, 
            Progress.builder().setRenderProgress('5000'), 'green'
        ),
        new Torturer(1, new Path([
            new Point(425, 275), new Point(675, 275)
        ]), null, 
            Progress.builder().setRenderProgress('5000'), 'yellow'
        ),
        new Torturer(1, new SinglePointPath(350, 100), null, 
            Progress.builder().setRenderProgress('5000'), 'green'
        ),
        new Torturer(1, new SinglePointPath(350, 500), null, 
            Progress.builder().setRenderProgress('5000'), 'yellow'
        ),
    ]],
    [6, [
        new Torturer(1, new SinglePointPath(150, 500), null, Progress.builder().setRenderProgress('6000'), 'red'),
        new Torturer(1, new SinglePointPath(550, 500), null, Progress.builder().setRenderProgress('6000'), 'green'),
        new Torturer(1, new SinglePointPath(950, 500), null, Progress.builder().setRenderProgress('6000'), 'yellow'),
        new Torturer(1, new SinglePointPath(1350, 500), null, Progress.builder().setRenderProgress('6000'), 'blue'),
        new Torturer(1, new SinglePointPath(1750, 500), null, Progress.builder().setRenderProgress('6000'), 'purple'),
    ]],
    [7, [
        new Torturer(1, new VerDoublePointPath(300, 100, 400), new Loot(YELLOW_VACCINE, 2), 
            Progress.builder().setRenderProgress('7000'), 'purple'
        ),
        new Torturer(1, new VerDoublePointPath(300, 500, 400), new Loot(BLUE_VACCINE, 2), 
            Progress.builder().setRenderProgress('7000'), 'yellow'
        ),
        new Torturer(1, new VerDoublePointPath(1000, 100, 400), new Loot(GREEN_VACCINE, 2), 
            Progress.builder().setRenderProgress('7000'), 'blue'
        ),
        new Torturer(1, new VerDoublePointPath(1700, 100, 400), new Loot(RED_VACCINE, 2), 
            Progress.builder().setRenderProgress('7000'), 'green'
        ),
        new Torturer(1, new VerDoublePointPath(1700, 500, 400), new Loot(PURPLE_VACCINE, 2), 
            Progress.builder().setRenderProgress('7000'), 'red'
        ),
        new Torturer(1, new VerDoublePointPath(300, 100, 400), new Loot(PISTOL_AMMO_LOOT, 10), 
            Progress.builder().setRenderProgress('9004'),
        ),
        new Torturer(1, new VerDoublePointPath(300, 500, 400), new Loot(BANDAGE_LOOT, 3), 
            Progress.builder().setRenderProgress('9004'),
        ),
        new Torturer(1, new VerDoublePointPath(1000, 100, 400), new Loot(PISTOL_AMMO_LOOT, 10), 
            Progress.builder().setRenderProgress('9004'),
        ),
        new Torturer(1, new VerDoublePointPath(1700, 100, 400), new Loot(BANDAGE_LOOT, 3), 
            Progress.builder().setRenderProgress('9004'),
        ),
        new Torturer(1, new VerDoublePointPath(1700, 500, 400), new Loot(PISTOL_AMMO_LOOT, 10), 
            Progress.builder().setRenderProgress('9004'),
        ),
    ]],
    [8, [
        new Torturer(1, new SinglePointPath(700, 100), new Loot(YELLOW_VACCINE, 2), 
            Progress.builder().setRenderProgress('8000'), 'blue'
        ),
        new Torturer(1, new SinglePointPath(900, 400), new Loot(BLUE_VACCINE, 2), 
            Progress.builder().setRenderProgress('8000'), 'purple'
        ),
        new Torturer(1, new SinglePointPath(1200, 100), new Loot(BANDAGE_LOOT, 5), 
            Progress.builder().setRenderProgress('8000')
        ),

        new Torturer(1, new SinglePointPath(100, 400), new Loot(GREEN_VACCINE, 2), 
            Progress.builder().setRenderProgress('8001'), 'red'
        ),
        new Torturer(1, new SinglePointPath(300, 100), new Loot(RED_VACCINE, 2), 
            Progress.builder().setRenderProgress('8001'), 'green'
        ),
        new Torturer(1, new SinglePointPath(500, 400), new Loot(PURPLE_VACCINE, 2), 
            Progress.builder().setRenderProgress('8001'), 'yellow'
        ),
    ]],
    [9, [
        new Torturer(1, new SinglePointPath(100, 600), new Loot(PISTOL_AMMO_LOOT, 5), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(200, 600), new Loot(PISTOL_AMMO_LOOT, 6), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(300, 600), new Loot(PISTOL_AMMO_LOOT, 4), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(300, 100), new Loot(PISTOL_AMMO_LOOT, 7), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(300, 1100), new Loot(PISTOL_AMMO_LOOT, 3), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(400, 600), new Loot(PISTOL_AMMO_LOOT, 4), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(400, 100), new Loot(PISTOL_AMMO_LOOT, 7), 
            Progress.builder().setRenderProgress('9004')
        ),
        new Torturer(1, new SinglePointPath(400, 1100), new Loot(PISTOL_AMMO_LOOT, 3), 
            Progress.builder().setRenderProgress('9004')
    ),
    ]]
])

// **********************************************************************************
// **********************************************************************************
// Interactables
// **********************************************************************************
// **********************************************************************************

export const interactables = new Map([
    [1, [
        new Note(125, 850, "Prisoner's memo", "Memories of a prisoner", "It's been 2 days since I'm here. I'm so hungry and there's no one responsible for this mess. I don't know what happened. All I remember was my normal life. And now I'm here, alone.... Why would this happen? I don't even know if I'm kidnapped by a criminal or arrested by law. Even then I would have contacted someone by now. The door's key is on the ground, so I can get out whenever I want, but the outdoors is terrifying. It's so dark and I think there's a predator past these doors. I can hear it breathing every now and then. I might have to get out of here and face it, or else I would starve to death...",
            Progress.builder().setRenderProgress('1003').setProgress2Active('1004').setOnExamineProgress2Active('1005')
        ),
        new KeyDrop(400, 850, 1, 'Dorm key', 'Key for the dormitory', 'dorm', 
            Progress.builder().setRenderProgress('1006').setProgress2Active('1007')
        ),
    ]],
    [2, [
        new Lever(100, 100, Progress.builder().setRenderProgress('2000').setProgress2Active('2002')),
        new Lever(100, 400, Progress.builder().setRenderProgress('2002').setProgress2Active('2003')),
        new Lever(900, 100, Progress.builder().setRenderProgress('2003').setProgress2Active('2004')),
        new Lever(900, 400, Progress.builder().setRenderProgress('2004').setProgress2Active('2005')),
    ]],
    [3, [
        new RedVaccine(350, 825, 2, Progress.builder().setRenderProgress('3000')),
        new RedVaccine(650, 825, 2, Progress.builder().setRenderProgress('3000')),
        new Note(500, 825, "Fugitive's note", "Possible use case of vaccine", "Seems like I'm not the first one facing this, so I'll leave a note cause I believe I won't be the last one either. I found out that the monsters are super weak to the vaccines. I had no clue what they were used for but I picked them up anyway. One of the monsters was after me. It caught me and bit me. I didn't know what to do... I just pulled out the vaccine and injected it to the freak. The monster vanished from existance! It happened so quick I couldn't believe my eyes. Even though the bite hurts, but that was a satisfying achievement...", 
            Progress.builder().setRenderProgress('3000').setOnExamineProgress2Active('3001')
        ),
        new Lever(500, 300, Progress.builder().setKillAll('3000').setProgress2Active('3003'))
    ]],
    [4, [
        new Crate(100, 375, new Loot(BLUE_VACCINE, 3)),
        new Crate(650, 375, new Loot(PURPLE_VACCINE, 3)),
    ]],
    [5, [
        new Crate(700, 100, new Loot(YELLOW_VACCINE, 3)),
        new Crate(700, 300, new Loot(BANDAGE_LOOT, 3)),
        new Crate(700, 500, new Loot(GREEN_VACCINE, 3)),
    ]],
    [6, [
        new Crate(100, 100, new Loot(RED_VACCINE, 2)),
        new Crate(100, 800, new Loot(GREEN_VACCINE, 2)),
        new Crate(1000, 800, new Loot(PURPLE_VACCINE, 2)),
        new Crate(1900, 100, new Loot(YELLOW_VACCINE, 2)),
        new Crate(1900, 800, new Loot(BLUE_VACCINE, 2)),
        new Bandage(950, 100, 3),
        new KeyDrop(950, 500, 2, 'Key of sacrifice', 'A key demonstrating the beauty of sacrifice', 'sacrifice', 
            Progress.builder().setKillAll('6000')
        )
    ]],
    [7, [
        new Crate(900, 700, new Loot(STICK_LOOT, 1)),
        new Lighter(1100, 700, Progress.builder().setProgress2Active('7001'))
    ]],
    [8, [
        new Lever(1200, 250, Progress.builder().setKillAll('8000').setProgress2Active('8001')),
        new Stick(1200, 250, Progress.builder().setRenderProgress('8000'), 100)
    ]],
    [9, [
        new GunDrop(900, 600, PISTOL, 10, 1, 1, 1, 1, 1, 
            Progress.builder().setRenderProgress('9000').setProgress2Active('9001')
        ),
        new PistolAmmo(900, 700, 30, 
            Progress.builder().setRenderProgress('9000')
        )
    ]]
])

// **********************************************************************************
// **********************************************************************************
// Dialogues
// **********************************************************************************
// **********************************************************************************

export const dialogues = [
    new Dialogue('Where the hell am I?', sources.MIAN, 
        Progress.builder().setRenderProgress('1001').setProgress2Active('1002')
    ),
    new Dialogue('What the ..., I gotta find that key.', sources.MIAN, 
        Progress.builder().setRenderProgress('1005').setProgress2Active('1006')
    ),
    new Dialogue('There it is.', sources.MIAN, 
        Progress.builder().setRenderProgress('1007').setProgress2Active('1008')
    ),
    new Dialogue("It's so dark", sources.MIAN, 
        Progress.builder().setRenderProgress('2000').setProgress2Active('2001')
    ),
    new Dialogue("What the hell was that?!", sources.MIAN, 
        Progress.builder().setRenderProgress('3000')
    ),
    new Dialogue("Alright, good to know.", sources.MIAN, 
        Progress.builder().setRenderProgress('3001').setProgress2Active('3002')
    ),
    new Dialogue("I might be able to find a weapon. It's a bunker after all.", sources.MIAN, 
        Progress.builder().setRenderProgress('4000'), 6000
    ),
    new Dialogue("It's so dark. I barely can see anything...", sources.MIAN, 
        Progress.builder().setRenderProgress('7000')
    ),
    new Dialogue("Nice! I might be able to light something up with this!", sources.MIAN, 
        Progress.builder().setRenderProgress('7001'), 6000
    ),
    new Dialogue("Oh, nice!", sources.MIAN, 
        Progress.builder().setRenderProgress('9001'), 2000
    ),
]

// **********************************************************************************
// **********************************************************************************
// Popus
// **********************************************************************************
// **********************************************************************************

export const popups = [
    new Popup('You can always leave the infection state by using an appropriate vaccine', 
        Progress.builder().setRenderProgress('10000000'), 10000
    ),
    new Popup('<span>H</span> Use bandage to heal', 
        Progress.builder().setRenderProgress('10000001'), 10000
    ),
    new Popup('<span>Q</span> Light up torch', 
        Progress.builder().setRenderProgress('10000002'), 10000
    ),
    new Popup('<span>R</span> Reload', 
        Progress.builder().setRenderProgress('10000003'), 10000
    ),

    new Popup('<span>W</span> <span>A</span> <span>S</span> <span>D</span> Move', 
        Progress.builder().setRenderProgress('1002').setProgress2Active('1003'), 3000
    ),
    new Popup('<span>F</span> Interact',
        Progress.builder().setRenderProgress('1003')
    ),
    new Popup('<span>Tab</span> Open inventory', 
        Progress.builder().setRenderProgress('1004')
    ),
    new Popup('Use the key from inventory to open the door.', 
        Progress.builder().setRenderProgress('1008')
    ),
    new Popup('<span>Shift</span> Sprint', 
        Progress.builder().setRenderProgress('2001')
    ),
    new Popup('Sneak past enemies with vaccine to perform stealth kills. Do not let them notice you.', 
        Progress.builder().setRenderProgress('3002')
    ),
    new Popup('<span>1</span> <span>2</span> <span>3</span> <span>4</span> Weapon wheel', 
        Progress.builder().setRenderProgress('9001').setProgress2Active('9002')
    ),
    new Popup('<span>E</span> Aim gun', 
        Progress.builder().setRenderProgress('9002').setProgress2Active('9003')
    ),
    new Popup('<span>Left click</span> Shoot', 
        Progress.builder().setRenderProgress('9003').setProgress2Active('9004')
    )
]

// **********************************************************************************
// **********************************************************************************
// Chapters
// **********************************************************************************
// **********************************************************************************

export const chapters = [
    new Chapter(1, Progress.builder().setRenderProgress('1000').setProgress2Active([1001]), 3000)
]