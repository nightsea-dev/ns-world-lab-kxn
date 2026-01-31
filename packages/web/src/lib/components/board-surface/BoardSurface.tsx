import React, { FunctionComponent, ReactElement, ReactNode, useId, useReducer, useRef } from 'react'
import { _capitalise, _jitterPositions, _t, createID, createIdeaWithAuthor, createPosition, createSize, entriesOf, getRandomColour, HasSpatialNode_UI, pickFrom, SpatialNode, SpatialNode_UI } from "@ns-lab-klx/logic"
import {
    HasData
    , Position
    , Transformation
    , HasKind
    , KindBase
    , EventHandlersWithKindFromMap,
    PayloadWithKind,
    KeyOf,
    M_StateFromMap,
    PartialOrFull,
} from '@ns-lab-klx/types'
import {
    _cn, _effect, _use_state
    , ObjectView
    , PayloadRendererProps
    , HasSurfacePayload
    , HasSurfacePayloadCollection
    , SurfaceNodeComponent
    , SurfaceNodeProps
    , HasPayloadRenderer
    , HasCreatePayloadFn,
    ButtonTw,
    SurfaceNodeEvent,
    SurfaceNode,
    _cb,
    _memo
} from "@ns-lab-klx/web"
import { Button, Input } from 'rsuite'
import { BoardSurfaceControlPanel } from './BoardSurfaceControlPanel'


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

// ======================================== types

export type BoardSurfaceNodesMap<
    P extends PayloadWithKind<any>
> = Map<P, SurfaceNode<P>>

export type HasBoardSurfaceNodesMap<
    P extends PayloadWithKind<any>
> = {
    nodesMap: BoardSurfaceNodesMap<P>
}

// ======================================== types - M_STATES

type Stage = "PROCESSING" | "DONE"
type M_STATES_MAP<
    P extends PayloadWithKind<any>
> = {
    IDLE: {}
    "ADD PAYLOADS": {
        stage: Stage
        addedPayloads?: P[]
    }
    "REMOVE PAYLOADS": {
        stage: Stage
        removedPayloads?: P[]
        unableToRemovedPayloads?: P[]
    }
}

export type BoardSurfaceM_State<
    P extends PayloadWithKind<any>
> = M_StateFromMap<M_STATES_MAP<P>>

/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurfaceState<
    P extends PayloadWithKind<any>
> =
    & {
        payloads: Set<P>
        numberOfItems: number
        m_state: BoardSurfaceM_State<P>
        surfaceNodesMap: Map<P, SurfaceNode<P>>
        showInfo: boolean
    }

// ======================================== events
type EventPairEntry<
    P extends PayloadWithKind<any>
> = {
    payload: P
    node?: SurfaceNode<P>
}

export type BoardSurfaceEventBase<
    P extends PayloadWithKind<any>
> =
    & HasData<EventPairEntry<P>[]>

export type BoardSurfaceEventsMap<
    P extends PayloadWithKind<any>
> = {

    nodesAdded:
    & BoardSurfaceEventBase<P>
    & {
        addedNodes: P[]
    }

    , nodesRemoved:
    & BoardSurfaceEventBase<P>
    & {
        removedPayloads: P[]
        unableToRemovedPayloads: P[]
    }

}

// ======================================== state


// ======================================== props
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurfaceProps<
    P extends PayloadWithKind<any>
> =
    & Partial<
        & HasKind<P["kind"]>
        & HasData<P[]>
        & HasCreatePayloadFn<P>
        // & HasPayloadRenderer<P>
        & EventHandlersWithKindFromMap<BoardSurfaceEventsMap<P["kind"]>>

        & Pick<
            SurfaceNodeProps<P>,
            | "children"
        >
    >



// ======================================== component
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export const BoardSurface = <
    P extends PayloadWithKind<any>
