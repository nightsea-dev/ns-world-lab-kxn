import { KeyOf, ValueOf } from "@ns-lab-knx/types";
import { entriesOf } from "./entries-of.util";




export const pickFrom = <
    T extends object
    , K extends KeyOf<T>
>(
    o: T
    , ...keys: K[]
): Pick<T, K> => Object.fromEntries(
    entriesOf(o).filter(([k]) => keys.includes(k as K))
) as Pick<T, K>

    , pickFromAsArray = <
        T extends object
        , K extends KeyOf<T>
    >(
        o: T
        , ...keys: K[]
    ): T[K][] =>
        entriesOf(o).filter(([k]) => keys.includes(k as K))
            .map(([_, v]) => v) as any

    , pickFromAsTuple = <
        T extends object,
        const K extends readonly (KeyOf<T>)[]
    >(
        o: T,
        ...keys: K
    ): { [I in keyof K]: T[K[I]] } =>
        keys.map(k => o[k]) as any

    , omitFrom = <
        T extends object
        , K extends KeyOf<T>
    >(
        o: T
        , ...keys: K[]
    ): Omit<T, K> => Object.fromEntries(
        entriesOf(o).filter(([k]) => !keys.includes(k as K))
    ) as any as Omit<T, K>


export type ExtractFromReturnType<
    T extends object
    , K extends KeyOf<T>
> = {
    extracted: Pick<T, K>
    rest: Omit<T, K>
}

export const extractFrom = <
    T extends object
    , K extends KeyOf<T>
>(
    o: T
    , ...keys: K[]
): ExtractFromReturnType<T, K> => {
    type TOut = ExtractFromReturnType<T, K>
    const out = {
        extracted: {}
        , rest: {}
    } as TOut
    entriesOf(o).forEach(([k, v]) => {
        ; (
            out[
            (keys.includes(k as any) ? "extracted" : "rest") as KeyOf<TOut>
            ] as any
        )[k] = v
    })

    return out

}
