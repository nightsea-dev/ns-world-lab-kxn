import React, { FunctionComponent, isValidElement, ReactElement, ReactNode, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
    , keysOf, pickFromAsArray, pickFrom,
    pickFromAsTuple,
    omitFrom,
    findById,
    toRemoveById,
    JitterPositionsOptions,
    entriesOf,
    _shuffleInPlace
} from "@ns-world-lab-kxn/logic"
import {
    Position
    , Transformation
    , PayloadWithKind,
    KeyOf,
    PickRequired,
    ExtractEventHandlersMap,
    HasData,
    HasPayloads,
    HasPayloadKind
} from '@ns-world-lab-kxn/types'


import {
    BoardSurface_Props
    , BoardSurface_State
    , BoardSurface_EventsMap
    , BoardSurface_Ref
} from './BoardSurface.types'
import {
    SurfaceNode
    , SurfaceNode_Props
    , SurfaceNode_Ref
} from './surface-node'
import { ObjectViewPayloadRenderer, PayloadRenderer_Props, SurfaceBoard_PayloadInfo, SurfaceBoard_Payload_InputView_Props } from './surface-payload'
import { ButtonGroupEntryItem, DrawerInfo, DrawerRS, ObjectView, ObjectViewWithToggle } from '../../_2_composite'
import { _cb, _effect, _memo, _use_state } from '../../../utils'
import { HeaderNS, NoData } from '../../_1_primitive'
import { BoardSurface_ControlPanel, BoardSurface_ControlPanel_Props } from './control-panel'
import { ImportMetaEnv } from '../../../infra'
import {
    usePayloadActionButtons
    , UsePayloadActionButtons_Input
} from './hooks/use-payload-action-buttons'


// ======================================== CONSTS/DEFAULTS
const {
    MAX_NUMBER_OF_PAYLOADS
    , MAX_PAYLOAD_FACTORY_ADD
} = ImportMetaEnv

    , DEFAULT = {
        transform: {
            position: {
                x: 100 //+ prev.length * 20
                , y: 120
            }
            , size: {
                width: 200
                , height: 100
            }
        } as Transformation


        // , PayloadRenderer: ({
        //     payload
        // }: PayloadRendererProps<any>
        // ) => (
        //     <ObjectView
        //         data={payload}
        //     />
        // )

    }


// const _getPayloadIdsSet = <
//     P extends PayloadWithKind<any>
// >(
//     payloads: P[]
// ) => new Set(
//     payloads.map(({ id }) => id)
// )

const _get_NextPosition = (
    el?: HTMLElement | null | undefined
): Position | undefined => {
    if (!el) {
        return
    }

    const {
        transform: {
            size: {
                width: default_width
                , height: default_height
            }
        }
    } = DEFAULT

        , {
            width: container_width
            , height: container_height
        } = el.getBoundingClientRect()

        , [x, y] = [
            (container_width - default_width) / 2
            , (container_height - default_height) / 2
        ].map(v => Math.max(0, v))

    // if (container_width <= 0) {
    //     debugger
    // }

    return { x, y } as Position

}

// ======================================== component
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export const BoardSurface_Component = <
    P extends PayloadWithKind<any>
