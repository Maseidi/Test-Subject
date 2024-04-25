class Weapon {
    constructor(
        height,
        bg,
        antiVirus,
        automatic,
        space) {
        this.name = name
        this.height = height
        this.bg = bg
        this.antiVirus = antiVirus
        this.automatic = automatic
        this.space = space
    }
}

export const weapons = new Map([
    ["remington-1858", new Weapon(
        12,
        "lightgray",
        "blue",
        false,
        2
    )],
    ["revolver", new Weapon(
        10,
        "lightgray",
        "purple",
        false,
        1
    )],
    ["mauser", new Weapon(
        8,
        "lightgray",
        "red",
        false,
        1
    )],
    ["pistol", new Weapon(
        6,
        "lightgray",
        "green",
        false,
        1
    )],
    ["pistol2", new Weapon(
        8,
        "lightgray",
        "yellow",
        false,
        1
    )],
    ["pistol3", new Weapon(
        6,
        "lightgray",
        "blue",
        false,
        1
    )],
    ["pistol4", new Weapon(
        8,
        "lightgray",
        "purple",
        false,
        1
    )],
    ["famas", new Weapon(
        10,
        "lightgray",
        "red",
        true,
        2
    )],
    ["mp5k", new Weapon(
        8,
        "lightgray",
        "green",
        true,
        1
    )],
    ["p90", new Weapon(
        10,
        "lightgray",
        "yellow",
        true,
        1
    )],
    ["ppsh", new Weapon(
        8,
        "lightgray",
        "blue",
        true,
        1
    )],
    ["uzi", new Weapon(
        6,
        "lightgray",
        "purple",
        true,
        1
    )],
    ["shotgun", new Weapon(
        12,
        "lightgray",
        "red",
        false,
        2
    )],
    ["shotgun2", new Weapon(
        14,
        "lightgray",
        "green",
        false,
        2
    )],
    ["shotgun3", new Weapon(
        10,
        "lightgray",
        "yellow",
        false,
        2
    )],
    ["riotgun", new Weapon(
        12,
        "lightgray",
        "blue",
        false,
        3
    )],
    ["spas", new Weapon(
        8,
        "lightgray",
        "purple",
        false,
        2
    )],
    ["sniper", new Weapon(
        12,
        "lightgray",
        "red",
        false,
        2
    )],
    ["sniper2", new Weapon(
        14,
        "lightgray",
        "green",
        false,
        2
    )],
    ["sniper3", new Weapon(
        10,
        "lightgray",
        "yellow",
        false,
        2
    )]
])