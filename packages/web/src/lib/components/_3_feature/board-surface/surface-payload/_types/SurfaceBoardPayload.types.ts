import { EventHandlersFromMap, HasData, HasNumberOfItems, HasPayloads, PayloadWithKind } from "@ns-world-lab-kxn/types"
import { FunctionComponent, ReactNode } from "react"
import { HasPayloadRenderer } from "./PayloadRenderer.types"
import { InputView_EventsMap } from "../../../../_4_layout"

// ======================================== input-view/events
export type SurfaceBoard_Payload_InputView_EventsMap<
    P extends PayloadWithKind<any>
> =
    & InputView_EventsMap<P>
    // & {
    //     /**
    //      * do we need this one?
    //      */
    //     inputViewChange: {
    //         isOpen: boolean
    //         payloadKind: P["kind"]
    //     }
    // }

// ======================================== input-view/props
export type SurfaceBoard_Payload_InputView_Props<
    P extends PayloadWithKind<any>
> =
    & EventHandlersFromMap<
        SurfaceBoard_Payload_InputView_EventsMap<P>
    >

// ======================================== input-view
export type SurfaceBoard_Payload_InputView<
    P extends PayloadWithKind<any>
> = FunctionComponent<
    SurfaceBoard_Payload_InputView_Props<P>
>

// ======================================== infos
export type SurfaceBoard_PayloadInfo<
    P extends PayloadWithKind<any>
> =
    & HasPayloadRenderer<P>
    & {
        buttonLabel?: ReactNode
        factory?: (ev: HasNumberOfItems) => P[]
        inputViewHeader?: ReactNode
        inputView?: SurfaceBoard_Payload_InputView<P>

        // payloadKind: P["kind"]

    }

// ======================================== infos/map
export type SurfaceBoard_PayloadInfos_Map<
    P extends PayloadWithKind<any>
> = {
        [k in P["kind"]]: SurfaceBoard_PayloadInfo<
            Extract<P, { kind: k }>
        >
    }
