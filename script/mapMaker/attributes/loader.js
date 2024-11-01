import { Door } from '../../loader.js'
import { getAttributesEl, getElemBeingModified } from '../elements.js'
import { getItemBeingModified, getLoaders, getRoomBeingMade } from '../variables.js'
import { autocomplete, checkbox, renderAttributes, input, deleteButton } from './shared.js'

export const renderLoaderAttributes = () => {
    const loader = getItemBeingModified()
    renderAttributes()
    const type = getType(loader)

    getAttributesEl().append(
        input('room to load', loader.className, (value) => loader.className = value)
    )

    getAttributesEl().append(
        autocomplete('type', type, (value) => {
            if ( value === 'top-loader' )         setLoaderSpacing(loader, 100, 5, 0, -26, null, null) 
            else if ( value === 'left-loader' )   setLoaderSpacing(loader, 5, 100, -26, 0, null, null) 
            else if ( value === 'right-loader' )  setLoaderSpacing(loader, 5, 100, null, 0, -26, null)
            else if ( value === 'bottom-loader' ) setLoaderSpacing(loader, 100, 5, 0, null, null, -26)
            renderLoaderAttributes()
        }, [
            { label: 'Top Loader',    value: 'top-loader'   },
            { label: 'Right Loader',  value: 'right-loader' },
            { label: 'Left Loader',   value: 'left-loader'  },
            { label: 'Bottom Loader', value: 'bottom-loader'}
        ])
    )

    if ( type === 'top-loader' || type === 'bottom-loader' ) {
        getAttributesEl().append(
            input('left', loader.left, (value) => setFieldAndStyle(loader, 'left', value))
        )

        getAttributesEl().append(
            input('width', loader.width, (value) => setFieldAndStyle(loader, 'width', value))
        )
    }

    if ( type === 'left-loader' || type === 'right-loader' ) {
        getAttributesEl().append(
            input('top', loader.top, (value) => setFieldAndStyle(loader, 'top', value))
        )

        getAttributesEl().append(
            input('height', loader.height, (value) => setFieldAndStyle(loader, 'height', value))
        )
    }

    getAttributesEl().append(
        checkbox('has door', loader.door, (value) => {
            if ( value ) loader.door = new Door()
            else loader.door = null
            renderLoaderAttributes()
        })
    )

    if ( loader.door ) {
        getAttributesEl().append(
            input('door heading', loader.door.heading, (value) => loader.door.heading = value, 'text')
        )
    
        getAttributesEl().append(
            input('door popup', loader.door.popup, (value) => loader.door.popup = value, 'text')
        )
    
        getAttributesEl().append(
            input('door key', loader.door.key, (value) => loader.door.key = value, 'text')
        )
    
        getAttributesEl().append(
            input('door render progress', loader.door.renderProgress, (value) => loader.door.renderProgress = value, 'text')
        )
    
        getAttributesEl().append(
            input('door progresses to active', 
                loader.door.progress2Active.join(','), 
                (value) => loader.door.progress2Active = value.split(','), 
                'text')
        )
    
        getAttributesEl().append(
            input('door kill all', loader.door.killAll, (value) => loader.door.killAll = value, 'text')
        )
    
        getAttributesEl().append(
            input('door code', loader.door.code, (value) => loader.door.code = value, 'text')
        )
    }

    getAttributesEl().append(
        deleteButton(() => {
            const currentRoomLoaders = getLoaders().get(getRoomBeingMade())
            const filteredLoaders = 
                currentRoomLoaders
                .filter((item, index) => index !== Number(getElemBeingModified().id.replace(`loader-`, '')))

            getLoaders().set(getRoomBeingMade(), filteredLoaders)
            getElemBeingModified().remove()
        })
    )

}

const getType = (loader) => {
    if ( loader.height === 5 ) {
        if ( loader.top === -26 ) return 'top-loader'
        else return 'bottom-loader'
    }
    if ( loader.width === 5 ) {
        if ( loader.left === -26 ) return 'left-loader'
        else return 'right-loader'
    }
}

const setLoaderSpacing = (loader, width, height, left, top, right, bottom) => {
    setFieldAndStyle(loader, 'top',    top)
    setFieldAndStyle(loader, 'left',   left)
    setFieldAndStyle(loader, 'width',  width)
    setFieldAndStyle(loader, 'right',  right)
    setFieldAndStyle(loader, 'height', height)
    setFieldAndStyle(loader, 'bottom', bottom)
}

const setFieldAndStyle = (loader, prop, value) => {
    loader[prop] = value
    getElemBeingModified().style[prop] = value ? `${value}px` : ''
}