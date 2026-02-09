import {
    HasData
    , HasName, HasSource, HasId,
    HasDimentions
} from "@ns-world-lab-knx/types"
import { Renderer } from "../../../../types"

export type ImageInfo =
    & HasId
    & HasSource
    & Partial<
        & HasName
    >

export type ImageInfoWithPartialDimensions =
    & ImageInfo
    & Partial<HasDimentions>


export type ImageRendererProps<
    I extends ImageInfoWithPartialDimensions = ImageInfoWithPartialDimensions
> =
    & HasData<I>


export type ImageRenderer<
    P extends ImageRendererProps<any>
> = Renderer<P>
