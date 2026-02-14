import {
    EventHandlersFromMap
    , HasPayloads
    , KeyOf, PayloadWithKind
} from "@ns-world-lab/types";
import { ControlButton_ButtonEventsMapFor } from "../../../../_2_composite";

// ======================================== events
type EventsMap<
    P extends PayloadWithKind<any>
> = ControlButton_ButtonEventsMapFor<{
    done: HasPayloads<P>
}>
// ======================================== types/props
type Props<
    P extends PayloadWithKind<any>
> =
    & EventHandlersFromMap<
        EventsMap<P>
    >
// ======================================== types/renderer
type PayloadLoaderFC<
    P extends PayloadWithKind<any>
> = React.FC<
    Props<P>
>


export {
    type EventsMap as PayloadLoader_EventsMap
    , type Props as PayloadLoader_Props
}
export namespace PayloadLoader {
    export type FC<
        P extends PayloadWithKind<any>
    > = PayloadLoaderFC<P>
}


// ======================================== capability
export type HasPayloadLoader<
    P extends PayloadWithKind<any>
> = {
    payloadLoader: PayloadLoaderFC<P>
}


