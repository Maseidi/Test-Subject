class Throwable {
    constructor(
        heading,
        damage, 
        price,
        knockback) {
        this.heading = heading
        this.space = 1
        this.damage = damage
        this.range = 300
        this.firerate = 2
        this.price = price
        this.knockback = knockback
    }
}

export const getThrowableSpec = (throwableName, statName) => throwables.get(throwableName)[statName]

const throwables = new Map([
    ['grenade', new Throwable(
        'grenade',
        3000,
        1/2,
        100
    )],
    ['flashbang', new Throwable(
        'flashbang',
        0,
        1/3,
        0
    )]
])

export const getThrowableSpecs = () => throwables