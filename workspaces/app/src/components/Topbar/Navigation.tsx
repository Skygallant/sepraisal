import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Badge } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { ROUTES } from '../../constants/routes'
import { CONTEXT } from '../../stores'
import IconAnalyse from '../icons/IconAnalyse'
import IconBrowse from '../icons/IconBrowse'
import IconCompare from '../icons/IconCompare'
import IconInfo from '../icons/IconInfo'
import NavigationButton from './NavigationButton'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        display: 'flex',
    },

    badge: {
        right: `1.2em`,
        top: `1.2em`,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    return (
        <nav className={classes.root}>
            <NavigationButton to={ROUTES.BROWSE} Icon={IconBrowse} title='Browse' />
            <NavigationButton to={ROUTES.BLUEPRINT} Icon={IconAnalyse} title='Analyze' />
            <Badge classes={{badge: classes.badge}} badgeContent={selectionStore.selected.length} color="secondary">
                <NavigationButton to={ROUTES.COMPARE} Icon={IconCompare} title='Compare' />
            </Badge>
            <NavigationButton to={ROUTES.INFO} Icon={IconInfo} title='Info' />
        </nav>
    )
})) /* ============================================================================================================= */