let stash = []
export const setStash = (val) => {
    stash = val
}
export const getStash = () => {
    return stash
}

export const stashHasId = (id) => {
    return stash.findIndex(item => item.id === id) !== -1
}