export const isPlayerVisible = (enemy) => {
    let result = false
    if ( enemy.getAttribute('wall-in-the-way') !== 'false' ) return result
    const angle = enemy.firstElementChild.children[1].style.transform.replace('rotateZ(', '').replace('deg)', '')
    const angleState = Number(enemy.getAttribute('angle-state'))
    const predicateRunner = predicate(angleState, angle)
    const runners = [
        predicateRunner(0, 80, -80, 0),
        predicateRunner(0, 125, -35, 0),
        predicateRunner(10, 90, 90, 170),
        predicateRunner(55, 180, -180, -145),
        predicateRunner(100, 180, -180, -100),
        predicateRunner(145, 180, -180, -55),
        predicateRunner(-170, -90, -90, -10),
        predicateRunner(0, 35, -125, 0)
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