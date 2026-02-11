import { ImgHTMLAttributes, useReducer } from "react"
import { HasImageInfo, ImageInfo } from "../types"
import { _cb } from "../utils"
import {
    HasData, HasError
    , HasErrorWithDataHandler, HasExtent, HasPartialErrorWithDataHandler, PartialEventHandlersFromMap
} from "@ns-world-lab-kxn/types"

export type UseImageExtentInput =
    & HasData<ImageInfo>
    & PartialEventHandlersFromMap<{
        load: HasData<ImageInfo>
    }>
    & HasPartialErrorWithDataHandler<ImageInfo>

export type UseImageExtentOutput =
    Required<
        Pick<
            ImgHTMLAttributes<HTMLImageElement>
            , "onLoad" | "onError"
        >
    >

export const useImageExtent = ({
    data: imageInfo
    , onLoad: onLoad_IN
    , onError: onError_IN
}: UseImageExtentInput
): UseImageExtentOutput => {
    if (!imageInfo) {
        throw new Error(`[imageInfo] is required.`)
    }
    const [, _update_component] = useReducer(x => x + 1, 0)
        , onLoad = _cb<UseImageExtentOutput["onLoad"]>([imageInfo]
            , ev => {

                const {
                    naturalWidth: width
                    , naturalHeight: height
                } = ev.currentTarget as HTMLImageElement
                imageInfo.extent = {
                    width
                    , height
                }
                console.log({ imageInfo })
                onLoad_IN?.({ data: imageInfo })
                _update_component()
            })
        , onError = _cb<UseImageExtentOutput["onError"]>([imageInfo]
            , errorEvent => {
                const error = Object.assign(
                    new Error("Unable to determine [image_extent].")
                    , {
                        imageInfo
                        , errorEvent
                    }
                )
                imageInfo.error = error
                console.error(error)

                    ;
                ; !onError_IN || setTimeout(() => onError_IN({
                    data: imageInfo
                    , error
                }))

            })
    return {
        onLoad
        , onError
    }
}
