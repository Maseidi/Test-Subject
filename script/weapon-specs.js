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
        this.area = area
        this.mass = mass
    }
}

export const weapons = new Map([
    ["1858", new Weapon(
        "1858",
        12,
        "lightgray",
        "blue",
        false,
        ["1858"],
        1.27
    )],
    ["revolver", new Weapon(
        "1858",
        10,
        "lightgray",
        "purple",
        false,
        ["revolver"],
        1.1
    )],
    ["mauser", new Weapon(
        "1858",
        8,
        "lightgray",
        "red",
        false,
        ["mauser"],
        0.9
    )],
    ["pistol", new Weapon(
        "1858",
        6,
        "lightgray",
        "green",
        ["pistol"],
        0.7,
        false
    )],
    ["pistol2", new Weapon(
        "1858",
        8,
        "lightgray",
        "yellow",
        ["pistol2"],
        0.8,
        false
    )],
    ["pistol3", new Weapon(
        "1858",
        6,
        "lightgray",
        "blue",
        ["pistol3"],
        0.75,
        false
    )],
    ["pistol4", new Weapon(
        "1858",
        8,
        "lightgray",
        "purple",
        ["pistol4"],
        0.85,
        false
    )],
    ["famas", new Weapon(
        "1858",
        10,
        "lightgray",
        "red",
        ["famas", "famas"],
        3.61,
        true
    )],
    ["mp5k", new Weapon(
        "1858",
        8,
        "lightgray",
        "green",
        ["mp5k"],
        2.5,
        true
    )],
    ["p90", new Weapon(
        "1858",
        10,
        "lightgray",
        "yellow",
        ["p90"],
        2.75,
        true
    )],
    ["ppsh", new Weapon(
        "1858",
        8,
        "lightgray",
        "blue",
        ["ppsh"],
        4.5,
        true
    )],
    ["uzi", new Weapon(
        "1858",
        6,
        "lightgray",
        "purple",
        ["uzi"],
        3.5,
        true
    )],
    ["shotgun", new Weapon(
        "1858",
        12,
        "lightgray",
        "red",
        ["shotgun", "shotgun"],
        3.2,
        false
    )],
    ["shotgun2", new Weapon(
        "1858",
        14,
        "lightgray",
        "green",
        ["shotgun2", "shotgun2"],
        3.3,
        false
    )],
    ["shotgun3", new Weapon(
        "1858",
        10,
        "lightgray",
        "yellow",
        ["shotgun3", "shotgun3"],
        3.4,
        false
    )],
    ["riotgun", new Weapon(
        "1858",
        12,
        "lightgray",
        "blue",
        ["riotgun", "riotgun"],
        3.5,
        false
    )],
    ["spas", new Weapon(
        "1858",
        8,
        "lightgray",
        "purple",
        ["spas", "spas"],
        3.6,
        false
    )],
    ["sniper", new Weapon(
        "1858",
        12,
        "lightgray",
        "red",
        ["sniper", "sniper"],
        4.5,
        false
    )],
    ["sniper2", new Weapon(
        "1858",
        14,
        "lightgray",
        "green",
        ["sniper2", "sniper2", "sniper2"],
        3.5,
        false
    )],
    ["sniper3", new Weapon(
        "1858",
        10,
        "lightgray",
        "yellow",
        ["sniper3", "sniper3"],
        4,
        false
    )]
])