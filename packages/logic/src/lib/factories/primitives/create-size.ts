import { Size } from "@ns-world-lab-kxn/types";
export const EMPTY_Size = Object.freeze({
    width: 0
    , height: 0
} as Size)


    , createSize = (
        o = {} as Partial<Size>
    ): Size => ({
        ...EMPTY_Size
        , ...o
    })
