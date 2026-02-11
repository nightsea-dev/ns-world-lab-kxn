import { Position, Position_KEYS } from "@ns-world-lab-kxn/types";


export const areEqualPositions = (
    a: Position
    , b: Position
) => Position_KEYS.every(k => a[k] === b[k])