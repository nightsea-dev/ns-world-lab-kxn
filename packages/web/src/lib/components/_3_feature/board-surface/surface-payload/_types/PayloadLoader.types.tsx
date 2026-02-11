import {
    EventHandlersFromMap
    , HasPayloads
    , KeyOf, PayloadWithKind
} from "@ns-world-lab-kxn/types";
import { ControlButton_EventMapFor } from "../../../../_2_composite";
import { Renderer } from "../../../../../types";

// ======================================== events
export type PayloadLoader_EventsMap<
    P extends PayloadWithKind<any>
> = ControlButton_EventMapFor<{
    done: HasPayloads<P>
}>
// ======================================== types/props
export type PayloadLoader_Props<
    P extends PayloadWithKind<any>
> =
    & EventHandlersFromMap<
        PayloadLoader_EventsMap<P>
    >
// ======================================== types/renderer
export type PayloadLoader<
    P extends PayloadWithKind<any>
> = Renderer<
    PayloadLoader_Props<P>
>

// ======================================== capability
export type HasPayloadLoader<
    P extends PayloadWithKind<any>
> = {
    payloadLoader: PayloadLoader<P>
}