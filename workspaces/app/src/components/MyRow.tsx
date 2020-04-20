import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        height: 50,
        borderBottomColor: theme.palette.grey[200],
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
    },
})


interface IProps extends GridProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <Grid
            container
            className={classnames(classes.root, className)}
            spacing={0}
            justify='space-between'
            alignItems='stretch'
            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */