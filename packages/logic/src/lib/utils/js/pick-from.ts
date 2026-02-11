import { KeyOf, ValueOf } from "@ns-world-lab-kxn/types";
import { entriesOf } from "./entries-of.util";

export const pickFromAsTuple = <
    T extends object
    , const K extends readonly (KeyOf<T>)[]
>(
    o: T,
    ...keys: K
): { [I in keyof K]: T[K[I]] } =>
    keys.map(k => o[k]) as any


    , pickFromAsArray = <
        T extends object
        , K extends KeyOf<T>
    >(
        o: T
        , ...keys: K[]
    ): T[K][] => {
        const keysSet = new Set(keys)
        return entriesOf(o).filter(([k]) => keysSet.has(k as K))
            .map(([_, v]) => v) as any
    }

    ,
    /**
     * * [ByKey]
     */
    pickFrom = <
        T extends object
        , K extends KeyOf<T>
    >(
        o: T
        , ...keys: K[]
    ): Pick<T, K> => {
        const keysSet = new Set(keys)
        return Object.fromEntries(
            entriesOf(o).filter(([k]) => keysSet.has(k as K))
        ) as Pick<T, K>
    }


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

/**
 * * [ByKey]
 */
export const extractFrom = <
    T extends object
    , K extends KeyOf<T>
>(
    o: T
    , ...keys: K[]
): ExtractFromReturnType<T, K> => {
    type TOut = ExtractFromReturnType<T, K>
    const keysSet = new Set(keys)
        , out = {
            extracted: {}
            , rest: {}
        } as TOut
    entriesOf(o).forEach(([k, v]) => {
        ; (
            out[
            (keysSet.has(k as any) ? "extracted" : "rest") as KeyOf<TOut>
            ] as any
        )[k] = v
    })

    return out

}
