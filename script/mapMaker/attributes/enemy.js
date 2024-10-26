import { renderAttributes } from './shared.js'
import { getItemBeingModified } from '../variables.js'

export const renderEnemyAttributes = () => {
    const enemy = getItemBeingModified()
    renderAttributes()
}