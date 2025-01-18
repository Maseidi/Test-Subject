import { getPlayer } from './elements.js'
import { addClass, createAndAddClass, findAttachmentsOnPlayer } from './util.js'

export const renderTorch = () => {
    const torch = createAndAddClass('div', 'torch')
    const torchImage = createAndAddClass('img', 'torch-img')
    torchImage.src = '/assets/images/torch.png'
    addClass(getPlayer(), 'torch')
    torch.append(torchImage)
    getPlayer().firstElementChild.firstElementChild.append(torch)
}

export const removeTorch = () => findAttachmentsOnPlayer('torch')?.remove()
