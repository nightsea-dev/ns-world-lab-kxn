import {
    _getFileUrl
    , ControlButton_EventsMap
    , ControlButton_EventMapFor, Renderer
} from "@ns-lab-knx/web";
import {
    EventHandlersFromMap
    , HasPayloads
    , KeyOf, PayloadWithKind
} from "@ns-lab-knx/types";

// ======================================== events
export type PayloadLoaderEventsMap<
    P extends PayloadWithKind<any>
> = ControlButton_EventMapFor<{
    done: HasPayloads<P>
}>
// ======================================== types/props
export type PayloadLoaderProps<
    P extends PayloadWithKind<any>
> =
    & EventHandlersFromMap<
        PayloadLoaderEventsMap<P>
    >
// ======================================== types/renderer
export type PayloadLoader<
    P extends PayloadWithKind<any>
> = Renderer<
    PayloadLoaderProps<P>
>

