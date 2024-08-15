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
        this.firerate = 1
        this.price = price
        this.knockback = knockback
    }
}

export const getThrowableDetail = (throwableName, statName) => throwableDetails.get(throwableName)[statName]

const throwableDetails = new Map([
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

export const getThrowableDetails = () => throwableDetails

export const isThrowable = (name) => throwableDetails.has(name)