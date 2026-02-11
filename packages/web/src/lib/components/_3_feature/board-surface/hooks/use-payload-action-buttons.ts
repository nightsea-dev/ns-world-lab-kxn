import { _jitterPositions, JitterPositionsOptions, _shuffleInPlace, _capitalise } from "@ns-world-lab-kxn/logic"
import { HasPayloads, PartialEventHandlersFromMap, PayloadWithKind, Position, Size } from "@ns-world-lab-kxn/types"
import { _cb } from "../../../../utils"
import { ButtonRSProps } from "../../../_2_composite"
import { SurfaceNodesMap } from "../BoardSurface.types"


export const PAYLOAD_ACTIONS
    = ["jitter", "shuffle", "reset", "clear"] as const

export type PayloadAction = typeof PAYLOAD_ACTIONS[number]
export type HasPayloadAction
    = {
        action: PayloadAction
    }

export type UsePayloadActionButtons_EventsMap<
    P extends PayloadWithKind<any>
>
    = {
        action:
        & HasPayloadAction
        & HasPayloads<P>
    }

export type UsePayloadActionButtons_Input<
    P extends PayloadWithKind<any>
> =
    & HasPayloads<P>
    & {
        el?: HTMLElement | null | undefined
        surfaceNodesMap: SurfaceNodesMap<P>
        defaultSize: Size
    }
    & PartialEventHandlersFromMap<
        UsePayloadActionButtons_EventsMap<P>
    >

export type PayloadAction_ButtonProps_Map
    = Record<PayloadAction, ButtonRSProps>

export type UsePayloadActionButtons_Output =
    {
        payloadActionsMap: PayloadAction_ButtonProps_Map
    }

export const usePayloadActionButtons = <
    P extends PayloadWithKind<any>
>({
    el
    , surfaceNodesMap
    , payloads
    , defaultSize
    , onAction
}: UsePayloadActionButtons_Input<P>
): UsePayloadActionButtons_Output => {

    const _handle_ActionButtonClick
        = (
            ev:
                | {
                    action: "jitter"
                    options?: JitterPositionsOptions
                }
                | {
                    action: | "shuffle" | "clear" | "reset"
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

                case "clear": {

                    if (!confirm(`Sure you want to CLEAR the SurfaceBoard?`)) {
                        return
                    }

                    payloads = []

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

            onAction?.({ action, payloads })

        }


        , actionButtonPropsMap: PayloadAction_ButtonProps_Map = {
            ...Object.fromEntries(
                PAYLOAD_ACTIONS.map(
                    action => [
                        action
                        , {
                            onClick: () => _handle_ActionButtonClick({ action })
                            , disabled: !payloads.length
                        }
                    ] as [PayloadAction, ButtonRSProps]
                )
            ) as PayloadAction_ButtonProps_Map
        }

    return {
        payloadActionsMap: actionButtonPropsMap
    }

}