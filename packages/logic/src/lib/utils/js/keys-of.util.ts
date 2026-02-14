import { KeyOf, ValueOf } from "@ns-world-lab/types";

export const keysOf = <
    T extends object
>(
    o: T
    , options = {} as {
        sorted?: boolean
    }
) => {
    const keys = Object.keys(o) as KeyOf<T>[]
    return options?.sorted
        ? keys.sort((a, b) => a.localeCompare(b))
        : keys
}


export const valuesOf = <
    T extends object
>(o: T): ValueOf<T>[] =>
    [...Object.values(o)]

