import { ReactNode, RefCallback, RefObject } from "react"
import {
    HasSpatialNode_UI,
} from "@ns-world-lab-knx/logic"
import {
    EventHandlersWithKindFromMap,
    HasPartialChildren
    , HasPayload
    , HasPayloadWithKind, PartialEventHandlersWithKindFromMap
    , PayloadWithKind
} from "@ns-world-lab-knx/types"
import {
    SpatialNode,
    SpatialNodeComponent
    , SpatialNodeComponentEventHandlers
    , SpatialNodeComponentProps,
    SpatialNodeRef
} from "../../graph/SpatialNode.component"
import { _effect, _getById, _memo } from "../../../utils"
import { ObjectViewPayloadRenderer, PayloadRenderer } from "../surface-payload"



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
export type HasSurfaceNodes<
    P extends PayloadWithKind<any>
> = {
    surfaceNodes: SurfaceNode<P>[]
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
    // , mount: SurfaceNodeEvent<P>
}

export type HasSurfaceNodeChildren<
    P extends PayloadWithKind<any>
> =
    & HasPartialChildren<
        ReactNode | PayloadRenderer<P>
    >

export type SurfaceNodeRef<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNode<P>
    & Pick<SpatialNodeRef, "action">





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

    & Partial<
        & {
            surfaceNodeRef: RefCallback<
                & SurfaceNodeRef<P>
            >
        }
        & EventHandlersWithKindFromMap<
            SurfaceNodeEventsMap<P>
        >
    >




// ======================================== component
/**
 * [component]
 */
export const SurfaceNodeComponent = <
    P extends PayloadWithKind<any>
>({
    payload
    , children = ObjectViewPayloadRenderer

    , onChange
    , onCloseButtonClick

    , surfaceNodeRef

    , ...rest
}: SurfaceNodeProps<P>
) => {

    const _PayloadRenderer: PayloadRenderer<P>
        = typeof (children) === "function"
            ? children
            : () => children


    return (
        <SpatialNode.Component
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


            spatialNodeRef={ref => {
                if (!surfaceNodeRef || !ref) {
                    return
                }
                const { action, spatialNode } = ref
                // console.log({ ref })
                surfaceNodeRef({
                    surfaceNode: { payload, spatialNode }
                    , action
                })

            }}
        >
            <_PayloadRenderer payload={payload} />
        </SpatialNode.Component>
    )

}





export namespace SurfaceNode {
    export const Component = SurfaceNodeComponent
    export type Props<
        P extends PayloadWithKind<any>
    > = SurfaceNodeProps<P>
}