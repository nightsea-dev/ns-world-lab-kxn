import { EventHandlersFromMap, PayloadWithKind } from "@ns-world-lab/types"
import { InputView_EventsMap } from "../../../../_4_layout"

// ======================================== input-view/events
type EventsMap<
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
type Props<
    P extends PayloadWithKind<any>
> =
    & EventHandlersFromMap<
        EventsMap<P>
    >

// ======================================== input-view
type SurfaceBoard_Payload_InputView_FC<
    P extends PayloadWithKind<any>
> = React.FC<
    Props<P>
>






export {
    type Props as SurfaceBoard_Payload_InputView_Props
    , type EventsMap as SurfaceBoard_Payload_InputView_EventsMap
}


export namespace SurfaceBoard_Payload_InputView {
    export type FC<
        P extends PayloadWithKind<any>
    > = SurfaceBoard_Payload_InputView_FC<P>
}

