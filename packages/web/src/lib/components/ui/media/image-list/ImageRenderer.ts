import {
    HasData
    , HasName, HasSource, HasId
} from "@ns-lab-knx/types"
import { Renderer } from "../../../../types"

export type ImageInfo =
    & HasId
    & HasSource
    & Partial<
        & HasName
    >

export type ImageRendererProps<
    I extends ImageInfo = ImageInfo
> =
    & HasData<I>


export type ImageRenderer<
    P extends ImageRendererProps<any>
> = Renderer<P>
