import { HasKind, HasName, HasSource } from "../../../capabilities"
import { HasId } from "../../../primitives"




// ========================================
export type IFrame =
    & HasId
    & HasSource
    & HasName

/**
 * [domain]
 */
export type IFrameWithKind =
    & IFrame
    & HasKind<"iframe">



