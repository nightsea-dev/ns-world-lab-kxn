import React, { FunctionComponent, isValidElement, ReactElement, ReactNode, RefCallback, RefObject, useId, useReducer, useRef } from 'react'
import {
    _capitalise, _jitterPositions, _t
    , keysOf, pickFromAsArray, pickFrom,
    pickFromAsTuple
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
    HasPayloads,
    XOR,
    PickRequiredRestPartial
} from '@ns-lab-knx/types'


import {
    CreatePayloadFn
    , HasSurfaceNode, HasSurfaceNodes, PayloadRenderer, PayloadRendererProps
    , SurfaceNode
    , SurfaceNodeComponent
    , SurfaceNodeProps
} from '../graph'
import { _cb, _effect, _memo, _use_state } from '../../utils'
import { Drawer } from 'rsuite'
import { DrawerInfo, ButtonsMap, DrawerRS, NoData, ObjectView, ButtonGroupEntryItem } from '../ui'


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

export type BoardSurfaceM_State<
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
        payloads: P[] //Set<P>
        // surfaceNodesMap: Map<P["id"], SurfaceNode<P>>
        // surfaceNodesMap: Map<P, SurfaceNode<P>>
        numberOfItems: number
        m_state: BoardSurfaceM_State<P>
        showInfo: boolean
        // controlButtonsAreDisabled: boolean
        /**
         * * currently using [Drawer]
         */
        inputViewInfo: InputViewInfo

    }

// ======================================== events/types
// export type BoardSurface_EventData<
//     P extends PayloadWithKind<any>
// > =
//     // & HasPayloadWithKind<P>
//     & HasSurfaceNode<P>

type BaseBoardSurfaceEvent<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNodes<P>
    & HasPayloads<P>

type PayloadsAddedEvent<
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
        // unableToRemovedPayloads: P[]
    }

// ======================================== events/map
export type BoardSurface_EventsMap<
    P extends PayloadWithKind<any>
> = {
    payloadsAdded:
    & PayloadsAddedEvent<P>

    payloadsRemoved:
    & PayloadsRemovedEvent<P>

    // change:
    // & BaseBoardSurfaceEvent<P>
    // & Pick<
    //     | PayloadsAddedEvent<P>
    //     | PayloadsRemovedEvent<P>
    //     , "eventKind"
    // >

    inputViewClose: {}
}

export type BoardSurface_EventKind
    = KeyOf<BoardSurface_EventsMap<any>>


export type BoardSurfaceRef<
    P extends PayloadWithKind<any>
> = Readonly<
    & Pick<
        BoardSurface_State<P>,
        "numberOfItems"
        | "payloads"
    // | "surfaceNodesMap"
    >
    & HasSurfaceNodesMap<P>
>

// export type BoardSurface_HandleRef<
//     P extends PayloadWithKind<any>
// > =
//     RefObject<BoardSurface_HandleValue<P> | undefined>

// export const useBoardSurfaceHandleRef = <
//     P extends PayloadWithKind<any>
// >() => {
//     return {
//         ref: useRef<BoardSurface_HandleValue<P> | undefined>(undefined)
//     }
// }

// ======================================== props
/**
 * * [BoardSurface] only knows about [Payloads]
 */
export type BoardSurface_Props<
    P extends PayloadWithKind<any>
> =
    & Partial<
        & HasData<P[]>
        & {
            createPayloadFnMap: {
                [k: string]: CreatePayloadFn<P>
            }
            payloadRenderer: PayloadRenderer<P>
            additionalButtonsMap: ButtonsMap
            // isDisabled: boolean

            /**
             * * currently using [Drawer]
             */
            inputViewInfo: InputViewInfo
            boardSurfaceRef: RefCallback<BoardSurfaceRef<P>>
        }

        & EventHandlersFromMap<
            BoardSurface_EventsMap<P>
        >

        & Pick<
            SurfaceNodeProps<P>,
            | "children"
        >

        & {
            onChange: (
                ev:
                    | PayloadsAddedEvent<P>
                    | PayloadsRemovedEvent<P>
            ) => void
        }

    >


