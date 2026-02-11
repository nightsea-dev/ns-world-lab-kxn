import { EventHandlersFromMap, HasData } from "@ns-world-lab-kxn/types"
import { FunctionComponent } from "react"





// ======================================== events
export type InputView_EventsMap<
    D extends object
> = {
    done: HasData<D[]>
    cancel: {}
}
// ======================================== props
export type InputView_Props<
    D extends object
> =
    & EventHandlersFromMap<InputView_EventsMap<D>>

// ======================================== props
export type InputView<
    D extends object
> =
    & FunctionComponent<InputView_Props<D>>

