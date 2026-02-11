import { Position, Position_KEYS } from "@ns-world-lab/types";


export const areEqualPositions = (
    a: Position
    , b: Position
) => Position_KEYS.every(k => a[k] === b[k])