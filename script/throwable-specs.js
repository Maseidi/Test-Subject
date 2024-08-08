class Throwable {
    constructor(
        heading,
        space,
        damage, 
        range, 
        firerate,
        price,
        knockback) {
        this.heading = heading
        this.space = space
        this.damage = damage
        this.range = range
        this.firerate = firerate
        this.price = price
        this.knockback = knockback
    }
}

export const getThrowableSpec = (throwableName, statName) => throwables.get(throwableName)[statName]

const throwables = new Map([
    ['grenade', new Throwable(
        'grenade',
        1,
        3000,
        300,
        2,
        1/2,
        100
    )],
    ['flashbang', new Throwable(
        'flashbang',
        1,
        0,
        300,
        2,
        1/3,
        0
    )]
])

export const getThrowableSpecs = () => throwables