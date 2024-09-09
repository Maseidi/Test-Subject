class Weapon {
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
        price) {
        this.heading =     heading
        this.ammotype =    ammotype
        this.height =      height
        this.color =       color
        this.antivirus =   antivirus
        this.space =       space
        this.damage =      damage
        this.range =       range
        this.reloadspeed = reloadspeed
        this.magazine =    magazine
        this.firerate =    firerate
        this.description = description
        this.price =       price
    }
}

export const getWeaponDetail = (weaponName, detail) => weaponDetails.get(weaponName)[detail]

export const getWeaponUpgradableDetail = (weaponName, detail, detailLevel) => 
    weaponDetails.get(weaponName)[detail][detailLevel - 1]

const weaponDetails = new Map([
    ['remington1858', new Weapon(
        'remington 1858',
        'magnumAmmo',
        16,
        'lightgray',
        'blue',
        2,
        [1000, 1250, 1500, 1750, 2000],
        [300, 350, 400, 450, 500],
        [5, 4.5, 4, 3.5, 3],
        [5, 6, 7, 8, 9],
        [2, 1.9, 1.8, 1.7, 1.6],
        'A powerful magnum handy in very special scenarios',
        100,
    )],
    ['revolver', new Weapon(
        'revolver',
        'magnumAmmo',
        14,
        'gray',
        'purple',
        1,
        [750, 1020, 1290, 1560, 1830],
        [325, 400, 475, 550, 625],
        [4.5, 4.1, 3.7, 3.3, 2.9],
        [6, 7, 8, 9, 10],
        [2.2, 2.1, 2, 1.9, 1.8],
        'A magnum capable of tearing through every living creature',
        90,
    )],
    ['mauser', new Weapon(
        'mauser',
        'pistolAmmo',
        12,
        'darkgray',
        'red',
        1,
        [30, 33, 36, 39, 42],
        [600, 650, 700, 750, 800],
        [3.2, 2.7, 2.2, 1.7, 1.2],
        [7, 9, 11, 13, 15],
        [2, 1.75, 1.5, 1.25, 1],
        'A high damage handgun making it a nice choice for every avid gun collector',
        15,
    )],
    ['pistol', new Weapon(
        'pistol',
        'pistolAmmo',
        10,
        'black',
        'green',
        1,
        [18, 22, 26, 30, 34],
        [800, 850, 900, 950, 1000],
        [1.6, 1.5, 1.4, 1.3, 1.2],
        [10, 11, 12, 13, 14],
        [1.3, 1.2, 1.1, 1, 0.9],
        'Small and fast paced pistol with a pretty decent range',
        14,
    )],
    ['pistol2', new Weapon(
        'pistol 2',
        'pistolAmmo',
        12,
        'lightgray',
        'yellow',
        1,
        [20, 23, 26, 29, 33],
        [700, 725, 750, 775, 800],
        [1.6, 1.5, 1.4, 1.3, 1.2],
        [12, 14, 16, 18, 20],
        [1.2, 1.1, 1, 0.9, 0.8],
        'A handgun with a clip capacity that barely makes you think of reloading',
        13,
    )],
    ['pistol3', new Weapon(
        'pistol 3',
        'pistolAmmo',
        10,
        'gray',
        'blue',
        2,
        [12, 18, 24, 30, 36],
        [900, 920, 940, 960, 980],
        [1.8, 1.5, 1.2, 0.9, 0.6],
        [11, 12, 13, 14, 15],
        [1.4, 1.2, 1, 0.8, 0.6],
        'A pistol that every tiny bit of upgrade is definately a profitable move',
        12,
    )],
    ['pistol4', new Weapon(
        'pistol 4',
        'pistolAmmo',
        12,
        'darkgray',
        'purple',
        1,
        [29, 30, 31, 32, 33],
        [575, 650, 725, 800, 875],
        [2.2, 2, 1.8, 1.6, 1.4],
        [14, 15, 16, 17, 18],
        [1.6, 1.5, 1.4, 1.3, 1.2],
        'The handgun every single person never thinks of upgrading its damage',
        11,
    )],
    ['famas', new Weapon(
        'famas',
        'smgAmmo',
        14,
        'lightgray',
        'red',
        2,
        [19, 21, 23, 25, 27],
        [400, 450, 500, 550, 600],
        [3, 2.6, 2.2, 1.8, 1.4],
        [30, 35, 40, 45, 50],
        [0.2, 0.19, 0.18, 0.17, 0.16],
        'Sub-machine gun purely focused on dealing the most possible damage',
        25,
    )],
    ['mp5k', new Weapon(
        'mp5k',
        'smgAmmo',
        12,
        'black',
        'green',
        2,
        [13, 14, 15, 16, 17],
        [500, 525, 550, 575, 600],
        [2.4, 2.2, 2, 1.8, 1.6],
        [20, 25, 30, 35, 40],
        [0.14, 0.13, 0.12, 0.11, 0.1],
        'Pretty balanced SMG useful for most cases',
        24,
    )],
    ['p90', new Weapon(
        'p90',
        'smgAmmo',
        14,
        'gray',
        'yellow',
        2,
        [14, 15.5, 17, 18.5, 20],
        [450, 480, 510, 540, 570],
        [1.8, 1.7, 1.6, 1.5, 1.4],
        [40, 50, 60, 70, 80],
        [0.15, 0.14, 0.13, 0.12, 0.11],
        "Decent damage and magazine capacity are this weapon's points of shine",
        23,
    )],
    ['ppsh', new Weapon(
        'ppsh',
        'smgAmmo',
        12,
        'darkgray',
        'blue',
        2,
        [12, 13, 14, 15, 16],
        [550, 575, 600, 625, 650],
        [2.1, 1.8, 1.5, 1.2, 0.9],
        [30, 40, 50, 60, 70],
        [0.13, 0.12, 0.11, 0.1, 0.09],
        'Decent range, fast reload and fire rate are the greatest highlights of this weapon',
        22,
    )],
    ['uzi', new Weapon(
        'uzi',
        'smgAmmo',
        10,
        'lightgray',
        'purple',
        1,
        [10, 10.5, 11, 11.5, 12],
        [450, 475, 500, 525, 550],
        [1.4, 1.2, 1, 0.8, 0.6],
        [50, 60, 70, 80, 90],
        [0.13, 0.11, 0.09, 0.07, 0.05],
        'The insane fire rate and reload speed make up for its low damage',
        21,
    )],
    ['shotgun', new Weapon(
        'shotgon',
        'shotgunShells',
        16,
        'gray',
        'red',
        2,
        [100, 150, 200, 250, 300],
        [300, 375, 450, 525, 600],
        [3, 2.7, 2.4, 2.1, 1.8],
        [5, 7, 9, 11, 12],
        [2.5, 2.3, 2.1, 1.9, 1.7],
        'Long range shotgun suitable for dealing high damage from afar',
        35,
    )],
    ['shotgun2', new Weapon(
        'shotgun 2',
        'shotgunShells',
        18,
        'darkgray',
        'green',
        2,
        [120, 180, 240, 300, 360],
        [250, 300, 350, 400, 450],
        [3.5, 3.1, 2.7, 2.3, 1.9],
        [7, 8, 9, 10, 11],
        [2.3, 2.1, 1.9, 1.7, 1.5],
        'Balanced shotgun for everyday use',
        40,
    )],
    ['shotgun3', new Weapon(
        'shotgun 3',
        'shotgunShells',
        14,
        'black',
        'yellow',
        2,
        [160, 200, 240, 280, 320],
        [275, 318, 400, 463, 525],
        [2.5, 2.3, 2.1, 1.9, 1.7],
        [6, 8, 10, 12, 14],
        [1.7, 1.6, 1.5, 1.4, 1.3],
        "This shotgun's decent damage and range is enough to make your lucky day",
        45,
    )],
    ['riotgun', new Weapon(
        'riotgun',
        'shotgunShells',
        16,
        'lightgray',
        'blue',
        3,
        [200, 250, 300, 350, 400],
        [200, 230, 260, 290, 320],
        [2.7, 2.5, 2.3, 2.1, 1.9],
        [5, 6, 7, 8, 9],
        [1.2, 1.1, 1, 0.9, 0.8],
        'A real boomstick ideal for shredding everything on its way',
        70,
    )],
    ['spas', new Weapon(
        'spas',
        'shotgunShells',
        12,
        'gray',
        'purple',
        2,
        [80, 120, 160, 200, 240],
        [150, 200, 250, 300, 350],
        [4, 3.5, 3, 2.5, 2],
        [14, 16, 18, 20, 22],
        [0.9, 0.8, 0.7, 0.6, 0.5],
        'An automatic shotgun with an insane fire rate and magazine capacity',
        50,
    )],
    ['sniper', new Weapon(
        'sniper',
        'rifleAmmo',
        16,
        'darkgray',
        'red',
        2,
        [500, 600, 700, 800, 900],
        [650, 700, 750, 800, 850],
        [5, 4.4, 3.8, 3.2, 2.6],
        [4, 6, 8, 10, 12],
        [2.4, 2.2, 2, 1.8, 1.6],
        'Slow paced sniper rifle focused primarily on dealing damage',
        65,
    )],
    ['sniper2', new Weapon(
        'sniper 2',
        'rifleAmmo',
        18,
        'black',
        'green',
        3,
        [300, 400, 500, 600, 700],
        [550, 600, 650, 700, 750],
        [2.5, 2.1, 1.7, 1.3, 0.9],
        [12, 14, 16, 18, 20],
        [1.2, 1, 0.8, 0.6, 0.4],
        'A sniper rifle with incredibly fast fire rate making it one of a kind',
        75,
    )],
    ['sniper3', new Weapon(
        'sniper 3',
        'rifleAmmo',
        14,
        'lightgray',
        'yellow',
        3,
        [400, 500, 600, 700, 800],
        [600, 650, 700, 750, 800],
        [3.25, 2.75, 2.25, 1.75, 1.25],
        [8, 9, 10, 11, 12],
        [1.8, 1.6, 1.5, 1.4, 1.2],
        'Sniper rifle with the most balanced stats possible',
        70,
    )]
])

export const getWeaponDetails = () => weaponDetails

export const isWeapon = (name) => weaponDetails.has(name)