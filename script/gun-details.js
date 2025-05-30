import {
    ARCTIC_WARFERE,
    BENELLI_M4,
    GLOCK,
    M1911,
    MAUSER,
    MP5K,
    P90,
    PARKER_HALE_M_85,
    PPSH,
    REMINGTON_1858,
    REMINGTON_870,
    REVOLVER,
    SPAS,
    STEYR_SSG_69,
    UZI,
} from './loot.js'
import { getIsSurvival, getRoundsFinished } from './variables.js'

class Gun {
    constructor(
        heading,
        ammotype,
        height,
        color,
        antivirus,
        space,
        damage,
        range,
        reloadspeed,
        magazine,
        firerate,
        description,
        price,
        knock,
        survivalDamage,
    ) {
        this.heading = heading
        this.ammotype = ammotype
        this.height = height
        this.color = color
        this.antivirus = antivirus
        this.space = space
        this.damage = damage.map(item => item * (getRoundsFinished() + 1))
        this.range = range
        this.reloadspeed = reloadspeed
        this.magazine = magazine
        this.firerate = firerate
        this.description = description
        this.price = price
        this.knock = knock
        this.survivalDamage = survivalDamage
    }
}

export const getGunDetail = (gunName, detail) => gunDetails.get(gunName)[detail]

export const getGunUpgradableDetail = (gunName, detail, detailLevel) => {
    if (getIsSurvival() && detail === 'damage')
        return (
            gunDetails.get(gunName).survivalDamage.base +
            gunDetails.get(gunName).survivalDamage.step * (detailLevel - 1)
        )

    return gunDetails.get(gunName)[detail][detailLevel - 1]
}

