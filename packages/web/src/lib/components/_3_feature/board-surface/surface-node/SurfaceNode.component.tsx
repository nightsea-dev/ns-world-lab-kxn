import { ReactNode, RefCallback, RefObject } from "react"
import {
    _t,
    HasSpatialNode_UI,
} from "@ns-world-lab/logic"
import {
    EventHandlersWithKindFromMap,
    HasPartialChildren
    , HasPayload
    , HasPayloadWithKind, PartialEventHandlersWithKindFromMap
    , PayloadWithKind,
    XOR
} from "@ns-world-lab/types"
import {
    SpatialNode_Component
    , SpatialNode_EventHandlers
    , SpatialNode_Props,
    SpatialNodeRef
} from "../../../_2_composite/spatial/SpatialNode.component"
import { HasPartialPayloadRenderer, HasPayloadRenderer, ObjectViewPayloadRenderer, PayloadRenderer } from "../surface-payload"
import { SurfaceNode_PayloadDetail } from "./SurfaceNodePayloadDetail.component"
import { _use_state } from "../../../../utils"
import { HasSurfaceNode } from "./SurfaceNode.types"



// ======================================== events
export type SurfaceNode_Event<
    P extends PayloadWithKind<any>
> =
    & HasSurfaceNode<P>

export type SurfaceNode_EventsMap<
    P extends PayloadWithKind<any>
> = {
    change: SurfaceNode_Event<P>
    , close: SurfaceNode_Event<P>
}

export type HasSurfaceNode_Children<
    P extends PayloadWithKind<any>
> =
    & HasPartialChildren<
        ReactNode | PayloadRenderer.FC<P>
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
        SpatialNode_Props,
        | "children"
        | "content"
        | "contentContainer"
        | keyof SpatialNode_EventHandlers
    >

    & Partial<
        & {
            surfaceNodeRef: RefCallback<SurfaceNode_Ref<P>>
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
    TPayload extends PayloadWithKind<any>
>({
    payload
    , children = ObjectViewPayloadRenderer
    , payloadRenderer

    , onChange
    , onClose

    , surfaceNodeRef

    , ...rest
}: SurfaceNode_Props<TPayload>
) => {

    const [state, _set_state] = _use_state({
        closeRequested: false
    })
    const PayloadRenderer: PayloadRenderer.FC<TPayload>
        = payloadRenderer ?? (
            typeof (children) === "function"
                ? children
                : () => children
        )
        , _handle_CloseButtonClick: SpatialNode_Props["onCloseButtonClick"] = ({
            spatialNode
        }) => {
            _set_state({ closeRequested: true })
                ; !onClose
                    || setTimeout(
                        () => onClose({ eventKind: "close", surfaceNode: { payload, spatialNode } })
                    )

        }

    return (
        state.closeRequested
        || <SpatialNode_Component
            {...rest}

            header={payload.kind}

            onChange={({ spatialNode }) => {
                onChange?.({
                    eventKind: "change"
                    , surfaceNode: { payload, spatialNode }
                })
            }}

            onCloseButtonClick={_handle_CloseButtonClick}

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
            <SurfaceNode_PayloadDetail
                payload={payload}
            />
            <PayloadRenderer
                data-surface-node-component-payload-id={payload.id}
                data-surface-node-component-payload-kind={payload.kind}
                payload={payload}
            />
        </SpatialNode_Component>
    )

}





