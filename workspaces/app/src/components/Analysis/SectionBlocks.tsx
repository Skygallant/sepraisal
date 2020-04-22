import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'
import Table from '../../components/Table'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MySection from '../MySection'



const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    content: {
        height: `calc(${151 * 3 - 50}px - ${theme.spacing(4)}px)`,
        overflowX: 'hidden',
        overflowY: 'hidden',
    },
    contentTable: {
        width: '100%',
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc

    const blocks = (Object.entries(sbc.blocks))
        .map(([block, count]) => ({block, count}))
        .sort((a, b) => b.count - a.count)

    return (
        <MySection className={classes.root}>
            <MyBox>
                <HeaderCell triple title='BLOCKS' />
            </MyBox>
            <MyBox>
            </MyBox>
            <MyBox className={classes.content}>
                <Table
                    className={classes.contentTable}
                    columns={Object.keys(datumTitles)}
                    headers={datumTitles}
                    data={blocks}
                />
            </MyBox>
        </MySection>
    )
})) /* ============================================================================================================= */


const datumTitles = {
    block: 'Block ID',
    count: 'Count',
}

type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
