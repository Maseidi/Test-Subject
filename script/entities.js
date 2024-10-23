import { Wall } from './wall.js'
import { Progress } from './progress.js'
import { Popup } from './popup-manager.js'
import { Room, sections } from './room.js'
import { getDifficulty } from './variables.js'
import { KeyDrop, Note } from './interactables.js'
import { Dialogue, sources } from './dialogue-manager.js'
import { BottomLoader, Door, LeftLoader, RightLoader, TopLoader } from './loader.js'


// **********************************************************************************
// **********************************************************************************
// Rooms
// **********************************************************************************
// **********************************************************************************

export const rooms = new Map([
    [1,  new Room(1,   500, 1000, 'Dormitory', 9, Progress.builder().setProgress2Active('1000'))],
    [2,  new Room(2,  1000,  500, 'Bunker A', 9, Progress.builder().setProgress2Active('2000'))],
    [3,  new Room(3,  1000, 1000, 'Bunker B', 9, Progress.builder().setProgress2Active('3000'))],
    [4,  new Room(4,   750,  750, 'Bunker C', 9, Progress.builder().setProgress2Active('4000'))],
    [5,  new Room(5,   800,  600, 'Bunker D', 9, Progress.builder().setProgress2Active('5000'))],
    [6,  new Room(6,  2000, 1000, 'Bunker E', 9, Progress.builder().setProgress2Active('6000'))],
    [7,  new Room(7,  2000, 1000, 'Bunker F', 9, Progress.builder().setProgress2Active('7000'))],
    [8,  new Room(8,  1400,  500, 'Bunker G', 9, Progress.builder().setProgress2Active('8000'))],
    [9,  new Room(9,  1000, 1200, 'Bunker H', 9, Progress.builder().setProgress2Active('9000'))],
    [10, new Room(10, 1000, 3000, 'Bunker I', 9, Progress.builder().setProgress2Active('10000'))],
    [11, new Room(11, 3000, 3000, 'Corridor to Heaven', 9, Progress.builder().setProgress2Active('11000'))],
    [12, new Room(12, 1200, 1200, 'Main Hall', 9, Progress.builder().setProgress2Active('12000'), sections.CASTLE)],
    [13, new Room(13,  200, 1000, 'Room of Sacrifice', 9, null, sections.CASTLE)],
    [14, new Room(14,  200, 1000, 'Room of Chivalry' , 9, null, sections.CASTLE)],
    [15, new Room(15,  200, 1000, 'Room of Wisdom', 9, null, sections.CASTLE)],
    [16, new Room(16, 1000, 1000, 'Speech Room', 9, null, sections.CASTLE)],
    [17, new Room(17,  200, 5000, 'Exit', 9, null, sections.CASTLE)],
    [18, new Room(18, 1000, 1000, 'Museum Entrance', 9, null, sections.CASTLE)],
    [19, new Room(19, 1000, 1000, 'Lab Entrance', 9, null, sections.CASTLE)],
    [20, new Room(20, 1000, 1000, 'Yard Entrance', 9, null, sections.CASTLE)],
    [21, new Room(21, 1000, 1000, 'Library Entrance', 9, null, sections.CASTLE)],
    [22, new Room(22, 1000, 1000, 'Meusum Waiting Room', 9, null, sections.MUSEUM)],
    [23, new Room(23, 1200,  800, 'Military and Arms Museum', 9, null, sections.MUSEUM)],
    [24, new Room(24,  800, 1200, 'Arts Museum', 9, null, sections.MUSEUM)],
    [25, new Room(25, 1500, 1500, 'Wildlife Museum', 9, null, sections.MUSEUM)],
    [26, new Room(26, 2000, 1000, 'Biology Lab', 9, null, sections.LAB)],
    [27, new Room(27,  750, 2000, 'Blood Samples', 9, null, sections.LAB)],
    [28, new Room(28,  800, 2000, 'Main Square', 9, null, sections.YARD)],
    [29, new Room(29, 1400,  700, 'History Books', 9, null, sections.LIBRARY)],
    [30, new Room(30, 2000, 1000, 'Poetry', 9, null, sections.LIBRARY)],
    [31, new Room(31, 1200, 1400, 'Math and Algebra', 9, null, sections.LIBRARY)],
    [32, new Room(32,  800, 1100, 'Biology', 9, null, sections.LIBRARY)],
    [33, new Room(33, 1300,  700, 'Cold Weapons Showcase', 9, null, sections.MUSEUM)],
    [34, new Room(34, 2500, 2500, 'Warm Weapons Showcase', 9, null, sections.MUSEUM)],
    [35, new Room(35, 1000, 1000, 'Armors Showcase', 9, null, sections.MUSEUM)],
    [36, new Room(36, 1100,  775, 'Literature Showcase', 9, null, sections.MUSEUM)],
    [37, new Room(37, 1025,  825, 'Handcrafts Showcase', 9, null, sections.MUSEUM)],
    [38, new Room(38, 1750, 1250, 'Animals Showcase', 9, null, sections.MUSEUM)],
    [39, new Room(39, 1500, 1750, 'Dinosours Showcase', 9, null, sections.MUSEUM)],
    [40, new Room(40, 1100, 1300, 'Insects Showcase', 9, null, sections.MUSEUM)],
    [41, new Room(41, 1600, 1175, 'Biology Lab A- Fish and Amphabians', 9, null, sections.LAB)],
    [42, new Room(42, 2000, 2000, 'Biology Lab B- Reptiles and Birds', 9, null, sections.LAB)],
    [43, new Room(43, 1200,  875, 'Biology Lab C- Mammals', 9, null, sections.LAB)],
    [44, new Room(44, 1000, 2000, 'DNA Samples', 9, null, sections.LAB)],
    [45, new Room(45,  900,  900, 'Oak Land', 9, null, sections.YARD)],
    [46, new Room(46,  975, 1850, 'Pine Land', 9, null, sections.YARD)],
    [47, new Room(47, 1150, 1425, 'Maple land', 9, null, sections.YARD)],
    [48, new Room(48, 2000, 1025, 'Berry Bush Land', 9, null, sections.YARD)],
    [49, new Room(49, 1375, 2225, 'Cedar Land', 9, null, sections.YARD)],
    [50, new Room(50, 1625,  875, 'Geology', 9, null, sections.LIBRARY)],
    [51, new Room(51, 1000, 2000, 'Computer Science', 9, null, sections.LIBRARY)],
    [52, new Room(52, 2500, 1250, 'Novels', 9, null, sections.LIBRARY)],
    [53, new Room(53, 2500, 1250, 'Geograoghy', 9, null, sections.LIBRARY)],
    [54, new Room(54, 1750,  800, 'Chemistry', 9, null, sections.LIBRARY)],
    [55, new Room(55,  800, 1750, 'Physics', 9, null, sections.LIBRARY)],
    [56, new Room(56, 1000, 1000, 'Animals', 9, null, sections.LIBRARY)],
    [57, new Room(57, 1325,  675, 'Plants', 9, null, sections.LIBRARY)],
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
        new Wall(50, 200, 200, null, null, 0),
        new Wall(50, 200, 400, null, 0),
        new Wall(50, 200, 600, null, null, 0),
        new Wall(50, 200, 800, null, 0),
        new Wall(50, 200, 1000, null, null, 0),
    ]],
    [9, [
        new Wall(200, 200, 0, null, 0),
        new Wall(200, 200, 0, null, 1000),
        new Wall(200, 200, 800, null, 0),
        new Wall(200, 200, 800, null, 1000),
    ]],
    [10, [
        new Wall(100, 2000, 100, null, 500),
        new Wall(100, 2000, null, 100, 500),
    ]],
    [11, [
        new Wall(2800, 1400, 0, null, 0),
        new Wall(2800, 1400, null, 0, null, 0)
    ]],
    [12, []],
    [13, []],
    [14, []],
    [15, []],
    [16, []],
    [17, []],
    [18, [
        new Wall(850, 850, 0, null, 0)
    ]],
    [19, [
        new Wall(850, 850, 0, null, 150)
    ]],
    [20, [
        new Wall(850, 850, 150, null, 150)
    ]],
    [21, [
        new Wall(850, 400/3, 0, null, 150),
        new Wall(850, 400/3, 0, null, 300 + 400/3),
        new Wall(850, 400/3, 0, null, 450 + 800/3),
    ]],
    [22, []],
    [23, [
        new Wall(50, 500, 300, null, 150),
        new Wall(50, 500, null, 300, 150),
    ]],
    [24, [
        new Wall(100, 100, 200, null, 200),
        new Wall(100, 100, 200, null, null, 200),
        new Wall(100, 100, null, 200, 200),
        new Wall(100, 100, null, 200, null, 200),
    ]],
    [25, [
        new Wall(200, 100, 200, null, 200),
        new Wall(200, 100, 200, null, 500),
        new Wall(200, 100, 200, null, 800),
        new Wall(200, 100, 200, null, 1100),
        new Wall(200, 100, null, 200, 200),
        new Wall(200, 100, null, 200, 500),
        new Wall(200, 100, null, 200, 800),
        new Wall(200, 100, null, 200, 1100),
    ]],
    [26, [
        new Wall(1500, 50, 250, null, 200),
        new Wall(1500, 50, 250, null, 500),
        new Wall(1500, 50, 250, null, 800),
    ]],
    [27, [
        new Wall(100, 100, 100, null, 200),
        new Wall(100, 100, 100, null, 500),
        new Wall(100, 100, 100, null, 800),
        new Wall(100, 100, 100, null, 1100),
        new Wall(100, 100, 100, null, 1400),
        new Wall(100, 100, 100, null, 1700),
        new Wall(100, 100, null, 100, 200),
        new Wall(100, 100, null, 100, 500),
        new Wall(100, 100, null, 100, 800),
        new Wall(100, 100, null, 100, 1100),
        new Wall(100, 100, null, 100, 1400),
        new Wall(100, 100, null, 100, 1700),
    ]],
    [28, [
        new Wall(50, 1500, 200, null, 250),
        new Wall(50, 1500, null, 250, 250),
    ]],
    [29, [
        new Wall(400, 275, 1000, null, 425),
        new Wall(400, 275, 0, null, 0),
    ]],
    [30, [
        new Wall(50, 800, 200, null, 0),
        new Wall(50, 800, 700, null, 0),
        new Wall(50, 800, 1200, null, 0),
        new Wall(50, 800, 1700, null, 0),
        new Wall(50, 800, 450, null, null, 0),
        new Wall(50, 800, 950, null, null, 0),
        new Wall(50, 800, 1450, null, null, 0),
    ]],
    [31, [
        new Wall(500, 300, 0, null, null, 0),
        new Wall(600, 300, 0, null, 550)
    ]],
    [32, [
        new Wall(500, 25, 200, null, 200),
        new Wall(500, 25, null, 200, 400),
        new Wall(500, 25, 200, null, 600),
        new Wall(500, 25, null, 200, 800),
    ]],
    [33, [
        new Wall(100, 400, 300, null, 150),
        new Wall(100, 400, null, 300, 150),
    ]],
    [34, [
        new Wall(75, 75, 300, null, 300),
        new Wall(75, 75, 300, null, 700),
        new Wall(75, 75, 300, null, 1000),
        new Wall(75, 75, 300, null, 1300),
        new Wall(75, 75, 300, null, 1600),
        new Wall(75, 75, 300, null, 1900),
        new Wall(75, 75, 300, null, 2200),
        new Wall(75, 75, 700, null, 300),
        new Wall(75, 75, 700, null, 700),
        new Wall(75, 75, 700, null, 1000),
        new Wall(75, 75, 700, null, 1300),
        new Wall(75, 75, 700, null, 1600),
        new Wall(75, 75, 700, null, 1900),
        new Wall(75, 75, 700, null, 2200),
        new Wall(75, 75, null, 300, 300),
        new Wall(75, 75, null, 300, 700),
        new Wall(75, 75, null, 300, 1000),
        new Wall(75, 75, null, 300, 1300),
        new Wall(75, 75, null, 300, 1600),
        new Wall(75, 75, null, 300, 1900),
        new Wall(75, 75, null, 300, 2200),
        new Wall(75, 75, null, 700, 300),
        new Wall(75, 75, null, 700, 700),
        new Wall(75, 75, null, 700, 1000),
        new Wall(75, 75, null, 700, 1300),
        new Wall(75, 75, null, 700, 1600),
        new Wall(75, 75, null, 700, 1900),
        new Wall(75, 75, null, 700, 2200),
        new Wall(75, 75, null, 1212.5, 300),
        new Wall(75, 75, null, 1212.5, 700),
        new Wall(75, 75, null, 1212.5, 1000),
        new Wall(75, 75, null, 1212.5, 1300),
        new Wall(75, 75, null, 1212.5, 1600),
        new Wall(75, 75, null, 1212.5, 1900),
        new Wall(75, 75, null, 1212.5, 2200),
    ]],
    [35, [
        new Wall(800, 50, 0, null, 300),
        new Wall(800, 50, null, 0, null, 300),
    ]],
    [36, [
        new Wall(500, 312.5, 0, null, 0),
        new Wall(500, 312.5, null, 0, 462.5),
    ]],
    [37, [
        new Wall(825, 225, 0, null, 0),
        new Wall(825, 225, null, 0, null, 0),
    ]],
    [38, [
        new Wall(150, 150, 200, null, 200),
        new Wall(150, 150, 200, null, null, 200),
        new Wall(150, 150, null, 200, 200),
        new Wall(200, 200, 775, null, 525),
        new Wall(150, 150, null, 200, null, 200),
    ]],
    [39, [
        new Wall(1000, 75, 300, null, 300),
        new Wall(1000, 75, null, 300, 600),
        new Wall(1000, 75, 300, null, 900),
        new Wall(1000, 75, null, 300, 1200),
        new Wall(1000, 75, 300, null, 1500),
    ]],
    [40, [
        new Wall(125, 35, 200, null, 200),
        new Wall(125, 35, null, 200, 200),
        new Wall(125, 35, null, 200, 400),
        new Wall(125, 35, 200, null, 400),
        new Wall(125, 35, null, 200, 600),
        new Wall(125, 35, 200, null, 600),
        new Wall(125, 35, null, 200, 800),
        new Wall(125, 35, 200, null, 800),
        new Wall(125, 35, 200, null, 1000),
        new Wall(125, 35, null, 200, 1000),
        new Wall(50, 900, 525, null, 200)
    ]],
    [41, [
        new Wall(35, 775, 300, null, 200),
        new Wall(800, 35, null, 200, 300),
        new Wall(800, 35, null, 200, 600),
        new Wall(800, 35, null, 200, 900),
    ]],
    [42, [
        new Wall(800, 100, 0, null, 200),
        new Wall(800, 100, 0, null, null, 200),
        new Wall(800, 100, null, 0, 200),
        new Wall(800, 100, null, 0, null, 200),
        new Wall(35, 700, 300, null, 650),
        new Wall(35, 700, 600, null, 650),
        new Wall(35, 700, 900, null, 650),
        new Wall(35, 700, 1200, null, 650),
        new Wall(35, 700, 1500, null, 650),
    ]],
    [43, [
        new Wall(700, 40, 0, null, 300),
        new Wall(700, 40, null, 0, 600),
        new Wall(40, 325, null, 250, 0),
        new Wall(40, 325, 250, null, null, 0)
    ]],
    [44, [
        new Wall(350, 35, 0, null, 300),
        new Wall(50, 50, 300, null, 500),
        new Wall(50, 50, null, 300, 500),
        new Wall(350, 35, null, 0, 800),
        new Wall(50, 50, 300, null, 1000),
        new Wall(50, 50, null, 300, 1000),
        new Wall(350, 35, 0, null, 1300),
        new Wall(50, 50, 300, null, 1600),
        new Wall(50, 50, null, 300, 1600),
    ]],
    [45, [
        new Wall(100, 100, 400, null, 200),
        new Wall(100, 100, 400, null, null, 200),
    ]],
    [46, [
        new Wall(50, 1250, 300, null, 300),
        new Wall(50, 1250, null, 300, 300),
        new Wall(35, 35, 100, null, 300),
        new Wall(35, 35, null, 100, 300),
        new Wall(35, 35, 100, null, 700),
        new Wall(35, 35, null, 100, 700),
        new Wall(35, 35, 100, null, 1100),
        new Wall(35, 35, null, 100, 1100),
        new Wall(35, 35, 100, null, 1400),
        new Wall(35, 35, null, 100, 1400),
    ]],
    [47, [
        new Wall(175, 175, 200, null, 300),
        new Wall(175, 175, null, 200, 300),
        new Wall(175, 175, 200, null, null, 300),
        new Wall(175, 175, null, 200, null, 300),
        new Wall()
    ]],
    [48, [
        new Wall(35, 225, 300, null, 200),
        new Wall(35, 225, 300, null, null, 200),
        new Wall(35, 225, 635, null, 200),
        new Wall(35, 225, 635, null, null, 200),
        new Wall(35, 225, 970, null, 200),
        new Wall(35, 225, 970, null, null, 200),
        new Wall(375, 35, null, 300, 200),
        new Wall(375, 35, null, 300, 400),
        new Wall(375, 35, null, 300, null, 200),
        new Wall(375, 35, null, 300, null, 400),
    ]],
    [49, [
        new Wall(35, 1825, 300, null, 200),
        new Wall(35, 1825, null, 300, 200),
        new Wall(275, 35, 550, null, 200),
        new Wall(275, 35, 550, null, null, 200),
        new Wall(275, 35, 550, null, 400),
        new Wall(275, 35, 550, null, null, 400),
        new Wall(275, 35, 550, null, 600),
        new Wall(275, 35, 550, null, null, 600),
        new Wall(275, 35, 550, null, 800),
        new Wall(275, 35, 550, null, null, 800),
        new Wall(275, 35, 550, null, 1000),
        new Wall(275, 35, 550, null, null, 1000),
    ]],
    [50, [
        new Wall(70, 70, 150, null, 150),
        new Wall(70, 70, 300, null, 300),
        new Wall(70, 70, 450, null, 450),
        new Wall(70, 70, 600, null, 600),
        new Wall(70, 70, 900, null, 600),
        new Wall(70, 70, 1050, null, 450),
        new Wall(70, 70, 1200, null, 300),
        new Wall(70, 70, 1350, null, 150),
    ]],
    [51, [
        new Wall(500, 35, 0, null, 200),
        new Wall(35, 500, null, 200, 200),
        new Wall(500, 35, 0, null, 800),
        new Wall(35, 500, null, 200, 850),
        new Wall(500, 35, 0, null, 1400),
        new Wall(35, 500, null, 200, null, 0),
    ]],
    [52, [
        new Wall(1800, 35, 0, null, 1000),
        new Wall(1800, 35, null, 0, 800),
        new Wall(1800, 35, 0, null, 250),
        new Wall(1800, 35, null, 0, 450),
    ]],
    [53, [
        new Wall(100, 100, 200, null, 200),
        new Wall(100, 100, 200, null, null, 200),
        new Wall(100, 100, null, 200, 200),
        new Wall(100, 100, null, 200, null, 200),
        new Wall(100, 100, 600, null, 200),
        new Wall(100, 100, 600, null, null, 200),
        new Wall(100, 100, null, 600, 200),
        new Wall(100, 100, null, 600, null, 200),
        new Wall(100, 100, 1000, null, 200),
        new Wall(100, 100, 1000, null, null, 200),
        new Wall(100, 100, null, 1000, 200),
        new Wall(100, 100, null, 1000, null, 200),
        new Wall(2000, 35, 250, null, 500),
        new Wall(2000, 35, 250, null, null, 500),
    ]],
    [54, [
        new Wall(35, 600, 250, null, 0),
        new Wall(35, 600, 1400, null, 0),
        new Wall(35, 600, 825, null, null, 0),
    ]],
    [55, [
        new Wall(50, 1000, 200, null, 0),
        new Wall(50, 1000, null, 200, null, 0),
    ]],
    [56, [
        new Wall(200, 500, null, 0, 250),
        new Wall(400, 35, 0, null, 300),
        new Wall(400, 35, 0, null, null, 300),
    ]],
    [57, [
        new Wall(50, 50, 200, null, 200),
        new Wall(50, 50, null, 200, 200),
        new Wall(50, 50, 200, null, null, 200),
        new Wall(50, 50, null, 200, null, 200),
        new Wall(100, 400, 612.5, null, 137.5)
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
        new TopLoader(2, 100, 200, 
            new Door('Drom door', 'To: Bunker', 'dorm', 
                Progress.builder().setRenderProgress('1008')
            )
        ),
    ]],
    [2, [
        new BottomLoader(1, 100, 450),
        new TopLoader(3, 100, 450)
    ]],
    [3, [
        new BottomLoader(2, 100, 450),
        new TopLoader(4, 100, 450),
    ]],
    [4, [
        new BottomLoader(3, 100, 400),
        new LeftLoader(5, 200, 200)
    ]],
    [5, [
        new RightLoader(4, 200, 200),
        new LeftLoader(6, 100, 250)
    ]],
    [6, [
        new RightLoader(5, 100, 450),
        new TopLoader(7, 200, 900)
    ]],
    [7, [
        new BottomLoader(6, 200, 900),
        new RightLoader(8, 100, 450),
        new LeftLoader(9, 100, 450),
        new TopLoader(10, 200, 900)
    ]],
    [8, [
        new LeftLoader(7, 100, 200)
    ]],
    [9, [
        new RightLoader(7, 100, 550)
    ]],
    [10, [
        new BottomLoader(7, 200, 400),
        new TopLoader(11, 200, 400)
    ]],
    [11, [
        new BottomLoader(10, 200, 0),
        new TopLoader(12, 200, 2800)
    ]],
    [12, [
        new RightLoader(18, 150, 300),
        new RightLoader(19, 150, 750),
        new BottomLoader(11, 200, 500),
        new LeftLoader(21, 150, 300),
        new LeftLoader(20, 150, 750),
        new TopLoader(13, 200, 500)
    ]],
    [13, [
        new BottomLoader(12, 200, 0),
        new TopLoader(14, 200, 0)
    ]],
    [14, [
        new BottomLoader(13, 200, 0),
        new TopLoader(15, 200, 0)
    ]],
    [15, [
        new BottomLoader(14, 200, 0),
        new TopLoader(16, 200, 0)
    ]],
    [16, [
        new BottomLoader(15, 200, 400),
        new TopLoader(17, 200, 400)
    ]],
    [17, [
        new BottomLoader(16, 200, 0)
    ]],
    [18, [
        new LeftLoader(12, 150, 850),
        new TopLoader(22, 150, 850)
    ]],
    [19, [
        new LeftLoader(12, 150, 0),
        new RightLoader(26, 150, 0),
        new BottomLoader(27, 150, 850)
    ]],
    [20, [
        new RightLoader(12, 150, 0),
        new BottomLoader(28, 150, 0)
    ]],
    [21, [
        new RightLoader(12, 150, 425),
        new LeftLoader(32, 150, 0),
        new LeftLoader(31, 150, 150 + 400/3),
        new LeftLoader(30, 150, 300 + 800/3),
        new LeftLoader(29, 150, 450 + 1200/3)
    ]],
    [22, [
        new BottomLoader(18, 150, 0),
        new TopLoader(23, 100, 450),
        new RightLoader(24, 100, 0),
        new RightLoader(25, 100, 900)
    ]],
    [23, [
        new BottomLoader(22, 100, 1100),
        new TopLoader(33, 100, 225),
        new TopLoader(34, 100, 550),
        new TopLoader(35, 100, 875),
    ]],
    [24, [
        new LeftLoader(22, 100, 550),
        new RightLoader(36, 150, 300),
        new RightLoader(37, 150, 750)
    ]],
    [25, [
        new LeftLoader(22, 100, 700),
        new BottomLoader(40, 100, 300),
        new BottomLoader(39, 100, 700),
        new BottomLoader(38, 100, 1100),
    ]],
    [26, [
        new LeftLoader(19, 150, 475),
        new TopLoader(41, 200, 900),
        new RightLoader(42, 200, 400),
        new BottomLoader(43, 200, 900)
    ]],
    [27, [
        new TopLoader(19, 150, 300),
        new BottomLoader(44, 150, 300),
    ]],
    [28, [
        new TopLoader(20, 150, 325),
        new LeftLoader(49, 250, 500),
        new LeftLoader(48, 250, 1250),
        new BottomLoader(47, 250, 275),
        new RightLoader(45, 250, 500),
        new RightLoader(46, 250, 1250),
    ]],
    [29, [
        new RightLoader(21, 150, 275),
        new BottomLoader(51, 100, 400),
        new BottomLoader(50, 100, 900),
    ]],
    [30, [
        new RightLoader(21, 150, 850),
        new LeftLoader(52, 200, 0)
    ]],
    [31, [
        new RightLoader(21, 150, 0),
        new LeftLoader(53, 250, 850),
        new LeftLoader(54, 250, 300),
        new TopLoader(55, 200, 0)
    ]],
    [32, [
        new RightLoader(21, 150, 800),
        new TopLoader(56, 100, 100),
        new TopLoader(57, 100, 600)
    ]],
    [33, [
        new BottomLoader(23, 100, 200),
    ]],
    [34, [
        new BottomLoader(23, 100, 1200),
    ]],
    [35, [
        new BottomLoader(23, 100, 0),
    ]],
    [36, [
        new LeftLoader(24, 150, 312.5),
    ]],
    [37, [
        new LeftLoader(24, 150, 225),
    ]],
    [38, [
        new TopLoader(25, 100, 825)
    ]],
    [39, [
        new TopLoader(25, 100, 300),
    ]],
    [40, [
        new TopLoader(25, 100, 1000)
    ]],
    [41, [
        new BottomLoader(26, 200, 300)
    ]],
    [42, [
        new LeftLoader(26, 200, 900),
    ]],
    [43, [
        new TopLoader(26, 200, 100)
    ]],
    [44, [
        new TopLoader(27, 150, 425),
    ]],
    [45, [
        new LeftLoader(28, 250, 550),
    ]],
    [46, [
        new LeftLoader(28, 250, 100)
    ]],
    [47, [
        new TopLoader(28, 250, 450),
    ]],
    [48, [
        new RightLoader(28, 250, 100)
    ]],
    [49, [
        new RightLoader(28, 250, 400),
    ]],
    [50, [
        new TopLoader(29, 100, 200)
    ]],
    [51, [
        new TopLoader(29, 100, 200),
    ]],
    [52, [
        new RightLoader(30, 200, 525)
    ]],
    [53, [
        new RightLoader(31, 250, 100)
    ]],
    [54, [
        new RightLoader(31, 250, 275),
    ]],
    [55, [
        new BottomLoader(31, 200, 300)
    ]],
    [56, [
        new BottomLoader(32, 100, 900),
    ]],
    [57, [
        new BottomLoader(32, 125, 600)
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
    Array.from(    
        [[
            new Note(125, 850, "Prisoner's memo", "Memories of a prisoner", "It's been 2 days since I'm here. I'm so hungry and there's no one responsible for this mess. I don't know what happened. All I remember was my normal life. And now I'm here, alone.... Why would this happen? I don't even know if I'm kidnapped by a criminal or arrested by law. Even then I would have contacted someone by now. The door's key is on the ground, so I can get out whenever I want, but the outdoors is terrifying. It's so dark and I think there's a predator past these doors. I can hear it breathing every now and then. I might have to get out of here and face it, or else I would starve to death...",
                Progress.builder().setRenderProgress('1002').setProgress2Active('1003').setOnExamineProgress2Active('1004')
            ),
            new KeyDrop(400, 850, 1, 'Dorm key', 'Key for the dormitory', 'dorm', 
                Progress.builder().setRenderProgress('1005').setProgress2Active('1006')
            ),
        ]]
    )
    .map(arr => arr.filter(int => int.difficulties.includes(getDifficulty())))
    .forEach((arr, index) => interactablesMap.set(index + 1, arr))
    return interactablesMap
}

// **********************************************************************************
// **********************************************************************************
// Dialogues
// **********************************************************************************
// **********************************************************************************

export const dialogues = [
    new Dialogue('Where the hell am I?', sources.MAIN, 
        Progress.builder().setRenderProgress('1000').setProgress2Active('1001')
    ),
    new Dialogue('What the ..., I gotta find that key.', sources.MAIN, 
        Progress.builder().setRenderProgress('1004').setProgress2Active('1005')
    ),
    new Dialogue('There it is.', sources.MAIN, 
        Progress.builder().setRenderProgress('1006').setProgress2Active('1007')
    ),
]

// **********************************************************************************
// **********************************************************************************
// Popus
// **********************************************************************************
// **********************************************************************************

export const popups = [
    new Popup('<span>W</span> <span>A</span> <span>S</span> <span>D</span> Move', 
        Progress.builder().setRenderProgress('1001').setProgress2Active('1002'), 3000
    ),
    new Popup('<span>F</span> Interact',
        Progress.builder().setRenderProgress('1002')
    ),
    new Popup('<span>Tab</span> Open inventory', 
        Progress.builder().setRenderProgress('1003')
    ),
    new Popup('Use the key from inventory to open the door.', 
        Progress.builder().setRenderProgress('1007')
    ),
]