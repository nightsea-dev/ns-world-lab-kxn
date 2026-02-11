import React, { FunctionComponent, isValidElement, ReactElement, ReactNode, RefCallback, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
    , keysOf, pickFromAsArray, pickFrom,
    pickFromAsTuple
} from "@ns-world-lab/logic"
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
    HasPayloads,
    XOR,
    PickRequiredRestPartial,
    KindBase,
    EventHandler,
    HasPayloadKind
} from '@ns-world-lab/types'


import {
    HasSurfaceNodes
    , SurfaceNode
    , SurfaceNode_Props
} from './surface-node'
import { CreatePayloadFn, PayloadRenderer, SurfaceBoard_PayloadInfos_Map } from './surface-payload'
import { ButtonsMap, DrawerInfo } from '../../_2_composite'
import { BoardSurface_ControlPanel_EventsMap, BoardSurface_ControlPanel_Props } from './control-panel'


/**
 * @deprecated go for SurfaceBoardPayload_Info
 * 202602110100
 */
export type InputViewInfo = {
    content: ReactNode | FunctionComponent | DrawerInfo
    isOpen: boolean
}

// ======================================== types

export type SurfaceNodesMap<
    P extends PayloadWithKind<any>
> = Map<P["id"], SurfaceNode<P>>

export type HasSurfaceNodesMap<
    P extends PayloadWithKind<any>
> = {
    surfaceNodesMap: SurfaceNodesMap<P>
}

// ======================================== types - M_STATES

type _Stage = "PROCESSING" | "DONE"
type _M_STATES_MAP<
    P extends PayloadWithKind<any>
> = {
    IDLE: {
        latestAction?: string
    }
    "ADDING PAYLOADS": {
        stage: _Stage
        addedPayloads?: P[]
    }
    "REMOVING PAYLOADS": {
        stage: _Stage
        removedPayloads?: P[]
        // unableToRemovedPayloads?: P[]
    }
}

export type BoardSurface_M_State<
    P extends PayloadWithKind<any>
> = M_StateFromMap<_M_STATES_MAP<P>>

// ======================================== state

/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurface_State<
    P extends PayloadWithKind<any>
> =
    & {
        payloads: P[]
        numberOfItems: number
        m_state: BoardSurface_M_State<P>
        showInfo: boolean
        currentPayloadKind?: P["kind"]
    }

// ======================================== events/types
type BaseBoardSurfaceEvent<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNodes<P>
    & HasPayloads<P>

type PayloadsAdded_Event<
    P extends PayloadWithKind<any>
> =
    & BaseBoardSurfaceEvent<P>
    & HasEventKind<"payloadsAdded">
    & {
        addedPayloads: P[]
    }

type PayloadsRemovedEvent<
    P extends PayloadWithKind<any>
> =
    & BaseBoardSurfaceEvent<P>
    & HasEventKind<"payloadsRemoved">
    & {
        removedPayloads: P[]
    }

// ======================================== events/map
export type BoardSurface_EventsMap<
    P extends PayloadWithKind<any>
> = {
    payloadsAdded: PayloadsAdded_Event<P>

    payloadsRemoved: PayloadsRemovedEvent<P>

    inputViewClose: {}
}

export type BoardSurface_EventKind
    = KeyOf<BoardSurface_EventsMap<any>>


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
            & BoardSurface_EventsMap<P>
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
            onChange: (
                ev:
                    | PayloadsAdded_Event<P>
                    | PayloadsRemovedEvent<P>
            ) => void
        }

    >


