import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Button,
    Divider,
    Grid,
    Hidden,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    useMediaQuery,
} from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconSort from 'src/components/icons/IconSort'
import IconSortAscending from 'src/components/icons/IconSortAscending'
import IconSortDescending from 'src/components/icons/IconSortDescending'
import { CONTEXT } from 'src/stores'
import { CardStore } from 'src/stores/CardStore'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: 'unset',
        backgroundColor: theme.palette.background.default,
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        flexWrap: 'nowrap',
    },

    button: {
    },
    text: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)
    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {noSsr: true})

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget)
    }
    const handleClose = () => {
        setAnchor(null)
    }
    const setSort = (event: React.MouseEvent<HTMLElement>) => {
        const key = event.currentTarget.getAttribute('value') as string
        const sort = cardStore.sort

        if(!(key in sort)) {
            cardStore.sort = {[key]: CardStore.defaultSortOrder}
        } else {
            if(cardStore.sort[key] === CardStore.defaultSortOrder) {
                cardStore.sort = {[key]: -CardStore.defaultSortOrder as 1 | -1}
            } else {
                cardStore.sort = {}
            }
        }

        handleClose()
    }
    const quickReverse = () => {
        const key = Object.keys(cardStore.sort).pop()!
        cardStore.sort = {[key]: -cardStore.sort[key] as 1 | -1}
    }

    const renderSortItem = (id: string) => {
        const title = TITLES[id]
        const {sort} = cardStore
        const icon =
            id in sort && sort[id] === -1 ? <ListItemIcon><IconSortDescending /></ListItemIcon> :
            id in sort && sort[id] ===  1 ? <ListItemIcon><IconSortAscending /></ListItemIcon> :
            null

        return (
            <MenuItem value={id} onClick={setSort}>
                {smUp ? null : icon}
                <ListItemText inset={!icon && !smUp} primary={title} />
            </MenuItem>
        )
    }

    const currentKey = Object.keys(cardStore.sort).pop()
    console.log(currentKey, {...cardStore.sort})
    const icon =
        currentKey === undefined ? <IconSort /> :
        cardStore.sort[currentKey] === -1 ? <IconSortDescending /> :
        cardStore.sort[currentKey] ===  1 ? <IconSortAscending /> :
        null

    return (
        <Grid className={classes.root} container alignItems='center' justify='center'>
            <Hidden smDown>
                <Button className={classes.text} onClick={handleClick}>
                    {currentKey && TITLES[currentKey]}
                </Button>
                <Divider orientation='vertical' />
            </Hidden>
            <IconButton className={classes.button} onClick={smUp ? quickReverse : handleClick}>
                {icon}
            </IconButton>
            <Menu
                id='simple-menu'
                anchorEl={anchor}
                open={anchor !== null}
                onClose={handleClose}
                transitionDuration={100}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'left'}}
            >
                {renderSortItem('steam.title')}
                {renderSortItem('steam.subscriberCount')}
                {renderSortItem('sbc.blockCount')}
                {renderSortItem('sbc.blockPCU')}
                {renderSortItem('sbc.oreVolume')}
            </Menu>
        </Grid>
    )
})) /* ============================================================================================================= */

const TITLES = {
    'steam.title': 'Blueprint Title',
    'steam.subscriberCount': 'Subscribers',
    'sbc.blockCount': 'Blocks',
    'sbc.blockPCU': 'PCU',
    'sbc.oreVolume': 'Ore, m\u00B3',
}
