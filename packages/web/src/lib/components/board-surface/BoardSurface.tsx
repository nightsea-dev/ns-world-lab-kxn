import React, { FunctionComponent, isValidElement, ReactElement, ReactNode, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
    , keysOf, pickFromAsArray, pickFrom,
    pickFromAsTuple,
    omitFrom
} from "@ns-lab-knx/logic"
import {
    HasData
    , Position
    , Transformation
    , PayloadWithKind
    , M_StateFromMap
    , HasPayloadWithKind
    , HasEventKind
    , EventHandlersFromMap
    , KeyOf,
    HasPayloads
} from '@ns-lab-knx/types'

import {
    BoardSurfaceControlPanel
} from './BoardSurfaceControlPanel'

import {
    CreatePayloadFn
    , HasSurfaceNode, PayloadRenderer, PayloadRendererProps
    , SurfaceNode
    , SurfaceNodeComponent
    , SurfaceNodeProps
} from '../graph'
import { _cb, _effect, _memo, _use_state } from '../../utils'
import { Drawer } from 'rsuite'
import { DrawerInfo, ButtonsMap, DrawerRS, NoData, ObjectView, ButtonGroupEntryItem } from '../ui'
import {
    BoardSurface_Props, BoardSurface_EventData
    , BoardSurface_State,
    BoardSurface_EventsMap,
    InputViewInfo
} from './BoardSurface.types'


// ======================================== CONSTS/DEFAULTS
const DEFAULT = {
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


    , PayloadRenderer: ({
        payload
    }: PayloadRendererProps<any>
    ) => (
        <ObjectView
            data={payload}
        />
    )

}



// ======================================== component
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export const BoardSurfaceComponent = <
    P extends PayloadWithKind<any>
