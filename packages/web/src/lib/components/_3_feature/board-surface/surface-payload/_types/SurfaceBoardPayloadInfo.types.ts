import { EventHandlersFromMap, HasData, HasNumberOfItems, HasPayloads, PayloadWithKind } from "@ns-world-lab/types"
import React, { ReactNode } from "react"
import { HasPayloadRenderer } from "./PayloadRenderer.types"
import { SurfaceBoard_Payload_InputView } from "./SurfaceBoardPayloadInputView.types"



// ======================================== infos
type PayloadInfo<
    P extends PayloadWithKind<any>
> =
    & HasPayloadRenderer<P>
    & {
        buttonLabel?: ReactNode
        factory?: (ev: HasNumberOfItems) => P[]
        inputViewHeader?: ReactNode
        inputView?: SurfaceBoard_Payload_InputView.FC<P>

        // payloadKind: P["kind"]

    }

// ======================================== infos/map
type PayloadInfos_Map<
    P extends PayloadWithKind<any>
> = {
        [k in P["kind"]]: PayloadInfo<
            Extract<P, { kind: k }>
        >
    }



export {
    type PayloadInfo as SurfaceBoard_PayloadInfo
    , type PayloadInfos_Map as SurfaceBoard_PayloadInfos_Map
}