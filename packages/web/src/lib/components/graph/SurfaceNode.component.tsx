import { ReactNode } from "react"
import {
    HasSpatialNode_UI,
    SpatialNode
} from "@ns-lab-knx/logic"
import {
    HasPartialChildren
    , HasPayload
    , HasPayloadWithKind, PartialEventHandlersWithKindFromMap
    , PayloadWithKind
} from "@ns-lab-knx/types"
import {
    SpatialNodeComponent
    , SpatialNodeComponentEventHandlers
    , SpatialNodeComponentProps
} from "./SpatialNode.component"
import {
    PAYLOAD_RENDERERS
    , PayloadRenderer
} from "./PayloadRenderer"
import { _effect, _getById, _memo } from "../../utils"



// ======================================== types - graph/surface lexicon
/**
 * * [SpatialNode_UI/HasTransformation] with [KindedPayload]
 * 
 * [type]
 */
export type SurfaceNode<
    P extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<P>
    & HasSpatialNode_UI

export type HasSurfaceNode<
    P extends PayloadWithKind<any>
> = {
    surfaceNode: SurfaceNode<P>
}
// ======================================== events
export type SurfaceNodeEvent<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNode<P>

export type SurfaceNodeEventsMap<
    P extends PayloadWithKind<any>
> = {
    change: SurfaceNodeEvent<P>
    , closeButtonClick: SurfaceNodeEvent<P>
    , mount: SurfaceNodeEvent<P>
}

export type HasSurfaceNodeChildren<
    P extends PayloadWithKind<any>
> =
    & HasPartialChildren<
        ReactNode | PayloadRenderer<P>
    >

// ======================================== props
export type SurfaceNodeProps<
    P extends PayloadWithKind<any>
>
    =
    & HasPayloadWithKind<P>
    & HasSurfaceNodeChildren<P>

    & Omit<
        SpatialNodeComponentProps,
        | "children"
        | "content"
        | "contentContainer"
        | keyof SpatialNodeComponentEventHandlers
    >

    & PartialEventHandlersWithKindFromMap<
        SurfaceNodeEventsMap<P>
    >



// ======================================== component
/**
 * [component]
 */
export const SurfaceNodeComponent = <
    P extends PayloadWithKind<any>
>({
    payload
    , children = PAYLOAD_RENDERERS.ObjectViewRenderer

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

            header={payload.kind}

            onChange={({ spatialNode }) => {
                onChange?.({
                    eventKind: "change"
                    , surfaceNode: { payload, spatialNode }
                })
            }}

            onCloseButtonClick={({ spatialNode }) => {
                onCloseButtonClick?.({
                    eventKind: "closeButtonClick"
                    , surfaceNode: { payload, spatialNode }
                })
            }}

            onMount={({ spatialNode }) => {
                onMount?.({
                    eventKind: "mount"
                    , surfaceNode: { payload, spatialNode }
                })
            }}
        >
            <PayloadRenderer payload={payload} />
        </SpatialNodeComponent>
    )

}





