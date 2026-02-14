import { EventHandlersFromMap, HasData, PickRequired, PickRequiredRestPartial } from "@ns-world-lab/types"
import { ImageInfo, LoadedFileItemWithPartialError } from "../../../../types"
import { Box, BoxProps } from "../../../_1_primitive"
import { useImageLoader } from "../../../../hooks"
import { ButtonCollectionRS } from "../../controls"
import { createImageInfo } from "../../../../utils"

// ======================================== 

type EventsMap = {
    imageInfo: HasData<PickRequiredRestPartial<ImageInfo, "id" | "name" | "src">>
    imageFileItem: HasData<LoadedFileItemWithPartialError>
}
type EventHandlers = EventHandlersFromMap<EventsMap>

type Props =
    & EventHandlers
    & Pick<BoxProps, "header">


export const ImageFactory: React.FC<Props> = ({
    onImageInfo
    , onImageFileItem
    , header
}) => {
    const { fetchFn } = useImageLoader({
        // onLoad: ({ data: loadedFileItems }) => onLoad({ data: loadedFileItems })
    })

    return (
        <Box
            header={header ?? "image factory"}
        >
            <ButtonCollectionRS
                buttons={{
                    "generate ImageInfo": async () => {
                        onImageInfo({
                            data: createImageInfo()
                        })
                    }
                    , "generate ImageFileItem": async () => {
                        const {
                            name
                            , src: url
                        } = createImageInfo()
                            , { data: [data] } = await fetchFn({ url, name })
                        onImageFileItem({ data })
                    }
                }}
            />
        </Box>
    )
}



export {
    type EventsMap as ImageFactory_EventsMap
    , type EventHandlers as ImageFactory_EventHandlers
    , type Props as ImageFactory_Props
}

