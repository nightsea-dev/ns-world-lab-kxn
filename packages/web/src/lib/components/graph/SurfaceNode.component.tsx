import { ReactNode } from "react"
import { getRandomColour, getRandomColourRgbString, HasSpatialNode_UI } from "@ns-lab-klx/logic"
import {
    EventHandlersWithKindFromMap
    , HasChildren
    , HasPayload
    , KindBase
    , PayloadWithKind,
    XOR
} from "@ns-lab-klx/types"
import {
    SpatialNodeComponent
    , SpatialNodeComponentEventHandlers, SpatialNodeComponentProps
} from "./SpatialNode.component"
import {
    HasPayloadRenderer,
    PayloadRenderer
} from "./PayloadRenderer"
import {
    DEFAULT_PayloadRenderer
} from "./PayloadRenderer"
import { _effect, _memo } from "../../utils"



// ======================================== types - graph/surface lexicon
// export type PayloadWithKind<
//     K extends KindBase
// > =
//     & PayloadWithKind<K>

export type HasSurfacePayload<
    // K extends KindBase
    P extends PayloadWithKind<any>
> =
    & HasPayload<
        P
    // & SurfacePayload<K>
    >

export type HasSurfacePayloadCollection<
    // K extends KindBase
    P extends PayloadWithKind<any>
> = {
    payloads: P[]// SurfacePayload<K>[]
}


/**
 * * [SpatialNode_UI] with [KindedPayload]
 */
export type SurfaceNode<
    // K extends KindBase
    P extends PayloadWithKind<any>
> =
    & HasSpatialNode_UI
    & HasSurfacePayload<P>

export type HasSurfaceNode<
    // K extends KindBase
    P extends PayloadWithKind<any>
> = {
    surfaceNode: SurfaceNode<P>
}
// ======================================== events
export type SurfaceNodeEvent<
    // K extends KindBase
    P extends PayloadWithKind<any>
>
    =
    & HasSurfaceNode<P>

export type SurfaceNodeEventsMap<
    // K extends KindBase
    P extends PayloadWithKind<any>
>
    = {
        change: SurfaceNodeEvent<P>
        , closeButtonClick: SurfaceNodeEvent<P>
        , mount: SurfaceNodeEvent<P>
    }

// ======================================== props
export type SurfaceNodeProps<
    //    K extends KindBase
    P extends PayloadWithKind<any>
>
    = Omit<
        SpatialNodeComponentProps,
        | "children"
        | "content"
        | "contentContainer"
        | keyof SpatialNodeComponentEventHandlers
    >
    & HasSurfacePayload<P>
    & {
        children?: ReactNode | PayloadRenderer<P>
    }
    // & XOR<
    //     HasPayloadRenderer<P>
    //     , HasChildren<ReactNode>
    // >
    & Partial<
        & EventHandlersWithKindFromMap<
            SurfaceNodeEventsMap<P>
        >
    >
// ========================================
/**
 * * [SpatialNode_UI] with [KindedPayload]
 * 
 * [component]
 */
export const SurfaceNodeComponent
    = <
        //    K extends KindBase
        P extends PayloadWithKind<any>
    >({
        payload
        // , payloadRenderer: PayloadRenderer = DEFAULT_PayloadRenderer
        , children = DEFAULT_PayloadRenderer
        , onChange
        , onCloseButtonClick
        , onMount
        , ...rest
    }: SurfaceNodeProps<P>
    ) => {

        const PayloadRenderer: PayloadRenderer<P>
            = typeof (children) === "function"
                ? children
                : () => children

        return (
            <SpatialNodeComponent
                {...rest}

                onChange={({
                    spatialNode
                }) => {
                    onChange?.({
                        eventKind: "change"
                        , surfaceNode: {
                            payload
                            , spatialNode
                        }
                    })
                }}

                onCloseButtonClick={({
                    spatialNode
                }) => {
                    onCloseButtonClick?.({
                        eventKind: "closeButtonClick"
                        , surfaceNode: {
                            payload
                            , spatialNode
                        }
                    })
                }}

                onMount={({
                    spatialNode
                }) => {
                    onMount?.({
                        eventKind: "mount"
                        , surfaceNode: {
                            payload
                            , spatialNode
                        }
                    })
                }}
            >
                <PayloadRenderer
                    {...{ payload }}
                />
            </SpatialNodeComponent>
        )

    }