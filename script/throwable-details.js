const throwableDetails = Object.freeze({
    grenade: Object.freeze({ damage: 3000, range: 300 }),
    flashbang: Object.freeze({ damage: 0, range: 300 }),
})

export const getThrowableDetail = (name, property) => throwableDetails[name]?.[property]