const gunDetails = new Map([
    [
        REMINGTON_1858,
        new Gun(
            'remington 1858',
            'magnumAmmo',
            16,
            'lightgray',
            'blue',
            2,
            [1000, 1375, 1800, 2275, 2800],
            [300, 350, 400, 450, 500],
            [5, 4.5, 4, 3.5, 3],
            [5, 6, 7, 8, 9],
            [2, 1.9, 1.8, 1.7, 1.6],
            'A powerful magnum handy in very special scenarios',
            100,
            250,
            {
                base: 1000,
                step: 375,
            },
        ),
    ],
    [
        REVOLVER,
        new Gun(
            'revolver',
            'magnumAmmo',
            14,
            'gray',
            'purple',
            2,
            [750, 1122, 1548, 2028, 2562],
            [325, 400, 475, 550, 625],
            [4.5, 4.1, 3.7, 3.3, 2.9],
            [6, 7, 8, 9, 10],
            [2.2, 2.1, 2, 1.9, 1.8],
            'A magnum capable of tearing through every living creature',
            90,
            200,
            {
                base: 750,
                step: 372,
            },
        ),
    ],
    [
        MAUSER,
        new Gun(
            'mauser',
            'pistolAmmo',
            12,
            'darkgray',
            'red',
            1,
            [30, 49, 72, 98, 126],
            [400, 475, 550, 750, 800],
            [3.2, 2.7, 2.2, 1.7, 1.2],
            [7, 9, 11, 13, 15],
            [2, 1.75, 1.5, 1.25, 1],
            'A high damage handgun making it a nice choice for every avid gun collector',
            15,
            50,
            {
                base: 30,
                step: 22,
            },
        ),
    ],
    [
        GLOCK,
        new Gun(
            'glock',
            'pistolAmmo',
            10,
            'black',
            'green',
            1,
            [18, 33, 52, 75, 102],
            [800, 850, 900, 950, 1000],
            [1.6, 1.5, 1.4, 1.3, 1.2],
            [10, 11, 12, 13, 14],
            [1.3, 1.2, 1.1, 1, 0.9],
            'Small and fast paced pistol with a pretty decent range',
            14,
            50,
            {
                base: 18,
                step: 20,
            },
        ),
    ],
    [
        M1911,
        new Gun(
            'm 1911',
            'pistolAmmo',
            12,
            'lightgray',
            'yellow',
            1,
            [20, 35, 52, 73, 99],
            [700, 725, 750, 775, 800],
            [1.6, 1.5, 1.4, 1.3, 1.2],
            [12, 14, 16, 18, 20],
            [1.2, 1.1, 1, 0.9, 0.8],
            'A handgun with a clip capacity that barely makes you think of reloading',
            13,
            50,
            {
                base: 20,
                step: 18,
            },
        ),
    ],
    [
        MP5K,
        new Gun(
            'mp5k',
            'smgAmmo',
            12,
            'black',
            'green',
            2,
            [13, 20, 27, 36, 45],
            [500, 525, 550, 575, 600],
            [2.4, 2.2, 2, 1.8, 1.6],
            [20, 25, 30, 35, 40],
            [0.14, 0.13, 0.12, 0.11, 0.1],
            'Pretty balanced SMG useful for most cases',
            24,
            25,
            {
                base: 13,
                step: 7,
            },
        ),
    ],
    [
        P90,
        new Gun(
            'p90',
            'smgAmmo',
            14,
            'gray',
            'yellow',
            2,
            [14, 22, 31, 41, 52],
            [450, 480, 510, 540, 570],
            [1.8, 1.7, 1.6, 1.5, 1.4],
            [40, 50, 60, 70, 80],
            [0.15, 0.14, 0.13, 0.12, 0.11],
            'An SMG with high damage and huge capacity.',
            23,
            25,
            {
                base: 14,
                step: 8,
            },
        ),
    ],
    [
        PPSH,
        new Gun(
            'ppsh',
            'smgAmmo',
            12,
            'darkgray',
            'blue',
            2,
            [12, 19, 26, 33, 42],
            [550, 575, 600, 625, 650],
            [2.1, 1.8, 1.5, 1.2, 0.9],
            [30, 40, 50, 60, 70],
            [0.13, 0.12, 0.11, 0.1, 0.09],
            'Decent range, fast reload and fire rate are the greatest highlights of this weapon',
            22,
            25,
            {
                base: 12,
                step: 6,
            },
        ),
    ],
    [
        UZI,
        new Gun(
            'uzi',
            'smgAmmo',
            10,
            'lightgray',
            'purple',
            1,
            [10, 15, 20, 26, 32],
            [450, 475, 500, 525, 550],
            [1.4, 1.2, 1, 0.8, 0.6],
            [50, 60, 70, 80, 90],
            [0.13, 0.11, 0.09, 0.07, 0.05],
            'The insane fire rate and reload speed make up for its low damage',
            21,
            25,
            {
                base: 12,
                step: 5,
            },
        ),
    ],
    [
        REMINGTON_870,
        new Gun(
            'remington 870',
            'shotgunShells',
            16,
            'gray',
            'red',
            3,
            [100, 195, 320, 475, 660],
            [300, 375, 450, 525, 600],
            [3, 2.7, 2.4, 2.1, 1.8],
            [5, 7, 9, 11, 12],
            [2.5, 2.3, 2.1, 1.9, 1.7],
            'Long range shotgun suitable for dealing high damage from afar',
            35,
            400,
            {
                base: 100,
                step: 100,
            },
        ),
    ],
    [
        BENELLI_M4,
        new Gun(
            'benelli m4',
            'shotgunShells',
            16,
            'lightgray',
            'blue',
            3,
            [200, 325, 480, 665, 880],
            [200, 230, 260, 290, 320],
            [2.7, 2.5, 2.3, 2.1, 1.9],
            [5, 6, 7, 8, 9],
            [1.2, 1.1, 1, 0.9, 0.8],
            'A real boomstick ideal for shredding everything on its way',
            70,
            350,
            {
                base: 200,
                step: 125,
            },
        ),
    ],
    [
        SPAS,
        new Gun(
            'spas',
            'shotgunShells',
            12,
            'gray',
            'purple',
            2,
            [80, 156, 256, 380, 528],
            [150, 200, 250, 300, 350],
            [4, 3.5, 3, 2.5, 2],
            [14, 16, 18, 20, 22],
            [0.9, 0.8, 0.7, 0.6, 0.5],
            'An automatic shotgun with an insane fire rate and magazine capacity',
            50,
            300,
            {
                base: 80,
                step: 75,
            },
        ),
    ],
    [
        ARCTIC_WARFERE,
        new Gun(
            'arctic warfare',
            'rifleAmmo',
            16,
            'darkgray',
            'red',
            3,
            [500, 720, 980, 1280, 1620],
            [650, 700, 750, 800, 850],
            [5, 4.4, 3.8, 3.2, 2.6],
            [4, 6, 8, 10, 12],
            [2.4, 2.2, 2, 1.8, 1.6],
            'Slow paced sniper rifle focused primarily on dealing damage',
            65,
            200,
            {
                base: 500,
                step: 220,
            },
        ),
    ],
    [
        PARKER_HALE_M_85,
        new Gun(
            'parker hale m 85',
            'rifleAmmo',
            18,
            'black',
            'green',
            3,
            [300, 480, 700, 960, 1260],
            [550, 600, 650, 700, 750],
            [2.5, 2.1, 1.7, 1.3, 0.9],
            [12, 14, 16, 18, 20],
            [1.2, 1, 0.8, 0.6, 0.4],
            'A sniper rifle with incredibly fast fire rate making it one of a kind',
            75,
            100,
            {
                base: 300,
                step: 180,
            },
        ),
    ],
    [
        STEYR_SSG_69,
        new Gun(
            'steyr ssg 69',
            'rifleAmmo',
            14,
            'lightgray',
            'yellow',
            3,
            [400, 600, 840, 1120, 1440],
            [600, 650, 700, 750, 800],
            [3.25, 2.75, 2.25, 1.75, 1.25],
            [8, 9, 10, 11, 12],
            [1.8, 1.6, 1.5, 1.4, 1.2],
            'Sniper rifle with the most balanced stats possible',
            70,
            150,
            {
                base: 400,
                step: 200,
            },
        ),
    ],
])

export const getGunDetails = () => gunDetails

export const isGun = name => gunDetails.has(name)
