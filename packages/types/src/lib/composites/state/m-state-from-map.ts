import { KeyOf } from "../../ts";


export type M_StateFromMap<
    M extends Record<string, any>
> = {
    [k in KeyOf<M>]: { name: k } & M[k]
}[KeyOf<M>]
