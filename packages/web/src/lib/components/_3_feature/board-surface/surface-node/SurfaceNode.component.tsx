import { ReactNode, RefCallback, RefObject } from "react"
import {
    _t,
    HasSpatialNode_UI,
} from "@ns-world-lab-kxn/logic"
import {
    EventHandlersWithKindFromMap,
    HasPartialChildren
    , HasPayload
    , HasPayloadWithKind, PartialEventHandlersWithKindFromMap
    , PayloadWithKind,
    XOR
} from "@ns-world-lab-kxn/types"
import {
    SpatialNode,
    SpatialNode_Component
    , SpatialNodeComponentEventHandlers
    , SpatialNode_Component_Props,
    SpatialNodeRef
} from "../../../_2_composite/spatial/SpatialNode.component"
import { HasPartialPayloadRenderer, HasPayloadRenderer, ObjectViewPayloadRenderer, PayloadRenderer } from "../surface-payload"
import { SurfaceNode_PayloadInfo_Component } from "./SurfaceNodePayloadInfo.component"



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
export type SurfaceNode_Event<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNode<P>

export type SurfaceNode_EventsMap<
    P extends PayloadWithKind<any>
> = {
    change: SurfaceNode_Event<P>
    , closeButtonClick: SurfaceNode_Event<P>
    // , mount: SurfaceNodeEvent<P>
}

export type HasSurfaceNode_Children<
    P extends PayloadWithKind<any>
> =
    & HasPartialChildren<
        ReactNode | PayloadRenderer<P>
    >

export type SurfaceNode_Ref<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNode<P>
    & Pick<SpatialNodeRef, "action">





// ======================================== props
export type SurfaceNode_Props<
    P extends PayloadWithKind<any>
>
    =
    & HasPayloadWithKind<P>

    & XOR<
        HasSurfaceNode_Children<P>
        , HasPartialPayloadRenderer<P>
    >

    & Omit<
        SpatialNode_Component_Props,
        | "children"
        | "content"
        | "contentContainer"
        | keyof SpatialNodeComponentEventHandlers
    >

    & Partial<
        & {
            surfaceNodeRef: RefCallback<
                & SurfaceNode_Ref<P>
            >
        }
        & EventHandlersWithKindFromMap<
            SurfaceNode_EventsMap<P>
        >
    >




// ======================================== component
/**
 * [component]
 */
export const SurfaceNode_Component = <
    P extends PayloadWithKind<any>
>({
    payload
    , children = ObjectViewPayloadRenderer
    , payloadRenderer

    , onChange
    , onCloseButtonClick

    , surfaceNodeRef

    , ...rest
}: SurfaceNode_Props<P>
) => {

    const R: PayloadRenderer<P>
        = payloadRenderer ?? (
            typeof (children) === "function"
                ? children
                : () => children
        )

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
            <SurfaceNode_PayloadInfo_Component
                payload={payload}
            />

            {/* <ObjectViewWithToggle
                data={payload}
                //isShown={state.showInfo}
                //onChange={({ isShown: showInfo }) => _set_state({ showInfo })}
                toggleProps={{
                    size: "xs"
                }}
                className={`
                    absolute 
                    bottom-2 
                    left-0
                    scale-50 
                    hover:scale-150
                    opacity-50
                    hover:opacity-100
                    transition-all
                    duration-200
                    origin-bottom-left
                    `}
            /> */}

            <R
                data-surface-node-component-payload-id={payload.id}
                data-surface-node-component-payload-kind={payload.kind}
                payload={payload}
            />
        </SpatialNode.Component>
    )

}





export namespace SurfaceNode {
    export const Component = SurfaceNode_Component
    export type Props<
        P extends PayloadWithKind<any>
    > = SurfaceNode_Props<P>
    export type Ref<
        P extends PayloadWithKind<any>
    > = SurfaceNode_Ref<P>
    export type EventsMap<
        P extends PayloadWithKind<any>
    > = SurfaceNode_EventsMap<P>
    export type Event<
        P extends PayloadWithKind<any>
    > = SurfaceNode_Event<P>
}