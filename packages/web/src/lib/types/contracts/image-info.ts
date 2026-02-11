import { HasId, HasPartialError, HasPartialExtent, HasPartialName, HasSource } from "@ns-world-lab/types";

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