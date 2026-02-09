

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

export type XOR<T, U> =
    | (T & Without<U, T>)
    | (U & Without<T, U>)

export type XOR_3<T, U, V> =
    XOR<T, XOR<U, V>>