>({
    kind
    , data: payloads_IN
    , createPayloadFn
    // , payloadRenderer: PayloadRenderer
    , children = DEFAULT.PayloadRenderer

    , onNodesAdded
    , onNodesRemoved

}: BoardSurfaceProps<P>
) => {

    const id = useId()

        , [state, _set_state] = _use_state({
            numberOfItems: 1
            , payloads: new Set()
            , m_state: {
                name: "IDLE"
            }
            , surfaceNodesMap: new Map()
            , showInfo: true
        } as BoardSurfaceState<P>
        )

        ,
        /**
         * [_cb]
         */
        _set_state_async = _cb(async <
            K extends KeyOf<BoardSurfaceState<P>>
        >(
            partial = {} as PartialOrFull<BoardSurfaceState<P>, K>
        ) => {
            return new Promise<{
                state: BoardSurfaceState<P>
            }>(
                res => {
                    _set_state(p => {
                        p = {
                            ...p
                            , ...partial
                        }
                        setTimeout(() => res({
                            state: p
                        }))
                        return p
                    })
                })
        })

        , _refs = useRef({
            el: undefined as undefined | HTMLElement | null
            // , surfaceNodesMap: new Map<P, SurfaceNode<P>>()
            , COUNTERS: {} as Record<string, number>
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

            return {
                x: (container_width - default_width) / 2
                , y: (container_height - default_height) / 2
            } as Position

        })

        , _addPayloadAsync = async () => {

            const {
                m_state
                , numberOfItems
                , payloads: payloadsSet
            } = state
                , nextPayloads = [...payloadsSet]

            if (m_state.name !== "IDLE") {
                return
            }

            if (
                !createPayloadFn
            ) {
                const err = new Error(`[createPayloadFn] is required.
Unabled to [create/add] [payload].
`)
                console.error(err)
                return
            }

            await _set_state_async({
                m_state: {
                    name: "ADD PAYLOADS"
                    , stage: "PROCESSING"
                }
            })

            const payloadsToAdd = Array.from({ length: numberOfItems })
                .map(() => createPayloadFn())

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
            nextPayloads.push(...payloadsToAdd)
            _set_state({
                payloads: new Set(nextPayloads)
                , m_state: {
                    name: "ADD PAYLOADS"
                    , stage: "DONE"
                    , addedPayloads: payloadsToAdd
                }
            })

        }

        , _removePayloadAsync = async (
            ...payloadsToRemove: P[]
        ) => {
            const {
                m_state
                , payloads
            } = state

                , nextPayloadsSet = new Set(payloads)

            if (m_state.name !== "IDLE"
                || !payloadsToRemove.length
            ) {
                return
            }

            await _set_state_async({
                m_state: {
                    name: "REMOVE PAYLOADS"
                    , stage: "PROCESSING"
                }
            })
            const removedPayloads = [] as P[]
                , unableToRemovedPayloads = [] as P[]

            payloadsToRemove.forEach(payload => {
                ; (
                    nextPayloadsSet.delete(payload)
                        ? removedPayloads
                        : unableToRemovedPayloads
                ).push(payload)
            })

            _set_state({
                payloads: removedPayloads.length
                    ? nextPayloadsSet
                    : state.payloads

                , m_state: {
                    name: "REMOVE PAYLOADS"
                    , removedPayloads
                    , unableToRemovedPayloads
                    , stage: "DONE"
                }
            })

        }

        , _handleAddNodeButtonClick
            = _addPayloadAsync

        , _handleResetButtonClick
            = () => _removePayloadAsync(...state.payloads)

        , _handleCloseButtonClick: NonNullable<SurfaceNodeProps<P>["onCloseButtonClick"]>
            = ({ surfaceNode: { payload } }) => _removePayloadAsync(payload)

        , _handleLayoutButtonClick = () => {
            if (!_refs.current.el) {
                return
            }

            const {
                surfaceNodesMap
            } = state
                , {
                    width
                    , height
                } = _refs.current.el.getBoundingClientRect()
                , spatialNodes = [...surfaceNodesMap.values()].map(({ spatialNode }) => spatialNode)
                , positions = spatialNodes.map(({ position }) => position)
                , transformations = spatialNodes.map(({ transformation }) => transformation)
                , { jiterredPositions } = _jitterPositions({
                    containerSize: {
                        width
                        , height
                    }
                    , transformations
                })

            spatialNodes.forEach((spatialNode, i) => {
                spatialNode.updatePosition(
                    jiterredPositions[i]
                )
            })

        }

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
                    .forEach(([payload, node]) => {

                        if (!payloads.has(payload)) {
                            surfaceNodesMap.delete(payload)
                        }

                    })


                const {
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


        , { _getEventPairEntries, _getNodesFromPayloads } = _memo([_refs], () => ({
            _getNodesFromPayloads: ((
                ...payloads: P[]
            ) => {
                const {
                    surfaceNodesMap
                } = state
                return payloads.map(payload => {
                    return surfaceNodesMap.get(payload)!
                })
            })

            , _getEventPairEntries: ((): EventPairEntry<P>[] => {
                const {
                    surfaceNodesMap
                } = state
                return [...surfaceNodesMap.entries()].map(([
                    payload
                    , surfaceNode
                ]) => ({
                    payload
                    , surfaceNode
                }))
            })

        }))



    _effect([], () => {
        if (state.payloads.size) {
            return
        }
        /**
         * * add 1 as per [KLX] base
         */
        _addPayloadAsync()
    })

    _effect([payloads_IN], () => {

        if (!payloads_IN
            || (
                payloads_IN.length === state.payloads.size
                && payloads_IN.every(p => state.payloads.has(p))
            )
        ) {
            return
        }
        _set_state({
            payloads: new Set(payloads_IN)
        })
    })


    _effect([state.m_state], () => {
        switch (state.m_state.name) {
            case "IDLE": {
                return
            }
            case "ADD PAYLOADS": {
                const {
                    stage
                    , addedPayloads = []
                } = state.m_state
                if (stage !== "DONE") {
                    return
                }
                if (!addedPayloads.length
                    || !onNodesAdded
                ) {
                    break
                }
                onNodesAdded({
                    eventKind: "nodesAdded"
                    , addedNodes: _getNodesFromPayloads(...addedPayloads)
                    , data: _getEventPairEntries()
                })
                break
            }
            case "REMOVE PAYLOADS": {
                const {
                    stage
                    , removedPayloads = []
                    , unableToRemovedPayloads = []
                } = state.m_state
                if (stage !== "DONE") {
                    return
                }
                if (
                    !onNodesRemoved?.length
                    || !unableToRemovedPayloads?.length
                ) {
                    break
                }
                onNodesRemoved({
                    eventKind: "nodesRemoved"
                    , data: _getEventPairEntries()
                    , removedPayloads
                    , unableToRemovedPayloads
                })
                break
            }
        }

        _set_state({
            m_state: {
                name: "IDLE"
            }
        })

    })

    return (
        <div
            id={id}
            className="h-full flex flex-col relative"
            ref={el => {
                _refs.current.el = el
            }}
        >
            <div
                className={`
                    absolute top-0 left-0 
                    m-0 
                    p-0
                    ---rounded-[5px] 
                    ---px-3 ---py-1 
                    ---bg-gray-200
                    `}
            >
                {state.showInfo &&
                    <ObjectView
                        data={state}
                        showOnlyArrayLength
                    />
                }
            </div>
            <div
                data-payload-collection-container
                className="flex-1 relative w-[100%]"
            >
                {[...state.payloads].map((payload, i) => {

                    // debugger
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
                buttonsMap={{
                    [`Add ${_capitalise(kind ?? "Item")}`]: _handleAddNodeButtonClick
                    , Jitter: {
                        onClick: _handleLayoutButtonClick
                        , disabled: !state.payloads.size
                    }
                    , Reset: {
                        onClick: _handleResetButtonClick
                        , disabled: !state.payloads.size
                    }
                }}
                {...pickFrom(state, "numberOfItems", "showInfo")}
                // numberOfItems={state.numberOfItems}
                // showInfo={state.showInfo}
                onChange={_set_state}
                onEnterKey={_addPayloadAsync}
            />
        </div>
    )
}
