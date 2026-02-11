import { HasData, HasError } from "../../capabilities";
import { EventHandler, EventHandlersFromMap } from "./event-handlers-from-map";


export type HasErrorWithData<
    D extends any = any
    , E extends string | Event | Error = Error
> =
    & HasError<E>
    & HasData<D>


export type ErrorWithDataHandler<
    D extends any = any
    , E extends string | Event | Error = Error
> = EventHandler<
    HasErrorWithData<D, E>
>

export type HasErrorWithDataHandler<
    D extends any = any
    , E extends string | Event | Error = Error
> = EventHandlersFromMap<{
    error: HasErrorWithData<D, E>
}>

export type HasPartialErrorWithDataHandler<
    D extends any = any
    , E extends string | Event | Error = Error
> = Partial<
    HasErrorWithDataHandler<D, E>
>

