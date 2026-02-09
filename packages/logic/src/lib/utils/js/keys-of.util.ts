import { KeyOf, ValueOf } from "@ns-world-lab-knx/types";

export const keysOf = <
    T extends object
>(o: T) => Object.keys(o) as KeyOf<T>[]


export const valuesOf = <
    T extends object
>(o: T): ValueOf<T>[] =>
    [...Object.values(o)]

