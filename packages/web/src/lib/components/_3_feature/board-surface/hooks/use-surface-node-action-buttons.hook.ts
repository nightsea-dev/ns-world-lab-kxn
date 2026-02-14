import { _jitterPositions, JitterPositionsOptions, _shuffleInPlace, _capitalise } from "@ns-world-lab/logic"
import { EventHandlersFromMapPartial, PayloadWithKind, Position, Size } from "@ns-world-lab/types"
import { _cb } from "../../../../utils"
import { ButtonRSProps } from "../../../_2_composite"
import { SurfaceNodesMap } from "../surface-node/SurfaceNode.types"



// ======================================== types/contacts/capabilities

export const SURFACE_NODE_BUTTON_ACTIONS
    = ["jitter", "shuffle", "reset"] as const

type ButtonAction = typeof SURFACE_NODE_BUTTON_ACTIONS[number]
export type HasSurfaceNodeButtonAction
    = {
        action: ButtonAction
    }





// ======================================== types/events
type EventsMap
    = {
        action:
        & HasSurfaceNodeButtonAction
    }

type Input<
    P extends PayloadWithKind<any>
> =
    // & HasPayloads<P>
    & {
        el?: HTMLElement | null | undefined
        surfaceNodesMap: SurfaceNodesMap<P>
        defaultSize: Size
    }
    & EventHandlersFromMapPartial<
        EventsMap
    >

type ActionButtonProps_Map = Record<ButtonAction, ButtonRSProps>

type Output =
    {
        actionButtonsMap: ActionButtonProps_Map
    }




// ========================================
export const useSurfaceNodeActionButtons = <
    P extends PayloadWithKind<any>
>({
    el
    , surfaceNodesMap
    , defaultSize
    , onAction
}: Input<P>
): Output => {

    const _handle_ActionButtonClick = (
        ev:
            | {
                action: "jitter"
                options?: JitterPositionsOptions
            }
            | {
                action: Exclude<ButtonAction, "jitter">
            }
    ) => {

        const { action } = ev

        switch (action) {
            case "jitter":
            case "shuffle": {

                if (!el) {
                    return
                }

                const { width, height }
                    = el.getBoundingClientRect()

                    , spatialNodes = [...surfaceNodesMap.values()].map(({ spatialNode }) => spatialNode)

                let next_positions = [] as Position[]
                switch (action) {
                    case "jitter": {
                        const transformations = spatialNodes.map(({ transformation }) => transformation)
                            , { scatteredPositions } = _jitterPositions({
                                containerSize: { width, height }
                                , transformations
                                , options: ev.options
                            })
                        next_positions = scatteredPositions
                        break
                    }
                    case "shuffle": {
                        const positions = spatialNodes.map(({ position }) => position)
                        next_positions = _shuffleInPlace(positions)
                        break
                    }
                }

                spatialNodes.forEach((spatialNode, i) => {
                    spatialNode.updatePosition(
                        next_positions[i]
                    )
                })

                break
            }

            case "reset": {

                // if (!confirm(`Sure you want to RESET all [node-sizes] ?`)) {
                //     return
                // }

                surfaceNodesMap.forEach(node => {
                    node.spatialNode.size = {
                        ...defaultSize
                    }
                })
                _handle_ActionButtonClick({ action: "jitter" })

                break
            }
        }

        onAction?.({ action })

    }


        , surfaceNodeActionButtonsMap: ActionButtonProps_Map = {
            ...Object.fromEntries(
                SURFACE_NODE_BUTTON_ACTIONS.map(
                    action => [
                        action
                        , {
                            onClick: () => _handle_ActionButtonClick({ action })
                            , disabled: !surfaceNodesMap.size
                        }
                    ] as [ButtonAction, ButtonRSProps]
                )
            ) as ActionButtonProps_Map
        }

    return {
        actionButtonsMap: surfaceNodeActionButtonsMap
    }

}





export {

    type ButtonAction as SurfaceNode_ButtonAction

    , type EventsMap as UseSurfaceNodeActionButtons_EventsMap

    , type Input as UseSurfaceNodeActionButtons_Input
    , type Output as UseSurfaceNodeActionButtons_Output

    , type ActionButtonProps_Map as SurfaceNodeAction_ButtonProps_Map


}