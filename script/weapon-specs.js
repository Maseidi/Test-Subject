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
        "1858",
        12,
        "lightgray",
        "blue",
        false
    )],
    ["revolver", new Weapon(
        "1858",
        10,
        "lightgray",
        "purple",
        false
    )],
    ["mauser", new Weapon(
        "1858",
        8,
        "lightgray",
        "red",
        false
    )],
    ["pistol", new Weapon(
        "1858",
        6,
        "lightgray",
        "green",
        false
    )],
    ["pistol2", new Weapon(
        "1858",
        8,
        "lightgray",
        "yellow",
        false
    )],
    ["pistol3", new Weapon(
        "1858",
        6,
        "lightgray",
        "blue",
        false
    )],
    ["pistol4", new Weapon(
        "1858",
        8,
        "lightgray",
        "purple",
        false
    )],
    ["famas", new Weapon(
        "1858",
        10,
        "lightgray",
        "red",
        true
    )],
    ["mp5k", new Weapon(
        "1858",
        8,
        "lightgray",
        "green",
        true
    )],
    ["p90", new Weapon(
        "1858",
        10,
        "lightgray",
        "yellow",
        true
    )],
    ["ppsh", new Weapon(
        "1858",
        8,
        "lightgray",
        "blue",
        true
    )],
    ["uzi", new Weapon(
        "1858",
        6,
        "lightgray",
        "purple",
        true
    )],
    ["shotgun", new Weapon(
        "1858",
        12,
        "lightgray",
        "red",
        false
    )],
    ["shotgun2", new Weapon(
        "1858",
        14,
        "lightgray",
        "green",
        false
    )],
    ["shotgun3", new Weapon(
        "1858",
        10,
        "lightgray",
        "yellow",
        false
    )],
    ["riotgun", new Weapon(
        "1858",
        12,
        "lightgray",
        "blue",
        false
    )],
    ["spas", new Weapon(
        "1858",
        8,
        "lightgray",
        "purple",
        false
    )],
    ["sniper", new Weapon(
        "1858",
        12,
        "lightgray",
        "red",
        false
    )],
    ["sniper2", new Weapon(
        "1858",
        14,
        "lightgray",
        "green",
        false
    )],
    ["sniper3", new Weapon(
        "1858",
        10,
        "lightgray",
        "yellow",
        false
    )]
])