>({
    data: payloads_IN
    , payloadInfosMap
    , boardSurfaceRef
    , children = ObjectViewPayloadRenderer


    , onPayloadsAdded
    , onPayloadsRemoved
    , onInputViewClose
    , onChange

    , onControlPanelNumberOfItemsEnterKey

    , ...rest
}: BoardSurface_Props<P>
) => {

    const id = useId()

        , [state, _set_state, _set_state_async] = _use_state({
            numberOfItems: 1
            , payloads: [] //new Set()
            , m_state: {
                name: "IDLE"
            }
            , showInfo: true
        } as BoardSurface_State<P>
        )

        , _refs = useRef({
            el: undefined as undefined | HTMLElement | null
            , COUNTERS: {} as Record<string, number>
            , previous_payloads: undefined as undefined | P[]
            , surfaceNodesMap: new Map<P["id"], SurfaceNode<P>>()
            , initialSize: { ...DEFAULT.transform.size }
        })

        , _emit_Change: BoardSurface_Props<P>["onChange"]
            = ev => onChange?.(ev)

        , _add_Payloads_Async = async ({
            payloads: payloadsToAdd
            , trigger
        }:
            & HasPayloads<P>
            & {
                trigger:
                KeyOf<
                    & Pick<SurfaceBoard_Payload_InputView_Props<P>, "onDone">
                    & Pick<SurfaceBoard_PayloadInfo<P>, "factory">
                >
            }
        ) => {

            if (!payloadsToAdd.length) {
                return
            }

            const {
                payloads: current_payloads
                , m_state
            } = state

            if (m_state.name !== "IDLE") {
                return
            }

            await _set_state_async({
                m_state: {
                    name: "ADDING PAYLOADS"
                    , stage: "PROCESSING"
                }
            })

            const next_payloads = [...current_payloads]
            next_payloads.push(...payloadsToAdd)

            if (next_payloads.length > MAX_NUMBER_OF_PAYLOADS) {
                alert(`The maximum number of payloads (${MAX_NUMBER_OF_PAYLOADS}) has been reached. [next_payloads] will be shrunk.`)
                next_payloads.length = MAX_NUMBER_OF_PAYLOADS
            }

            await _set_state_async({
                payloads: next_payloads
                , m_state: {
                    name: "ADDING PAYLOADS"
                    , stage: "DONE"
                    , addedPayloads: payloadsToAdd
                }
            })

            return {
                payloads: next_payloads
                , addedPayloads: payloadsToAdd
            }

        }

        , _remove_Payloads_Async = async (
            ...payloadsToRemove: P[]
        ) => {

            const { m_state, payloads: current_payloads } = state

            if (m_state.name !== "IDLE"
                || !payloadsToRemove.length
            ) {
                return {}
            }
            await _set_state_async({
                m_state: {
                    name: "REMOVING PAYLOADS"
                    , stage: "PROCESSING"
                }
            })
            const {
                toKeep
                , toRemove: removedPayloads
            } = toRemoveById(current_payloads, payloadsToRemove)

            if (removedPayloads.length) {
                _set_state({
                    payloads: toKeep
                })
            }

            await _set_state_async({
                m_state: {
                    name: "REMOVING PAYLOADS"
                    , removedPayloads
                    , stage: "DONE"
                }
            })

            return {
                payloads: toKeep
                , removedPayloads
            }

        }

        , _handle_PayloadKind_ControlButtonClick = ({
            payloadKind
        }: HasPayloadKind<P["kind"]>
        ) => {
            // debugger
            const payloadInfo = payloadInfosMap?.[payloadKind]
            if (!payloadInfo) {
                debugger
                return
            }
            const { inputView, factory } = payloadInfo
            if (inputView) {
                _set_state({
                    currentPayloadKind: payloadKind
                })
                return
            }
            if (factory) {
                const { numberOfItems } = state
                _add_Payloads_Async({
                    payloads: factory({ numberOfItems })
                    , trigger: "factory"
                })
            }

        }

        , currentSurfaceBoardPayload_Info
            = state.currentPayloadKind
                ? payloadInfosMap?.[state.currentPayloadKind]
                : undefined

        , {
            payloadButtonsMap
        } = _memo([payloadInfosMap], () => {
            if (!payloadInfosMap) {
                return {}
            }

            return {
                payloadButtonsMap: Object.fromEntries(
                    entriesOf(payloadInfosMap)
                        .map(([payloadKind, info]) => {
                            info.inputViewHeader ??= (
                                <HeaderNS>
                                    {info.buttonLabel ?? payloadKind}
                                </HeaderNS>
                            )
                            return [
                                payloadKind
                                , {
                                    onClick: () => _handle_PayloadKind_ControlButtonClick({ payloadKind })
                                    , children: info.buttonLabel ?? payloadKind
                                }] as ButtonGroupEntryItem
                        })
                )
            }
        })


        , boardSurfaceControlPanelhandlers = {
            onNumberOfItemsEnterKey: ev => {
                onControlPanelNumberOfItemsEnterKey?.({
                    ...ev
                    , cb: ({
                        doContinue
                        , payloadKind
                    }) => {
                        if (!doContinue) {
                            return
                        }
                        _handle_PayloadKind_ControlButtonClick({
                            payloadKind
                        })
                    }
                })
            }
            , onChange: _set_state
        } as ExtractEventHandlersMap<BoardSurface_ControlPanel_Props>


        ,
        /**
         * * [_removePayloadAsync]
         */
        _handle_CloseButtonClick: SurfaceNode_Props<P>["onCloseButtonClick"]
            = ({ surfaceNode: { payload } }) => {

                _remove_Payloads_Async(payload)

            }

        , _handle_SpatialNodeChange: SurfaceNode_Props<P>["onChange"]
            = ({ eventKind, surfaceNode }) => {

                const {
                    current: {
                        surfaceNodesMap
                    }
                } = _refs

                    , { current: { COUNTERS } } = _refs
                    ; (COUNTERS[eventKind] ??= 0)
                COUNTERS[eventKind]++

                console.log(
                    _t(_handle_SpatialNodeChange!.name)
                    , {
                        eventKind
                        , surfaceNode
                        , surfaceNodesMap
                        , "surfaceNodesMap.size": surfaceNodesMap.size
                        , COUNTER: COUNTERS[eventKind]
                    })
            }


        , _handle_SurfaceNodeRef = (
            ref?: SurfaceNode_Ref<P> | null
        ) => {

            if (!ref) {
                return
            }

            const {
                action
                , surfaceNode
            } = ref
                , {
                    current: {
                        surfaceNodesMap
                        , COUNTERS
                    }
                } = _refs

                , counter_key = [_handle_SurfaceNodeRef.name, action].join(".")

            switch (action) {
                case "mounted": {
                    surfaceNodesMap.set(
                        surfaceNode.payload.id
                        , surfaceNode
                    )
                    break
                }
                case "dismounted": {
                    surfaceNodesMap.delete(
                        surfaceNode.payload.id
                    )
                    break
                }
            }

            ;
            ; (COUNTERS[counter_key] ??= 0)
            COUNTERS[counter_key]++

            console.log(
                _t(counter_key)
                , {
                    surfaceNode
                    , surfaceNodesMap
                    , "surfaceNodesMap.size": surfaceNodesMap.size
                    , COUNTER: COUNTERS[counter_key]
                })


        }


        // , _getNodesFromPayloads = (
        //     ...payloads: P[]
        // ) => {
        //     const {
        //         surfaceNodesMap
        //     } = state
        //     return payloads.map(payload => {
        //         return surfaceNodesMap.get(payload)!
        //     })
        // }

        , _get_SurfaceNodes = (): SurfaceNode<P>[] => {
            const {
                current: {
                    surfaceNodesMap
                }
            } = _refs
            return [...surfaceNodesMap.values()]
            // .map(
            //     surfaceNode => ({
            //         payload: surfaceNode.payload
            //         , surfaceNode
            //     }))
        }

        , inputViewHandlers = {
            onCancel: () => {
                _set_state({
                    // inputViewInfo: {
                    //     ...state.inputViewInfo
                    //     , isOpen: false
                    // }
                    currentPayloadKind: undefined
                    , m_state: {
                        name: "IDLE"
                    }
                })
                onInputViewClose?.()

            }

            , onDone: ({
                data: payloads
            }) => {
                _add_Payloads_Async({
                    payloads
                    , trigger: "onDone"
                })
                _set_state({
                    currentPayloadKind: undefined
                })

            }

            // , onInputViewChange: ({
            //     isOpen
            //     , payloadKind
            // }) => {
            //     debugger
            //     console.log(_t(`[InputView] for [payloadKind: ${payloadKind}] ${isOpen ? "OEPENED" : "CLOSED"}`))
            // }
        } as ExtractEventHandlersMap<SurfaceBoard_Payload_InputView_Props<P>>

        , _handle_PayloadAction: UsePayloadActionButtons_Input<P>["onAction"]
            = ({
                action
                , payloads
            }) => {
                if (payloads !== state.payloads) {
                    _set_state({ payloads })
                }
                switch (action) {
                    case "clear": {

                        break

                    }

                }

            }

        , {
            payloadActionsMap: actionButtonPropsMap
        } = usePayloadActionButtons({
            defaultSize: DEFAULT.transform.size
            , payloads: state.payloads
            , ...pickFrom(_refs.current, "el", "surfaceNodesMap")
            , onAction: _handle_PayloadAction
        })


    _effect([
        boardSurfaceRef
        , ...pickFromAsTuple(
            state
            , "numberOfItems"
            , "payloads"
        )
        , _refs.current.surfaceNodesMap
    ], () => {
        if (!boardSurfaceRef) {
            return
        }
        boardSurfaceRef({
            numberOfItems: state.numberOfItems
            , payloads: state.payloads
            , surfaceNodesMap: _refs.current.surfaceNodesMap
        })
    })


    _effect([payloads_IN], () => {
        if (
            !payloads_IN?.length
            || _refs.current.previous_payloads === payloads_IN
        ) {
            return
        }

        _refs.current.previous_payloads = payloads_IN

        _set_state({
            payloads: payloads_IN
        })
    })


    const _final_m_state_processing = async () => {
        // finalise/emit - just for POC of M-state
        // debugger
        const state = await _set_state_async()

        console.log(
            _t(_final_m_state_processing.name)
            , { state }
        )
        // console.log("state.m_state", state.m_state)

        // debugger
        switch (state.m_state.name) {
            case "IDLE": {
                return
            }

            case "ADDING PAYLOADS": {
                const {
                    m_state: {
                        stage
                        , addedPayloads = []
                    }
                    , payloads: currentPayloads
                } = state
                if (stage !== "DONE") {
                    return
                }
                if (!addedPayloads.length) {
                    break
                }

                const ev: BoardSurface_EventsMap<P>["payloadsAdded"]
                    = {
                    eventKind: "payloadsAdded"
                    , addedPayloads
                    , surfaceNodes: _get_SurfaceNodes()
                    , payloads: [...currentPayloads]
                }
                onPayloadsAdded?.(ev)
                _emit_Change(ev)
                break
            }

            case "REMOVING PAYLOADS": {
                const {
                    m_state: {
                        stage
                        , removedPayloads = []
                    }
                    , payloads: current_payloads
                } = state

                if (stage !== "DONE") {
                    return
                }

                if (!removedPayloads?.length) {
                    break
                }

                const ev: BoardSurface_EventsMap<P>["payloadsRemoved"]
                    = {
                    eventKind: "payloadsRemoved"
                    , surfaceNodes: _get_SurfaceNodes()
                    , removedPayloads
                    , payloads: [...current_payloads]
                }
                onPayloadsRemoved?.(ev)
                _emit_Change(ev)
                break
            }
        }

        _set_state({
            m_state: {
                name: "IDLE"
                , latestAction: state.m_state.name
            }
        })

    }
    _effect([state.m_state], () => {
        _final_m_state_processing()
    })


    return (
        <div
            {...rest}
            id={id}
            className="h-full w-full flex flex-col relative"
            data-board-surface
            ref={el => {
                _refs.current.el = el
            }}
        >
            <DrawerRS
                open={!!currentSurfaceBoardPayload_Info && !!currentSurfaceBoardPayload_Info.inputView}
                onClose={inputViewHandlers.onCancel}
                header={currentSurfaceBoardPayload_Info?.inputViewHeader}
                body={() => {
                    if (!currentSurfaceBoardPayload_Info?.inputView) {
                        return <NoData>
                            No [inputView] was provided for [payloadKind: ${state.currentPayloadKind}]
                        </NoData>
                    }
                    const InputViewRenderer = currentSurfaceBoardPayload_Info.inputView
                    return <InputViewRenderer {...inputViewHandlers} />
                }}
            // {...inputViewDrawerInfo}
            />
            <ObjectView
                // state of this one is controlled by the ControlPanel
                data={{
                    ...state
                    , MAX_NUMBER_OF_PAYLOADS
                    , still_can_add: MAX_NUMBER_OF_PAYLOADS - state.payloads.length
                }}
                showOnlyArrayLength
                top={10}
                left={10}
                absolute
                isHidden={!state.showInfo}
            />

            <div
                data-payload-collection-container
                className="flex-1 relative w-full"
            >
                {[...state.payloads].map((payload, idx) => {
                    type P = typeof payload

                    const payloadRenderer
                        = payloadInfosMap?.[payload.kind as P["kind"]].payloadRenderer as
                        SurfaceNode.Props<P>["payloadRenderer"]

                    return (
                        <SurfaceNode.Component<P>
                            key={payload.id}

                            payload={payload}
                            surfaceNodeRef={ref => {
                                _handle_SurfaceNodeRef(ref)
                            }}

                            initialSize={_refs.current.initialSize}
                            initialPosition={_get_NextPosition(_refs.current.el)}

                            onCloseButtonClick={_handle_CloseButtonClick}
                            onChange={_handle_SpatialNodeChange}

                            children={children}
                            payloadRenderer={payloadRenderer as any}

                        >
                            {/* <PayloadRenderer
                                    payload={payload}
                                /> */}
                        </SurfaceNode.Component>
                    )
                })}
            </div>

            <BoardSurface_ControlPanel
                buttonsAreDisabled={!!state.currentPayloadKind}
                buttons={{
                    ...payloadButtonsMap
                    , ...actionButtonPropsMap
                    //     , Sort: {
                    //         onClick: () => _handle_ActionButtonClick("jitter")
                    //         , disabled: !state.payloads.length
                    //     }
                    //     , Shuffle: {
                    //         onClick: () => _handle_ActionButtonClick("shuffle")
                    //         , disabled: !state.payloads.length
                    //     }
                    //     , Reset: {
                    //         onClick: () => _handle_ActionButtonClick("reset")
                    //         , disabled: !state.payloads.length
                    //     }
                    //     , Clear: {
                    //         onClick: () => _handle_ActionButtonClick("clear")
                    //         , disabled: !state.payloads.length
                    //     }
                    // 
                }}
                {...{
                    ...boardSurfaceControlPanelhandlers
                    , ...pickFrom(state, "numberOfItems", "showInfo")
                }}
            />
        </div>
    )
}







export namespace BoardSurface {
    export const Component = BoardSurface_Component
    export type Props<
        P extends PayloadWithKind<any>
    > = BoardSurface_Props<P>
    export type Ref<
        P extends PayloadWithKind<any>
    > = BoardSurface_Ref<P>
}