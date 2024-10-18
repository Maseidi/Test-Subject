import { Wall } from './wall.js'
import { Room } from './room.js'
import { Progress } from './progress.js'
import { getDifficulty } from './variables.js'


// **********************************************************************************
// **********************************************************************************
// Rooms
// **********************************************************************************
// **********************************************************************************

export const rooms = new Map([
    [1,  new Room(1,500, 1000, 'Dormitory', 5, Progress.builder().setProgress2Active('1000'))],
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

    ]],
    [3, [

    ]],
    [4, [

    ]],
    [5, [

    ]],
    [6, [

    ]],
    [7, [

    ]],
    [8, [

    ]],
    [9, [

    ]],
    [10, [

    ]],
    [11, [

    ]],
    [12, []],
    [13, []],
    [14, []],
    [15, []],
    [16, []],
    [17, []],
    [18, [

    ]],
    [19, [

    ]],
    [20, [

    ]],
    [21, [

    ]],
    [22, [

    ]],
    [23, [

    ]],
    [24, [

    ]],
    [25, [

    ]],
    [26, [

    ]],
    [27, [

    ]],
    [28, [

    ]],
    [29, [

    ]],
    [30, [

    ]],
    [31, [

    ]],
    [32, [

    ]],
    [33, [

    ]],
    [34, [

    ]],
    [35, [

    ]],
    [36, [

    ]],
    [37, [

    ]],
    [38, [

    ]],
    [39, [

    ]],
    [40, [

    ]],
    [41, [

    ]],
    [42, [

    ]],
    [43, [

    ]],
    [44, [

    ]],
    [45, [

    ]],
    [46, [

    ]],
    [47, [

    ]],
    [48, [

    ]],
    [49, [

    ]],
    [50, [

    ]],
    [51, [

    ]],
    [52, [

    ]],
    [53, [

    ]],
    [54, [

    ]],
    [55, [

    ]],
    [56, [

    ]],
    [57, [

    ]],
])

// **********************************************************************************
// **********************************************************************************
// Loaders
// **********************************************************************************
// **********************************************************************************

let loaders = null
export const setLoaders = (val) => {
    loaders = val
}
export const getLoaders = () => loaders

export const initLoaders = () => new Map([
    [1, [

    ]],
    [2, [

    ]],
    [3, [

    ]],
    [4, [

    ]],
    [5, [

    ]],
    [6, [

    ]],
    [7, [

    ]],
    [8, [

    ]],
    [9, [

    ]],
    [10, [

    ]],
    [11, [

    ]],
    [12, [

    ]],
    [13, [

    ]],
    [14, [

    ]],
    [15, [

    ]],
    [16, [

    ]],
    [17, [

    ]],
    [18, [

    ]],
    [19, [

    ]],
    [20, [

    ]],
    [21, [

    ]],
    [22, [

    ]],
    [23, [

    ]],
    [24, [

    ]],
    [25, [

    ]],
    [26, [

    ]],
    [27, [

    ]],
    [28, [

    ]],
    [29, [

    ]],
    [30, [

    ]],
    [31, [

    ]],
    [32, [

    ]],
    [33, [

    ]],
    [34, [

    ]],
    [35, [

    ]],
    [36, [

    ]],
    [37, [

    ]],
    [38, [

    ]],
    [39, [

    ]],
    [40, [

    ]],
    [41, [

    ]],
    [42, [

    ]],
    [43, [

    ]],
    [44, [

    ]],
    [45, [

    ]],
    [46, [

    ]],
    [47, [

    ]],
    [48, [

    ]],
    [49, [

    ]],
    [50, [

    ]],
    [51, [

    ]],
    [52, [

    ]],
    [53, [

    ]],
    [54, [

    ]],
    [55, [

    ]],
    [56, [

    ]],
    [57, [

    ]],
])

// **********************************************************************************
// **********************************************************************************
// Enemies
// **********************************************************************************
// **********************************************************************************
let enemies = null
export const setEnemies = (val) => {
    enemies = val
}
export const getEnemies = () => enemies

