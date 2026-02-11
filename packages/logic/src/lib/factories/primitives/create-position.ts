import { Position } from "@ns-world-lab/types";

export const EMPTY_Position
    = Object.freeze({
        x: 0
        , y: 0
    } as Position)

    , createPosition = (
        o = {} as Partial<Position>
    ): Position => ({
        ...EMPTY_Position
        , ...o
    })

