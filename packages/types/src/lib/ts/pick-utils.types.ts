import { KeyOf } from "./key-of.types"



export type PickRestPartial<
    T extends object
    , K extends KeyOf<T>
> =
    & Pick<T, K>
    & Partial<Omit<T, K>>

export type PickRequired<
    T extends object
    , K extends KeyOf<T>
> =
    & Required<Pick<T, K>>

export type PickRequiredRestPartial<
    T extends object
    , K extends KeyOf<T>
> =
    & PickRequired<T, K>
    & Partial<Omit<T, K>>