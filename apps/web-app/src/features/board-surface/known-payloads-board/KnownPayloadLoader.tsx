import {
    IFrameWithKind,
    ImageWithKind
} from "@ns-lab-knx/types";
import {
    createID, createImageWithKind
} from "@ns-lab-knx/logic";
import {
    _getFileUrl
    , DrawerInfo
    , ImageUploaderRS
    , Renderer
    , ImageUploaderRS_Props
    , ImageUploaderRS_EventsMap
    , LoadedFileItemWithID,
    _getMimeType,
    getImageDimensionsFromFile,
    FileDialogInput,
    FileDialogInputProps,
    FileLoaderProps,
    FileLoaderEventsMap,
    LoadedFileItem
} from "@ns-lab-knx/web";
import { KnownPayloadKind, KnownPayloadOf } from "./KnownPayloadRenderer";
import { PayloadLoaderProps } from "./PayloadLoader";
import { IFrameDataItem, IFrameInputView, IFrameInputViewProps, ImageInputView, ImageInputViewProps } from "../../../components";
import { FileType } from "rsuite";


// ======================================== transformations/helpers
const _transform_IFrameDataItem_to_IFrameWithKind = ({
    id = createID()
    , name
    , url: src
}: IFrameDataItem
) => {
    return ({
        id
        , kind: "iframe"
        , name
        , src
    } as IFrameWithKind)
}
    , _transform_LoadedFileItemWithID_to_ImageWithKind = async (
        loadedFileItemWithID: LoadedFileItemWithID
    ): Promise<ImageWithKind> => {
        const {
            arrayBuffer
            , bytes
            , fileID
            , id
            , lastModified
            , name
            , size
            , type
            , url: src
            , webkitRelativePath
        } = loadedFileItemWithID

            , {
                dimensions
            } = await getImageDimensionsFromFile(loadedFileItemWithID)

        return {
            dimensions
            , file: loadedFileItemWithID
            , id
            , kind: "image"
            , mimeType: _getMimeType(loadedFileItemWithID)!
            , name
            , size
            , src
        }
    }

    , _transform_LoadedFileItem_to_ImageWithKind = async (
        loadedFileItem: LoadedFileItem
    ): Promise<ImageWithKind> => {
        const {
            arrayBuffer
            , bytes
            , fileID: id
            , lastModified
            , name
            , size
            , type
            , url: src
            , webkitRelativePath
        } = loadedFileItem

            , {
                dimensions
            } = await getImageDimensionsFromFile(loadedFileItem)

        return {
            dimensions
            , file: loadedFileItem
            , id
            , kind: "image"
            , mimeType: _getMimeType(loadedFileItem)!
            , name
            , size
            , src
        }
    }




// ======================================== types/KnownPayload
export type KnownPayloadLoaderProps<
    K extends KnownPayloadKind
> = PayloadLoaderProps<
    KnownPayloadOf<K>
>

export type KnownPayloadLoader<
    K extends KnownPayloadKind
> = Renderer<
    KnownPayloadLoaderProps<K>
>


// ======================================== renderers/iframe/component
export const IFramePayloadLoader
    : KnownPayloadLoader<"iframe">
    = ({
        onCancel
        , onDone
        , onClear
    }) => {

        const _handleIFrameInput
            : IFrameInputViewProps["onDone"]
            = ({ data }) => {

                if (!data.length) {
                    return
                }

                const payloads = data
                    .map(_transform_IFrameDataItem_to_IFrameWithKind)
                    .filter(Boolean)

                onDone({ payloads })

            }
        return (
            <IFrameInputView
                onDone={_handleIFrameInput}
                onCancel={onCancel}
            />
        )
    }

// ======================================== renderers/image/component
export const ImagePayloadLoader
    : KnownPayloadLoader<"image">
    = ({
        onCancel
        , onDone
        , onClear
    }) => {

        const _handleImageInput
            : ImageInputViewProps["onDone"]
            = async ({ data }) => {

                debugger

                if (!data.length || !onDone) {
                    return
                }

                const payloads
                    = await Promise.all(data.map(_transform_LoadedFileItem_to_ImageWithKind)
                        .filter(Boolean))

                onDone({ payloads })

            }

        return (
            <ImageInputView
                onCancel={onCancel}
                onDone={_handleImageInput}
            />

        )

    }






type KnownPayloadDrawerInfosMap
    = Partial<{
        [k in KnownPayloadKind]: DrawerInfo<
            KnownPayloadLoaderProps<
                k
            >
        >
    }>

export const KNOWN_PAYLOAD_LOADER_DRAWER_INFOS_MAP = {
    image: {
        body: ImagePayloadLoader
        , header: (
            <div
                className='text-2xl'
            >Add Images</div>)
    }
    , iframe: {
        body: IFramePayloadLoader
        , header: (
            <div
                className='text-2xl'
            >Add IFrame</div>)
    }

} as KnownPayloadDrawerInfosMap