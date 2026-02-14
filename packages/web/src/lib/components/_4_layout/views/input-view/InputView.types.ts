import { EventHandlersFromMap, HasData } from "@ns-world-lab/types"





// ======================================== events
type EventsMap<
    TData extends object
> = {
    done: HasData<TData[]>
    cancel: {}
}
// ======================================== props
type Props<
    TData extends object
> =
    & EventHandlersFromMap<EventsMap<TData>>

// ======================================== props
type InputView_FC<
    // D extends object
    TProps extends Props<any> = Props<any>
> = React.FC<TProps>



export {
    type EventsMap as InputView_EventsMap
    , type Props as InputView_Props
}

export namespace InputView {
    export type FC<
        TProps extends Props<any> = Props<any>
    > = InputView_FC<TProps>
}
