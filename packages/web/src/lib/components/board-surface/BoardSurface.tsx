import React, { FunctionComponent, isValidElement, ReactElement, ReactNode, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
    , keysOf, pickFromAsArray, pickFrom,
    pickFromAsTuple,
    omitFrom
} from "@ns-lab-knx/logic"
import {
    Position
    , Transformation
    , PayloadWithKind
} from '@ns-lab-knx/types'

import {
    BoardSurfaceControlPanel
} from './BoardSurfaceControlPanel'

import {
    PayloadRendererProps
    , SurfaceNode
    , SurfaceNodeComponent
    , SurfaceNodeProps,
    SurfaceNodeRef
} from '../graph'
import { _cb, _effect, _memo, _use_state } from '../../utils'
import { DrawerInfo, ButtonsMap, DrawerRS, NoData, ObjectView, ButtonGroupEntryItem } from '../ui'
import {
    BoardSurface_Props
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


const _getPayloadIdsSet = <
    P extends PayloadWithKind<any>
>(
    payloads: P[]
) => new Set(
    payloads.map(({ id }) => id)
)

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
    , onInputViewClose
    , onChange

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
            , surfaceNodesMap: new Map()
            , showInfo: true
            , inputViewInfo: {
                isOpen: false
                , content: NoData
            }
        } as BoardSurface_State<P>
        )

        , _refs = useRef({
            el: undefined as undefined | HTMLElement | null
            , COUNTERS: {} as Record<string, number>
            , previous_payloads: undefined as undefined | P[]
            , previous_inputViewInfo: undefined as undefined | InputViewInfo
            , surfaceNodesMap: new Map<P["id"], SurfaceNode<P>>()
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

        , _emitChange: BoardSurface_Props<P>["onChange"]
            = ev => {
                onChange?.(ev)
            }
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
            , createPayloadFnMap
        ], async (
            payloadKind: P["kind"]
        ) => {

            const { m_state } = await _set_state_async()

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

        })

        , _removePayloadAsync = async (
            ...payloadsToRemove: P[]
        ) => {

            const { m_state } = await _set_state_async()

            if (m_state.name !== "IDLE"
                || !payloadsToRemove.length
            ) {
                return {}
            }
            const idsToRemoveSet
                = _getPayloadIdsSet(
                    payloadsToRemove
                )

                , { payloads: current_payloads }
                    = await _set_state_async({
                        m_state: {
                            name: "REMOVING PAYLOADS"
                            , stage: "PROCESSING"
                        }
                    })
                , out = {
                    toRemove: [] as P[]
                    , toKeep: [] as P[]
                }
            current_payloads.forEach(o => {
                out[
                    idsToRemoveSet.has(o.id)
                        ? "toRemove" : "toKeep"
                ].push(o)
            })

            if (out.toRemove.length) {
                const state_2 = await _set_state_async({
                    payloads: out.toKeep
                    , m_state: {
                        name: "REMOVING PAYLOADS"
                        , removedPayloads: out.toRemove
                        , stage: "DONE"
                    }
                })
            }

            return {
                payloads: out.toKeep
                , removedPayloads: out.toRemove
            }

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
            = async () => {
                const {
                    payloads
                    , removedPayloads
                } = await _removePayloadAsync(...state.payloads)
            }

        ,
        /**
         * * [_removePayloadAsync]
         */
        _handleCloseButtonClick: SurfaceNodeProps<P>["onCloseButtonClick"]
            = ({ surfaceNode: { payload } }) => {

                debugger
                _removePayloadAsync(payload)

            }

        , _handleLayoutButtonClick
            = _cb([_refs.current.surfaceNodesMap]
                , async () => {

                    if (!_refs.current.el) {
                        return
                    }

                    const {
                        current: {
                            surfaceNodesMap
                        }
                    } = _refs
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

        , _handleSpatialNodeChange: SurfaceNodeProps<P>["onChange"]
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
                    _t()
                    , {
                        eventKind
                        , surfaceNode
                        , surfaceNodesMap
                        , COUNTER: COUNTERS[eventKind]
                    })
            }

        // , _clean_surfaceNodesMap = () => {
        //     return new Promise<BoardSurface_State<P>>(res => {

        //         _set_state(p => {
        //             const {
        //                 surfaceNodesMap: current_surfaceNodesMap
        //                 , payloads: current_payloads
        //             } = p
        //                 /// remove all nodes without a valid_payload
        //                 , currentPayloadIds = _getPayloadIdsSet(current_payloads)

        //             // test this
        //             for (const k of [...current_surfaceNodesMap.keys()]) {
        //                 // debugger
        //                 if (!currentPayloadIds.has(k)) {
        //                     current_surfaceNodesMap.delete(k)
        //                 }
        //             }

        //             setTimeout(() => res(p))

        //             return p
        //         })
        //     })

        // }

        , _handleSurfaceNodeRef
            = async (
                ref?: SurfaceNodeRef<P> | null
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
                    , c_key = [_handleSurfaceNodeRef.name, action].join(".")
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

                // const {
                //     surfaceNodesMap: current_surfaceNodesMap
                //     , payloads
                // } = state
                //     // , surfaceNodesMap = new Map(current_surfaceNodesMap)
                //     , currentPayloadIDsSet
                //         = _getPayloadIdsSet(
                //             payloads
                //         )

                // current_surfaceNodesMap.set(
                //     surfaceNode.payload.id
                //     , surfaceNode
                // )

                // // maintenance
                // const {
                //     surfaceNodesMap
                // } = await _clean_surfaceNodesMap()

                // const { current: { COUNTERS } } = _refs
                ;
                ; (COUNTERS[c_key] ??= 0)
                COUNTERS[c_key]++

                console.log(
                    _t()
                    , {
                        c_key
                        , surfaceNode
                        , surfaceNodesMap
                        , COUNTER: COUNTERS[c_key]
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

        , _getSurfaceNodes = (): SurfaceNode<P>[] => {
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
            // , "surfaceNodesMap"
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
        // boardSurfaceRef.current
        //     = pickFrom(
        //         state
        //         , "numberOfItems"
        //         , "payloads"
        //         , "surfaceNodesMap"
        //     )
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
            // , surfaceNodesMap: new Map()
        })
    })


    _effect([state.m_state.name], () => {
        // finalise/emit - just for POC of M-state
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
                    , surfaceNodes: _getSurfaceNodes()
                    , payloads: [...currentPayloads]
                }
                onPayloadsAdded?.(ev)
                _emitChange(ev)
                break
            }

            case "REMOVING PAYLOADS": {
                const {
                    m_state: {
                        stage
                        , removedPayloads = []
                    }
                    // , surfaceNodesMap: current_surfaceNodesMap
                    , payloads: current_payloads
                } = state

                if (stage !== "DONE") {
                    return
                }

                // // [surfaceNodesMap] maintenance
                // const currentPayloadIds = _getPayloadIdsSet(current_payloads)
                // for (const k in current_surfaceNodesMap) {
                //     debugger
                //     if (!currentPayloadIds.has(k)) {
                //         current_surfaceNodesMap.delete(k)
                //     }
                // }

                if (!removedPayloads?.length) {
                    break
                }

                const ev: BoardSurface_EventsMap<P>["payloadsRemoved"]
                    = {
                    eventKind: "payloadsRemoved"
                    , surfaceNodes: _getSurfaceNodes()
                    , removedPayloads
                    , payloads: [...current_payloads]
                }
                onPayloadsRemoved?.(ev)
                _emitChange(ev)
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
                            surfaceNodeRef={ref => {
                                _handleSurfaceNodeRef(ref)
                            }}

                            initialSize={DEFAULT.transform.size}
                            initialPosition={_getNextPosition()}

                            onCloseButtonClick={_handleCloseButtonClick}
                            onChange={_handleSpatialNodeChange}
                        // onMount={_handleSpatialNodeMount}

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
                        , disabled: !state.payloads.length
                    }
                    , Reset: {
                        onClick: _handleResetButtonClick
                        , disabled: !state.payloads.length
                    }
                }}
                {...pickFrom(state, "numberOfItems", "showInfo")}
                onChange={_set_state}
            />
        </div>
    )
}
