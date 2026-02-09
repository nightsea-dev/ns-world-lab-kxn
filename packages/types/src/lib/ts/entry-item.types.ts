import { KeyOf } from "./key-of.types"


export type EntryItem<
    K extends PropertyKey
    , V extends any
> = [k: K, v: V]

export type EntryItemOf<
    T extends object
>
    = {
        [k in Extract<KeyOf<T>, string>]: EntryItem<k, T[k]>
    }[Extract<KeyOf<T>, string>]
