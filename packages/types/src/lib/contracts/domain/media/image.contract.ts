import { HasKind, HasName, HasSource } from "../../../capabilities"
import { HasId, HasSize, Size } from "../../../primitives"
import { HasMimeType } from "./mime-type"



// ========================================
export type Image =
    & HasId
    & HasName
    & HasSource
    & HasMimeType
    & {
        size: number
        file: File
        dimensions: Size
    }


/**
 * [domain]
 */
export type ImageWithKind =
    & Image
    & HasKind<"image">



