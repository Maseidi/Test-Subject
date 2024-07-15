export const isPlayerVisible = (enemy) => {
    let result = false
    if ( enemy.getAttribute('wall-in-the-way') !== 'false' ) return result
    const angle = enemy.firstElementChild.children[1].style.transform.replace('rotateZ(', '').replace('deg)', '')
    const angleState = +enemy.getAttribute('angle-state')
    const predicateRunner = predicate(angleState, angle)
    const runners = [
        predicateRunner(0, 45, -45, 0),
        predicateRunner(45, 90, 0, 45),
        predicateRunner(90, 135, 45, 90),
        predicateRunner(135, 180, 90, 135),
        predicateRunner(135, 180, -180, -135),
        predicateRunner(-180, -135, -135, -90),
        predicateRunner(-135, -90, -90, -45),
        predicateRunner(-90, -45, -45, 0)
    ]
    return runners.reduce((a, b) => a || b)
}

const predicate = (state, angle) => {
    let stateCounter = -1
    return (s1, e1, s2, e2) => {
        stateCounter++
        return state === stateCounter && ((angle > s1 && angle < e1) || (angle > s2 && angle <= e2)) 
    }
}