import { HasError } from "@ns-world-lab-kxn/types"
import {
    FileItemRenderer_Props
    , ImageInfo
    , FileItemRenderer_DataItem
} from "../../../../types"
import { _memo } from "../../../../utils"
import { ImageCard, ImageCard_Props } from "./ImageCard"

export type Image_FileItemRenderer_DataItem =
    & FileItemRenderer_DataItem
// & {
//     fileKind: "image"
// }
// ======================================== helpers
export const _transform_Image_FileItemRenderer_DataItem_to_ImageInfo
    = ({
        url: src
        , fileID: id
        , name
    }: Image_FileItemRenderer_DataItem
    ): ImageInfo => ({
        id, src, name
        //, error, extent
    })


// ======================================== props
export type Image_FileItemRenderer_Props
    =
    & FileItemRenderer_Props<Image_FileItemRenderer_DataItem>
    & Pick<ImageCard_Props, "displayMode">


// ======================================== component
export const Image_FileItemRenderer = ({
    data
    , onError
    , displayMode
    , ...rest
}: Image_FileItemRenderer_Props
) => {
    const { imageInfo } = _memo([data], () => ({
        imageInfo: _transform_Image_FileItemRenderer_DataItem_to_ImageInfo(data)
    }))

    return (
        <ImageCard
            {...rest}
            data-image-file-renderer
            data-image-file-renderer-file-id={data.fileID}
            data={imageInfo}
            displayMode={displayMode}
            width={200}
            onError={({
                data: _imageInfo_
                , error
            }) => {
                const b1 = data.error === error

                    ;
                ; !onError || setTimeout(() => onError?.({
                    data
                    , error
                }))
            }}
        />
    )
}
