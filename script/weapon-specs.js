class Weapon {
    constructor(
        ammoType,
        height,
        color,
        antiVirus,
        automatic,
        space) {
        this.ammoType = ammoType
        this.height = height
        this.color = color
        this.antiVirus = antiVirus
        this.automatic = automatic
        this.space = space
    }
}

const weapons = new Map([
    ["remington1858", new Weapon(
        "magnumAmmo",
        12,
        "lightgray",
        "blue",
        false,
        2
    )],
    ["revolver", new Weapon(
        "magnumAmmo",
        10,
        "lightgray",
        "purple",
        false,
        1
    )],
    ["mauser", new Weapon(
        "pistolAmmo",
        8,
        "lightgray",
        "red",
        false,
        1
    )],
    ["pistol", new Weapon(
        "pistolAmmo",
        6,
        "lightgray",
        "green",
        false,
        1
    )],
    ["pistol2", new Weapon(
        "pistolAmmo",
        8,
        "lightgray",
        "yellow",
        false,
        1
    )],
    ["pistol3", new Weapon(
        "pistolAmmo",
        6,
        "lightgray",
        "blue",
        false,
        1
    )],
    ["pistol4", new Weapon(
        "pistolAmmo",
        8,
        "lightgray",
        "purple",
        false,
        1
    )],
    ["famas", new Weapon(
        "smgAmmo",
        10,
        "lightgray",
        "red",
        true,
        2
    )],
    ["mp5k", new Weapon(
        "smgAmmo",
        8,
        "lightgray",
        "green",
        true,
        1
    )],
    ["p90", new Weapon(
        "smgAmmo",
        10,
        "lightgray",
        "yellow",
        true,
        1
    )],
    ["ppsh", new Weapon(
        "smgAmmo",
        8,
        "lightgray",
        "blue",
        true,
        1
    )],
    ["uzi", new Weapon(
        "smgAmmo",
        6,
        "lightgray",
        "purple",
        true,
        1
    )],
    ["shotgun", new Weapon(
        "shotgunShells",
        12,
        "lightgray",
        "red",
        false,
        2
    )],
    ["shotgun2", new Weapon(
        "shotgunShells",
        14,
        "lightgray",
        "green",
        false,
        2
    )],
    ["shotgun3", new Weapon(
        "shotgunShells",
        10,
        "lightgray",
        "yellow",
        false,
        2
    )],
    ["riotgun", new Weapon(
        "shotgunShells",
        12,
        "lightgray",
        "blue",
        false,
        3
    )],
    ["spas", new Weapon(
        "shotgunShells",
        8,
        "lightgray",
        "purple",
        false,
        2
    )],
    ["sniper", new Weapon(
        "rifleAmmo",
        12,
        "lightgray",
        "red",
        false,
        2
    )],
    ["sniper2", new Weapon(
        "rifleAmmo",
        14,
        "lightgray",
        "green",
        false,
        2
    )],
    ["sniper3", new Weapon(
        "rifleAmmo",
        10,
        "lightgray",
        "yellow",
        false,
        2
    )]
])

export const getWeaponSpecs = () => {
    return weapons
}