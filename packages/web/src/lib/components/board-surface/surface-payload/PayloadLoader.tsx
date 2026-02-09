import {
    EventHandlersFromMap
    , HasPayloads
    , KeyOf, PayloadWithKind
} from "@ns-world-lab-knx/types";
import { ControlButton_EventMapFor } from "../../ui";
import { Renderer } from "../../../types";

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

