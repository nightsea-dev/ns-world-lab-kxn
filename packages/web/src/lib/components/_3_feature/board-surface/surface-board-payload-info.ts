import { EventHandlersFromMap, HasData, HasNumberOfItems, HasPayloads, PayloadWithKind } from "@ns-world-lab-kxn/types"
import { HasPayloadRenderer, PayloadLoader, PayloadRenderer } from "./surface-payload"
import { FunctionComponent, ReactNode } from "react"

// ======================================== AsyncFactories

// export type AsyncPayloadFactory_Callback_Event<
//     P extends PayloadWithKind<any>
// > = HasData<P[]>

// export type AsyncPayloadFactory_Callback<
//     P extends PayloadWithKind<any>
// > = (ev: AsyncPayloadFactory_Callback_Event<P>) => void

// export type AsyncPayloadFactory_Event<
//     P extends PayloadWithKind<any>
// > = {
//     numberOfItems: number
//     cb: AsyncPayloadFactory_Callback<P>
// }

// export type AsyncPayloadFactory_Fn<
//     P extends PayloadWithKind<any>
// > = (
//     ev: AsyncPayloadFactory_Event<P>
// ) => void

export type SurfaceBoardPayload_InputView_EventsMap<
    P extends PayloadWithKind<any>
> = {
    done: HasData<P[]>
    cancel: {}
    inputViewChange: {
        isOpen: boolean
    }
}
export type SurfaceBoardPayload_InputView_Props<
    P extends PayloadWithKind<any>
> =
    & EventHandlersFromMap<
        SurfaceBoardPayload_InputView_EventsMap<P>
    >

export type SurfaceBoardPayload_InputView<
    P extends PayloadWithKind<any>
> = FunctionComponent<
    SurfaceBoardPayload_InputView_Props<P>
>

export type SurfaceBoardPayload_Info<
    P extends PayloadWithKind<any>
> =
    & HasPayloadRenderer<P>
    & {
        buttonLabel?: ReactNode
        factory?: (ev: HasNumberOfItems) => P[]
        inputViewHeader?: ReactNode
        inputView?: SurfaceBoardPayload_InputView<P>

        // payloadKind: P["kind"]
        // payloadRenderer?: PayloadRenderer<P>

        // onClick?: (ev: {
        //     numberOfItems: number
        // }, cb: () => void) => void
        // // loader?: PayloadLoader<P>
        // onChange?: (
        //     ev:
        //         & {
        //             currentPayloads: P[]
        //         }
        //         & (
        //             | {
        //                 eventKind: "add"
        //                 addedPayloads: []
        //             }
        //             | {
        //                 eventKind: "remove"
        //                 removedPayloads: []
        //             }
        //             | {
        //                 eventKind: "change"
        //             }
        //         )
        // ) => void
    }


export type SurfaceBoardPayload_InfosMap<
    P extends PayloadWithKind<any>
> = {
        [K in P["kind"]]: SurfaceBoardPayload_Info<
            Extract<P, { kind: K }>
        >
    }
