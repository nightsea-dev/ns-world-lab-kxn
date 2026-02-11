import { HasId, HasPartialError, HasPartialExtent, HasPartialName, HasSource } from "@ns-world-lab-kxn/types";

export type ImageInfo =
    & HasId
    & HasSource
    & HasPartialName
    & HasPartialExtent
    & HasPartialError


export type HasImageInfo
    = {
        imageInfo: ImageInfo
    }