>({
    data: payloads_IN
    , createPayloadFnMap
    , additionalButtonsMap: additionalButtonsMap_IN
    , payloadRenderer
    , children = payloadRenderer ?? DEFAULT.PayloadRenderer
    , boardSurfaceRef

    , inputViewInfo


    , onPayloadsAdded
    , onPayloadsRemoved
    // , onChange
    , onInputViewClose

    , ...rest
}: BoardSurface_Props<P>
) => {


    const id = useId()

        , [state, _set_state, _set_state_async] = _use_state({
            numberOfItems: 1
            , payloads: new Set()
            , m_state: {
                name: "IDLE"
            }
            , surfaceNodesMap: new Map()
            , showInfo: true
            , inputViewInfo: {
                isOpen: false
            }
        } as BoardSurface_State<P>
        )

        , _refs = useRef({
            el: undefined as undefined | HTMLElement | null
            , COUNTERS: {} as Record<string, number>
            , previous_payloads: undefined as undefined | P[]
            , previous_inputViewInfo: undefined as undefined | InputViewInfo
        })

        , { inputViewDrawerInfo } = _memo([inputViewInfo?.content], () => {

            if (!inputViewInfo?.content) {
                return {}
            }

            const {
                header
                , body: B
            } = (
                isValidElement(inputViewInfo?.content)
                    ? {
                        body: inputViewInfo?.content
                    }
                    : typeof (inputViewInfo?.content) === "function"
                        ? {
                            body: inputViewInfo?.content
                        }
                        : inputViewInfo?.content
            ) as DrawerInfo

            return {
                inputViewDrawerInfo: {
                    header
                    , body: typeof (B) === "function"
                        ? <B /> : B
                }
            }
        })

        ,
        /**
         * [_cb]
         */
        _getNextPosition = _cb((): Position | undefined => {
            const {
                current: {
                    el
                }
            } = _refs
                , {
                    transform: {
                        size: {
                            width: default_width
                            , height: default_height
                        }
                    }
                } = DEFAULT

            if (!el) {
                return
            }

            const {
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

        })

        , _addPayloadAsync = _cb([
            _set_state_async
        ], async (
            payloadKind: P["kind"]
        ) => {

            const {
                m_state
            } = await _set_state_async()

            if (m_state.name !== "IDLE") {
                return
            }

            if (
                !createPayloadFnMap
            ) {
                const err = new Error(`[createPayloadFnMap] is required.
        Unabled to [create/add] [payload].
        `)
                console.error(err)
                return
            }

            const {
                numberOfItems
                , payloads: current_payloads
            } = await _set_state_async({
                m_state: {
                    name: "ADDING PAYLOADS"
                    , stage: "PROCESSING"
                }
            })
                , next_payloads = [...current_payloads]
                , payloadsToAdd = Array.from({ length: numberOfItems })
                    .map(() => createPayloadFnMap[payloadKind]())

            if (!payloadsToAdd.length) {
                debugger
                const err = new Error(`Something's wrong.
        [payloadToAdds] is EMPTY.
        `)
                console.error(err)
                return
            }

            /**
             * * nextPayloads
            */
            next_payloads.push(...payloadsToAdd)
            _set_state_async({
                payloads: new Set(next_payloads)
                , m_state: {
                    name: "ADDING PAYLOADS"
                    , stage: "DONE"
                    , addedPayloads: payloadsToAdd
                }
            })

        })

        , _removePayloadAsync = async (
            ...payloadsToRemove: P[]
        ) => {

            const { m_state }
                = await _set_state_async()

            if (m_state.name !== "IDLE"
                || !payloadsToRemove.length
            ) {
                return
            }

            const { payloads }
                = await _set_state_async({
                    m_state: {
                        name: "REMOVING PAYLOADS"
                        , stage: "PROCESSING"
                    }
                })
                , nextPayloadsSet = new Set(payloads)
                , removedPayloads = [] as P[]
                , unableToRemovedPayloads = [] as P[]

            payloadsToRemove.forEach(payload => {
                ; (
                    nextPayloadsSet.delete(payload)
                        ? removedPayloads
                        : unableToRemovedPayloads
                ).push(payload)
            })

            const state_2 = await _set_state_async({
                payloads: removedPayloads.length
                    ? nextPayloadsSet
                    : payloads

                , m_state: {
                    name: "REMOVING PAYLOADS"
                    , removedPayloads
                    , unableToRemovedPayloads
                    , stage: "DONE"
                }
            })

            console.log({ state_2 })

        }

        , { addItemButtonsMap } = _memo([createPayloadFnMap], () => {
            if (!createPayloadFnMap) {
                return {}
            }
            const keys = keysOf(createPayloadFnMap)
            return {
                keys
                , addItemButtonsMap: Object.fromEntries(
                    keys.map(k => [
                        k
                        , () => _addPayloadAsync(k)
                    ] as ButtonGroupEntryItem
                    )
                )
            }
        })

        ,
        /**
         * * [_removePayloadAsync]
         */
        _handleResetButtonClick
            = () => _removePayloadAsync(...state.payloads)

        ,
        /**
         * * [_removePayloadAsync]
         */
        _handleCloseButtonClick: NonNullable<SurfaceNodeProps<P>["onCloseButtonClick"]>
            = ({ surfaceNode: { payload } }) => _removePayloadAsync(payload)

        , _handleLayoutButtonClick = _cb([
            state.surfaceNodesMap
        ], async () => {

            if (!_refs.current.el) {
                return
            }

            const { surfaceNodesMap } = state
                , { width, height }
                    = _refs.current.el.getBoundingClientRect()

                , spatialNodes = [...surfaceNodesMap.values()].map(({ spatialNode }) => spatialNode)
                , positions = spatialNodes.map(({ position }) => position)
                , transformations = spatialNodes.map(({ transformation }) => transformation)
                , { jiterredPositions } = _jitterPositions({
                    containerSize: { width, height }
                    , transformations
                })

            spatialNodes.forEach((spatialNode, i) => {
                spatialNode.updatePosition(
                    jiterredPositions[i]
                )
            })

        })

        , _handleSpatialNodeChange: NonNullable<SurfaceNodeProps<P>["onChange"]>
            = ({ eventKind, surfaceNode }) => {
                const {
                    surfaceNodesMap
                } = state

                    , {
                        current: {
                            COUNTERS
                        }
                    } = _refs
                    ; (COUNTERS[eventKind] ??= 0)
                COUNTERS[eventKind]++

                console.log(
                    _t()
                    , {
                        eventKind
                        , surfaceNode
                        , surfaceNodesMap
                        , COUNTER: COUNTERS[eventKind]
                    })
            }

        , _handleSpatialNodeMount: NonNullable<SurfaceNodeProps<P>["onMount"]>
            = ({
                eventKind
                , surfaceNode
                , surfaceNode: {
                    payload
                    , spatialNode
                }
            }) => {

                const {
                    surfaceNodesMap
                    , payloads
                } = state

                surfaceNodesMap.set(
                    surfaceNode.payload
                    , surfaceNode
                )
                    ;
                ;[...surfaceNodesMap.entries()]
                    .forEach(([payloadID, node]) => {

                        if (!payloads.has(payloadID)) {
                            surfaceNodesMap.delete(payloadID)
                        }

                    })


                const { current: { COUNTERS } } = _refs
                    ;
                ; (COUNTERS[eventKind] ??= 0)
                COUNTERS[eventKind]++

                console.log(
                    _t()
                    , {
                        eventKind
                        , surfaceNode
                        , surfaceNodesMap
                        , COUNTER: COUNTERS[eventKind]
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

        , _getEventData = (): BoardSurface_EventData<P>[] => {
            const { surfaceNodesMap } = state
            return [...surfaceNodesMap.entries()].map(([
                payload
                , surfaceNode
            ]) => ({
                payload
                , surfaceNode
            }))
        }


        , _handleInputViewClose = () => {
            _set_state({
                inputViewInfo: {
                    ...state.inputViewInfo
                    , isOpen: false
                }
            })
            onInputViewClose?.()
        }


    _effect([
        boardSurfaceRef
        , ...pickFromAsTuple(
            state
            , "numberOfItems"
            , "payloads"
            , "surfaceNodesMap"
        )
    ], () => {
        if (!boardSurfaceRef) {
            return
        }
        boardSurfaceRef.current
            = pickFrom(
                state
                , "numberOfItems"
                , "payloads"
                , "surfaceNodesMap"
            )
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
            payloads: new Set(payloads_IN)
            , surfaceNodesMap: new Map()
        })
    })


    _effect([state.m_state.name], () => {
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

                onPayloadsAdded?.({
                    eventKind: "payloadsAdded"
                    , addedPayloads
                    , data: _getEventData()
                    , payloads: [...currentPayloads]
                })
                break
            }

            case "REMOVING PAYLOADS": {
                const {
                    m_state: {
                        stage
                        , removedPayloads = []
                        , unableToRemovedPayloads = []
                    }
                    , surfaceNodesMap
                    , payloads: currentPayloads
                } = state

                if (stage !== "DONE") {
                    return
                }
                ;
                ;[...surfaceNodesMap.keys()]
                    .filter(p => !currentPayloads.has(p))
                    .forEach(p => {
                        surfaceNodesMap.delete(p)
                    })

                if (!removedPayloads?.length) {
                    break
                }

                onPayloadsRemoved?.({
                    eventKind: "payloadsRemoved"
                    , data: _getEventData()
                    , removedPayloads
                    , unableToRemovedPayloads
                    , payloads: [...currentPayloads]
                })
                break
            }
        }

        _set_state({
            m_state: {
                name: "IDLE"
                , latestAction: state.m_state.name
            }
        })

    })


    _effect([inputViewInfo], () => {

        if (!inputViewInfo
            || state.inputViewInfo === inputViewInfo
            || _refs.current.previous_inputViewInfo === inputViewInfo
        ) {
            return
        }
        _refs.current.previous_inputViewInfo = inputViewInfo
        _set_state({
            inputViewInfo
        })

    })

    console.log({
        "state.payloads": state.payloads
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
                open={state.inputViewInfo.isOpen}
                onClose={_handleInputViewClose}
                {...inputViewDrawerInfo}
            />

            {state.showInfo && (
                <ObjectView
                    data={{
                        ...omitFrom(state, "inputViewInfo")
                        , "state.inputViewInfo.isOpen": state.inputViewInfo.isOpen
                    }}
                    showOnlyArrayLength
                    top={10}
                    left={10}
                    absolute
                />)}

            <div
                data-payload-collection-container
                className="flex-1 relative w-full"
            >
                {[...state.payloads].map((payload, idx) => {

                    return (
                        <SurfaceNodeComponent
                            key={payload.id}

                            payload={payload}
                            children={children}

                            initialSize={DEFAULT.transform.size}
                            initialPosition={_getNextPosition()}

                            onCloseButtonClick={_handleCloseButtonClick}
                            onChange={_handleSpatialNodeChange}
                            onMount={_handleSpatialNodeMount}
                        >
                            {/* <PayloadRenderer
                                    payload={payload}
                                /> */}
                        </SurfaceNodeComponent>
                    )
                })}
            </div>

            <BoardSurfaceControlPanel
                buttonsAreDisabled={state.inputViewInfo.isOpen}
                buttons={{
                    ...addItemButtonsMap
                    , ...additionalButtonsMap_IN
                    , Sort: {
                        onClick: _handleLayoutButtonClick
                        , disabled: !state.payloads.size
                    }
                    , Reset: {
                        onClick: _handleResetButtonClick
                        , disabled: !state.payloads.size
                    }
                }}
                {...pickFrom(state, "numberOfItems", "showInfo")}
                onChange={_set_state}
            />
        </div>
    )
}
