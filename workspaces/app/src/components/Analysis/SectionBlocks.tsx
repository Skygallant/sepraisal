import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Table from '../../components/Table'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    contentTable: {
        width: '100%',
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc

    const blocks = (Object.entries(sbc.blocks))
        .map(([block, count]) => ({block, count}))
        .sort((a, b) => b.count - a.count)

    return (
        <>
            <MyBoxColumn>
                <MyBoxRow width={6}>
                    <MyBox variant='header'>
                        <HeaderCell title='BLOCKS' />
                    </MyBox>
                    <MyBox>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={8}>
                <MyBoxRow width={6}>
                    <MyBox width={6}>
                        <Table
                            className={classes.contentTable}
                            columns={Object.keys(datumTitles)}
                            headers={datumTitles}
                            data={blocks}
                        />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </>
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