export const initEnemies = () => {
    const enemiesMap = new Map([])
    Array.from([
        [ //1

        ],
        [ //2

        ],
        [ //3

        ],
        [ //4

        ],
        [ //5

        ],
        [ //6

        ],
        [ //7

        ],
        [ //8

        ],
        [ //9

        ],
        [ //10

        ],
        [ //11

        ],
        [ //12

        ],
        [ //13

        ],
        [ //14

        ],
        [ //15

        ],
        [ //16

        ],
        [ //17

        ],
        [ //18

        ],
        [ //19

        ],
        [ //20

        ],
        [ //21

        ],
        [ //22

        ],
        [ //23

        ],
        [ //24

        ],
        [ //25
            
        ],
        [ //26

        ],
        [ //27

        ],
        [ //28

        ],
        [ //29

        ],
        [ //30

        ],
        [ //31

        ],
        [ //32

        ],
        [ //33

        ],
        [ //34

        ],
        [ //35

        ],
        [ //36

        ],
        [ //37

        ],
        [ //38

        ],
        [ //39

        ],
        [ //40

        ],
        [ //41

        ],
        [ //42
            
        ],
        [ //43

        ],
        [ //44

        ],
        [ //45

        ],
        [ //46

        ],
        [ //47

        ],
        [ //48

        ],
        [ //49

        ],
        [ //50

        ],
        [ //51

        ],
        [ //52

        ],
        [ //53

        ],
        [ //54

        ],
        [ //55

        ],
        [ //56

        ],
        [ //57

        ]
    ])
    .map(arr => arr.filter(enemy => enemy.difficulties.includes(getDifficulty())))
    .forEach((arr, index) => enemiesMap.set(index + 1, arr))
    return enemiesMap
}

// **********************************************************************************
// **********************************************************************************
// Interactables
// **********************************************************************************
// **********************************************************************************
let interactables = null
export const setInteractables = (val) => {
    interactables = val
}
export const getInteractables = () => interactables

export const initInteractables = () => {
    const interactablesMap = new Map([])
    Array.from([
        [ //1

        ],
        [ //2

        ],
        [ //3

        ],
        [ //4

        ],
        [ //5

        ],
        [ //6

        ],
        [ //7

        ],
        [ //8

        ],
        [ //9

        ],
        [ //10

        ],
        [ //11

        ],
        [ //12
        ],
        [ //13

        ],
        [ //14

        ],
        [ //15

        ],
        [ //16

        ],
        [ //17

        ],
        [ //18
        ],
        [ //19

        ],
        [ //20

        ],
        [ //21

        ],
        [ //22

        ],
        [ //23

        ],
        [ //24

        ],
        [ //25

        ],
        [ //26

        ],
        [ //27

        ],
        [ //28

        ],
        [ //29

        ],
        [ //30

        ],
        [ //31

        ],
        [ //32

        ],
        [ //33

        ],
        [ //34

        ],
        [ //35

        ],
        [ //36

        ],
        [ //37

        ],
        [ //38

        ],
        [ //39

        ],
        [ //40

        ],
        [ //41

        ],
        [ //42
            
        ],
        [ //43

        ],
        [ //44

        ],
        [ //45

        ],
        [ //46

        ],
        [ //47

        ],
        [ //48

        ],
        [ //49

        ],
        [ //50

        ],
        [ //51

        ],
        [ //52

        ],
        [ //53

        ],
        [ //54

        ],
        [ //55

        ],
        [ //56

        ],
        [ //57

        ]
    ])
    .map(arr => arr.filter(int => int.difficulties.includes(getDifficulty())))
    .forEach((arr, index) => interactablesMap.set(index + 1, arr))
    return interactablesMap
}

// **********************************************************************************
// **********************************************************************************
// Dialogues
// **********************************************************************************
// **********************************************************************************

export const dialogues = []

// **********************************************************************************
// **********************************************************************************
// Popus
// **********************************************************************************
// **********************************************************************************

export const popups = []