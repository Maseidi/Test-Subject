class Weapon {
    constructor(
        name,
        height,
        bg,
        antiVirus,
        automatic) {
        this.name = name
        this.height = height
        this.bg = bg
        this.antiVirus = antiVirus
        this.automatic = automatic
    }
}

export const weapons = new Map([
    ["1858", new Weapon(
        "remington-1858",
        12,
        "lightgray",
        "blue",
        false
    )],
    ["revolver", new Weapon(
        "revolver",
        10,
        "lightgray",
        "purple",
        false
    )],
    ["mauser", new Weapon(
        "mauser",
        8,
        "lightgray",
        "red",
        false
    )],
    ["pistol", new Weapon(
        "pistol",
        6,
        "lightgray",
        "green",
        false
    )],
    ["pistol2", new Weapon(
        "pistol2",
        8,
        "lightgray",
        "yellow",
        false
    )],
    ["pistol3", new Weapon(
        "pistol3",
        6,
        "lightgray",
        "blue",
        false
    )],
    ["pistol4", new Weapon(
        "pistol4",
        8,
        "lightgray",
        "purple",
        false
    )],
    ["famas", new Weapon(
        "famas",
        10,
        "lightgray",
        "red",
        true
    )],
    ["mp5k", new Weapon(
        "mp5k",
        8,
        "lightgray",
        "green",
        true
    )],
    ["p90", new Weapon(
        "p90",
        10,
        "lightgray",
        "yellow",
        true
    )],
    ["ppsh", new Weapon(
        "ppsh",
        8,
        "lightgray",
        "blue",
        true
    )],
    ["uzi", new Weapon(
        "uzi",
        6,
        "lightgray",
        "purple",
        true
    )],
    ["shotgun", new Weapon(
        "shotgun",
        12,
        "lightgray",
        "red",
        false
    )],
    ["shotgun2", new Weapon(
        "shotgun2",
        14,
        "lightgray",
        "green",
        false
    )],
    ["shotgun3", new Weapon(
        "shotgun3",
        10,
        "lightgray",
        "yellow",
        false
    )],
    ["riotgun", new Weapon(
        "riotgun",
        12,
        "lightgray",
        "blue",
        false
    )],
    ["spas", new Weapon(
        "spas",
        8,
        "lightgray",
        "purple",
        false
    )],
    ["sniper", new Weapon(
        "sniper",
        12,
        "lightgray",
        "red",
        false
    )],
    ["sniper2", new Weapon(
        "sniper2",
        14,
        "lightgray",
        "green",
        false
    )],
    ["sniper3", new Weapon(
        "sniper3",
        10,
        "lightgray",
        "yellow",
        false
    )]
])