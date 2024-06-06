let progress = {}

export const getProgress = (name) => progress[name]

export const activateProgress = (name) => {
    progress = {
        ...progress,
        [name]: true
    }
}