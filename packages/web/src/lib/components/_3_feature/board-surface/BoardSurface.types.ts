import React, { RefCallback, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
} from "@ns-world-lab/logic"
import {
    HasData
    , PayloadWithKind
    , M_StateFromMap
    , HasEventKind
    , EventHandlersFromMap
    , KeyOf,
    HasPayloads,
    XOR,
    EventHandler,
    HasPayloadKind,
    ExtractEventsMap,
    ExtractEventHandlersMap
} from '@ns-world-lab/types'
import { SurfaceNode_ButtonAction } from './hooks'
import { HasSurfaceNodes, HasSurfaceNodesMap, SurfaceNode_Props } from './surface-node'
import { SurfaceBoard_PayloadInfos_Map } from './surface-payload'
import { BoardSurface_ControlPanel_EventsMap } from './control-panel'





// ======================================== types - M_STATES

type _Stage = "PROCESSING" | "DONE"

export type BoardSurface_M_State<
    P extends PayloadWithKind<any>
> =
    | {
        name: "IDLE"
        latestAction?: string
    }
    | {
        name: "ADDING PAYLOADS"
        stage: _Stage
        addedPayloads?: P[]
    }
    | {
        name: "REMOVING PAYLOADS"
        stage: _Stage
        removedPayloads?: P[]
    }
    | {
        name: "PAYLOAD ACTION BUTTON"
        stage: "DONE"
        action: SurfaceNode_ButtonAction
    }

// ======================================== state

/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurface_State<
    P extends PayloadWithKind<any>
> =
    & HasPayloads<P>
    & {
        numberOfItems: number
        m_state: BoardSurface_M_State<P>
        showInfo: boolean
        currentPayloadKind?: P["kind"]
    }

// ======================================== events/types
type BaseBoardSurface_Event<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNodes<P>
    & HasPayloads<P>

type PayloadsAdded_Event<
    P extends PayloadWithKind<any>
> =
    & BaseBoardSurface_Event<P>
    & HasEventKind<"payloadsAdded">
    & {
        addedPayloads: P[]
    }

type PayloadsRemoved_Event<
    P extends PayloadWithKind<any>
> =
    & BaseBoardSurface_Event<P>
    & HasEventKind<"payloadsRemoved">
    & {
        removedPayloads: P[]
    }

// ======================================== events/map
type BaseBoardSurface_EventsMap<
    P extends PayloadWithKind<any>
> = {
    payloadsAdded: PayloadsAdded_Event<P>

    payloadsRemoved: PayloadsRemoved_Event<P>

    inputViewClose: {}
}


export type BoardSurface_Ref<
    P extends PayloadWithKind<any>
> = Readonly<
    & Pick<
        BoardSurface_State<P>,
        "numberOfItems"
        | "payloads"
    >
    & HasSurfaceNodesMap<P>
>

export type BoardSurface_ChangeEvent<
    P extends PayloadWithKind<any>
> =
    | PayloadsAdded_Event<P>
    | PayloadsRemoved_Event<P>

export type BoardSurface_ChangeEventHandler<
    P extends PayloadWithKind<any>
> = (ev: BoardSurface_ChangeEvent<P>) => void


// ======================================== props
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurface_Props<
    P extends PayloadWithKind<any>
> =
    & XOR<
        & {
            payloadInfosMap: SurfaceBoard_PayloadInfos_Map<P>
        }
        , & Pick<
            SurfaceNode_Props<P>,
            | "children"
        >
    >

    & Partial<
        & HasData<P[]>
        & {
            boardSurfaceRef: RefCallback<BoardSurface_Ref<P>>
        }

        & EventHandlersFromMap<
            & BaseBoardSurface_EventsMap<P>
        >
        & EventHandlersFromMap<{
            controlPanelNumberOfItemsEnterKey:
            & BoardSurface_ControlPanel_EventsMap["numberOfItemsEnterKey"]
            & {
                cb: EventHandler<
                    & {
                        doContinue: boolean
                    }
                    & HasPayloadKind<P["kind"]>
                >
            }
        }>
        & {
            onChange: BoardSurface_ChangeEventHandler<P>
        }

    >



// ======================================== events/derived
export type BoardSurface_EventsMap<
    P extends PayloadWithKind<any>
> = ExtractEventsMap<BoardSurface_Props<P>>

export type BoardSurface_EventHandlers<
    P extends PayloadWithKind<any>
> = ExtractEventHandlersMap<BoardSurface_Props<P>>

export type BoardSurface_EventKind
    = KeyOf<BoardSurface_EventsMap<any>>


