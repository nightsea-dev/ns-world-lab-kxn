import { HasData, HasPartialErrorWithDataHandler } from "@ns-world-lab/types"
import { ImageInfo } from "../../contracts"


export type ImageRenderer_Props<
    D extends ImageInfo = ImageInfo
> =
    & HasData<D>
    & HasPartialErrorWithDataHandler<D>

export namespace ImageRenderer {
    export type FC<
        P extends ImageRenderer_Props<any>
    > = React.FC<P>
    export type Props<
        D extends ImageInfo = ImageInfo
    > = ImageRenderer_Props<D>
}
