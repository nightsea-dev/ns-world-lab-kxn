import { HasId, KeyOf } from "@ns-world-lab/types"

type KeyFn<
    K extends PropertyKey
    , T extends { [k in K]: any }
> = (o: T) => K

export const findByKey = <
    K extends PropertyKey
    , T extends { [k in K]: any }
>(
    A: Iterable<T>
    , B: Iterable<T>
    , key_or_fn: | KeyFn<K, T> | K
) => {
    const keyFn: KeyFn<K, T> = typeof (key_or_fn) === "function"
        ? key_or_fn
        : ((o) => o[key_or_fn])

        , out = {
            foundIn_A: [] as T[]
            , remaining_in_A: [] as T[]
        }
        , A_keys = new Set(
            [...B].map(keyFn)
        )
        ;[...A].forEach(o => {
            out[
                A_keys.has(keyFn(o))
                    ? "foundIn_A" : "remaining_in_A"
            ].push(o)
        })

    return { ...out, A, B }
}

    , findById = <
        T extends HasId
    >(
        A: Iterable<T>
        , B: Iterable<T>
    ) => findByKey(A, B, "id")


    // ----------------------------------------
    ,
    /**
     * * expensive => prefer a map
     */
    toRemoveByKey = <
        K extends PropertyKey
        , T extends { [k in K]: any }
    >(
        ...args: Parameters<typeof findByKey<K, T>>
    ) => {
        const {
            foundIn_A: toRemove
            , remaining_in_A: toKeep
            , ...rest
        } = findByKey(...args)
        return {
            toRemove
            , toKeep
            , ...rest
        }
    }
    , toRemoveById = <
        T extends HasId
    >(
        A: Iterable<T>
        , B: Iterable<T>
    ) => toRemoveByKey(A, B, "id")
