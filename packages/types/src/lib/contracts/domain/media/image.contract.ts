import { HasKind, HasName, HasSource } from "../../../capabilities"
import { HasId, HasPartialExtent, HasSize, Size } from "../../../primitives"
import { HasMimeType } from "./mime-type"



// ========================================
export type Image =
    & HasId
    & HasName
    & HasSource
    & HasMimeType
    & HasPartialExtent
    & {
        size: number
        file: File
    }


/**
 * [domain]
 */
export type ImageWithKind =
    & Image
    & HasKind<"image">



