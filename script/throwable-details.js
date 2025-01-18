class Throwable {
    constructor(name, damage, price) {
        this.name = name
        this.heading = name
        this.space = 1
        this.damage = damage
        this.range = 300
        this.firerate = 1
        this.price = price
    }
}

export const getThrowableDetail = (throwableName, statName) => throwableDetails.get(throwableName)[statName]

const throwableDetails = new Map([
    ['grenade', new Throwable('grenade', 3000, 1 / 2)],
    ['flashbang', new Throwable('flashbang', 0, 1 / 3)],
])

export const getThrowableDetails = () => throwableDetails

export const isThrowable = name => throwableDetails.has(name)
