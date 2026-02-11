import { EventHandlersFromMap, HasData, HasError, HasPartialErrorWithDataHandler, PartialEventHandlersFromMap } from "@ns-world-lab/types"
import { ImageInfo } from "../../contracts"
import { Renderer } from "../../capabilities"


export type ImageRendererProps<
    D extends ImageInfo = ImageInfo
> =
    & HasData<D>
    & HasPartialErrorWithDataHandler<D>

export type ImageRenderer<
    P extends ImageRendererProps<any>
> = Renderer<P>
