import { HasKind } from "../../capabilities"
import { KeyOf } from "../../ts"


/**
 * * SuffixAndCapitaliseKey
 */
type Sx<
    K extends string
>
    = `on${Capitalize<K>}`



// ======================================== handlers

type BaseEventHandler<
    Ev extends object
>
    = (ev: Ev) => void

export type EventHandler<
    Ev extends object
>
    = Ev extends object
    ? (
        KeyOf<Ev> extends never
        ? () => void
        : BaseEventHandler<Ev>
    )
    : BaseEventHandler<Ev>

export type HasEventHandler<
    EvKind extends string
    , Ev extends object
> = {
        [k in `on${Capitalize<EvKind>}`]: EventHandler<Ev>
    }


export type HasPartialEventHandler<
    EvKind extends string
    , Ev extends object
> = Partial<
    HasEventHandler<EvKind, Ev>
>

// ======================================== handlers - f/map
export type EventHandlersFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as Sx<k>]: EventHandler<EvMap[k]>
    }


export type PartialEventHandlersFromMap<
    EvMap extends Record<string, object>
> = Partial<EventHandlersFromMap<EvMap>>

// ======================================== events - w/kind
export type HasEventKind<
    K extends any = unknown
> = {
    eventKind: K
}

export type EventWithKind<
    Ev extends object
    , K extends string
> =
    & Ev
    & HasEventKind<K>

export type EventsWithKindFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap>]: EventWithKind<EvMap[k], k>
    }



// ======================================== handlers - w/kind
export type EventHandlersWithKindFromMap<
    EvMap extends Record<string, object>
> = {
        [k in KeyOf<EvMap> as Sx<k>]: EventHandler<
            & EventWithKind<EvMap[k], k>
        >
    }

export type PartialEventHandlersWithKindFromMap<
    EvMap extends Record<string, object>
> = Partial<
    EventHandlersWithKindFromMap<EvMap>
>



// ======================================== extract handlers
//type AnyEventHandler = EventHandler<any>
type AnyFn = (...args: any[]) => any;
type OnKeyToKind<K> =
    K extends `on${infer Name extends string}`
    ? Uncapitalize<Name>
    : never

type HandlerEvent<F>
    =
    F extends (ev: infer Ev) => any
    ? (
        Ev extends object
        ? Ev
        : {}
    )
    : (
        F extends () => any
        ? {}
        : never
    )

export type ExtractEventHandlersMap<T extends object> = {
    [k in KeyOf<T> as
    k extends `on${string}`
    ? (
        NonNullable<T[k]> extends AnyFn ? k : never
    )
    : never
    ]: Extract<NonNullable<T[k]>, AnyFn>
}


export type ExtractEventsMap<T extends object> = {
    [K in keyof ExtractEventHandlersMap<T> as OnKeyToKind<K>]
    : HandlerEvent<ExtractEventHandlersMap<T>[K]>
}