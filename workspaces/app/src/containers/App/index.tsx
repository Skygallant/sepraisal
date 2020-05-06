import { BLOCK_GROUPS } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import MaterialsLink from '@sepraisal/praisal/vendor/Blueprints.sbc'
import ComponentsLink from '@sepraisal/praisal/vendor/Components.sbc'
import CubeBlocksCubeBlocksLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks.sbc'
import CubeBlocksArmorLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Armor.sbc'
import CubeBlocksAutomationLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Automation.sbc'
import CubeBlocksCommunicationsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Communications.sbc'
import CubeBlocksControlLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Control.sbc'
import CubeBlocksDecorativePackLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_DecorativePack.sbc'
import CubeBlocksDecorativePack2Link from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_DecorativePack2.sbc'
import CubeBlocksDoorsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Doors.sbc'
import CubeBlocksEconomyLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Economy.sbc'
import CubeBlocksEnergyLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Energy.sbc'
import CubeBlocksExtrasLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Extras.sbc'
import CubeBlocksGravityLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Gravity.sbc'
import CubeBlocksInteriorsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Interiors.sbc'
import CubeBlocksLCDPanelsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_LCDPanels.sbc'
import CubeBlocksLightsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Lights.sbc'
import CubeBlocksLogisticsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Logistics.sbc'
import CubeBlocksMechanicalLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Mechanical.sbc'
import CubeBlocksMedicalLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Medical.sbc'
import CubeBlocksProductionLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Production.sbc'
import CubeBlocksThrustersLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Thrusters.sbc'
import CubeBlocksToolsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Tools.sbc'
import CubeBlocksUtilityLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Utility.sbc'
import CubeBlocksWeaponsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Weapons.sbc'
import CubeBlocksWheelsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Wheels.sbc'
import CubeBlocksWindowsLink from '@sepraisal/praisal/vendor/CubeBlocks/CubeBlocks_Windows.sbc'
import PhysicalItemsLink from '@sepraisal/praisal/vendor/PhysicalItems.sbc'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Paper } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

import { ASYNC_STATE, MY_LIGHT_THEME, useAsyncEffectOnce } from '../../common'
import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Topbar from '../../components/Topbar'
import { CONTEXT } from '../../stores'
import { BlueprintStore } from '../../stores/BlueprintStore'
import { CardStore } from '../../stores/CardStore'
import { FavoriteStore } from '../../stores/FavoriteStore'
import { SelectionStore } from '../../stores/SelectionStore'


const styles = (theme: IMyTheme) => createStyles({
    body: {
        margin: 0,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const [favoriteStore] = React.useState(() => new FavoriteStore())
    const [blueprintStore] = React.useState(() => new BlueprintStore(favoriteStore))
    const [selectionStore] = React.useState(() => new SelectionStore())
    const [cardStore] = React.useState(() => new CardStore(piwikStore))
    const [praisalManager] = React.useState(() => new PraisalManager())
    const [state, setState] = React.useState<ASYNC_STATE>(ASYNC_STATE.Idle)

    React.useEffect(() => {
        const body = document.getElementById('body')!
        body.className = classes.body
    })

    useAsyncEffectOnce(async () => {
        try {
            setState(ASYNC_STATE.Doing)
            const [componentsXml, materialsXml, physicalItemsXml, ...cubeBlocksXmls] = await Promise.all([
                fetch(ComponentsLink).then((res) => res.text()),
                fetch(MaterialsLink).then((res) => res.text()),
                fetch(PhysicalItemsLink).then((res) => res.text()),

                fetch(CubeBlocksCubeBlocksLink).then((res) => res.text()),
                fetch(CubeBlocksArmorLink).then((res) => res.text()),
                fetch(CubeBlocksAutomationLink).then((res) => res.text()),
                fetch(CubeBlocksCommunicationsLink).then((res) => res.text()),
                fetch(CubeBlocksControlLink).then((res) => res.text()),
                fetch(CubeBlocksDecorativePackLink).then((res) => res.text()),
                fetch(CubeBlocksDecorativePack2Link).then((res) => res.text()),
                fetch(CubeBlocksDoorsLink).then((res) => res.text()),
                fetch(CubeBlocksEconomyLink).then((res) => res.text()),
                fetch(CubeBlocksEnergyLink).then((res) => res.text()),
                fetch(CubeBlocksExtrasLink).then((res) => res.text()),
                fetch(CubeBlocksGravityLink).then((res) => res.text()),
                fetch(CubeBlocksInteriorsLink).then((res) => res.text()),
                fetch(CubeBlocksLCDPanelsLink).then((res) => res.text()),
                fetch(CubeBlocksLightsLink).then((res) => res.text()),
                fetch(CubeBlocksLogisticsLink).then((res) => res.text()),
                fetch(CubeBlocksMechanicalLink).then((res) => res.text()),
                fetch(CubeBlocksMedicalLink).then((res) => res.text()),
                fetch(CubeBlocksProductionLink).then((res) => res.text()),
                fetch(CubeBlocksThrustersLink).then((res) => res.text()),
                fetch(CubeBlocksToolsLink).then((res) => res.text()),
                fetch(CubeBlocksUtilityLink).then((res) => res.text()),
                fetch(CubeBlocksWeaponsLink).then((res) => res.text()),
                fetch(CubeBlocksWheelsLink).then((res) => res.text()),
                fetch(CubeBlocksWindowsLink).then((res) => res.text()),
            ])
            await praisalManager.addOres(physicalItemsXml)
            await praisalManager.addIngots(physicalItemsXml, materialsXml)
            await praisalManager.addComponents(materialsXml, componentsXml)
            for(const cubeBlocksXml of cubeBlocksXmls) await praisalManager.addCubes(cubeBlocksXml)
            praisalManager.addGroups(BLOCK_GROUPS)
            setState(ASYNC_STATE.Done)
        } catch(err) {
            console.error(err)
            setState(ASYNC_STATE.Error)
        }
    })

    if(state === ASYNC_STATE.Idle || state === ASYNC_STATE.Doing) {
        return (
            <CONTEXT.SELECTION.Provider value={selectionStore}>

            <ThemeProvider theme={MY_LIGHT_THEME}>
                <main>
                    <Topbar/>
                    <Paper>
                        Loading...
                    </Paper>
                </main>
            </ThemeProvider>

            </CONTEXT.SELECTION.Provider>
        )
    } else if(state === ASYNC_STATE.Error) {
        return (
            <CONTEXT.SELECTION.Provider value={selectionStore}>

            <ThemeProvider theme={MY_LIGHT_THEME}>
                <main>
                    <Topbar/>
                    <Paper>
                        Error at startup. Please try again or see console for details.
                    </Paper>
                </main>
            </ThemeProvider>

            </CONTEXT.SELECTION.Provider>
        )
    }

    return (
        <CONTEXT.BLUEPRINTS.Provider value={blueprintStore}>
        <CONTEXT.FAVORITES.Provider value={favoriteStore}>
        <CONTEXT.CARDS.Provider value={cardStore}>
        <CONTEXT.PRAISAL_MANAGER.Provider value={praisalManager}>
        <CONTEXT.SELECTION.Provider value={selectionStore}>

        <ThemeProvider theme={MY_LIGHT_THEME}>
            {children}
        </ThemeProvider>

        </CONTEXT.SELECTION.Provider>
        </CONTEXT.PRAISAL_MANAGER.Provider>
        </CONTEXT.CARDS.Provider>
        </CONTEXT.FAVORITES.Provider>
        </CONTEXT.BLUEPRINTS.Provider>
    )
})) /* ============================================================================================================= */
