import {
    Transformation
} from "@ns-world-lab-kxn/types";
import { createPosition, createSize } from "../primitives";

export const createTransform = (
    o = {} as Partial<Transformation>
): Transformation => ({
    position: createPosition(o?.position)
    , size: createSize(o?.size)
} as Transformation)