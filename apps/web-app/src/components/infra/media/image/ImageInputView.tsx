import { EventHandlersFromMap, HasData, HasMimeType, HasType, IMAGE_MIME } from "@ns-lab-knx/types"
import {
    _cn, _effect, _isValidUrl, _memo, _tw, _use_state
    , Box
    , ControlButton_EventMapFor
    , ControlButtons
    , FileDialogInput
    , LoadedFileItem
    , FileDialogInputProps
    , InputViewLayout,
    FileDialogRef,
    ImageCard,
    ImageInfo,
    FileItemWithPartialUrlAndPartialFileID,
    FileItemWithUrlAndFileID,
    ToggleRS,
    ImageCardDisplayMode
} from "@ns-lab-knx/web"
import { useRef } from "react"


const {
    fileID
    , name
    , lastModified
    , type
} = {} as LoadedFileItem

type ImageFileWithDimensions
    = & Omit<LoadedFileItem, "type">
    & HasType<IMAGE_MIME>

const _transform_FileItemWithPartialUrlAndPartialFileID_to_ImageInfo
    = ({
        url: src
        , fileID: id
        , name
    }: FileItemWithUrlAndFileID
    ): ImageInfo => ({
        id
        , src
        , name
    })


const _transform_loadedFileItem_to_ImageInfo
    = ({
        url: src
        , fileID: id
        , name
    }: LoadedFileItem
    ): ImageInfo => ({
        id
        , src
        , name
    })



// ======================================== events - IFrameInputView
export type ImageInputViewEventsMap =
    ControlButton_EventMapFor<{
        done: HasData<LoadedFileItem[]>
    }
        , "clear"
    >

// ======================================== props - IFrameInputView
export type ImageInputViewProps =
    & EventHandlersFromMap<ImageInputViewEventsMap>



// ======================================== component
export const ImageInputView = ({
    onDone
    , onCancel
}: ImageInputViewProps
) => {

    const [state, _set_state] = _use_state({
        loadedFileItems: [] as LoadedFileItem[]
        , displayMode: "card" as ImageCardDisplayMode
    })

        , { current: _refs } = useRef({} as {
            fileDialogRef?: FileDialogRef | null
        })

        , { imageInfosMapByFileId } = _memo([state.loadedFileItems], () => {
            return {
                imageInfosMapByFileId: Object.fromEntries(
                    state.loadedFileItems.map(o => [
                        o.fileID
                        , _transform_loadedFileItem_to_ImageInfo(o)
                    ])
                )
            }
        })

        , _handleFileDialogChange: FileDialogInputProps["onChange"]
            = ev => {
                const {
                    eventKind
                    , loadedFileItems
                } = ev
                _set_state({
                    loadedFileItems
                })
                switch (eventKind) {
                    case "added fileItems": {
                        break
                    }
                    case "removed  fileItems": {
                        break
                    }
                    case "clear": {
                        break
                    }
                }

            }

        , _handleControlClear = () => {
            debugger
            _refs.fileDialogRef?.clear()
        }


        , _handleControlDone = () => {
            const { loadedFileItems: data } = state
            onDone({ data })
        }

    return (
        <InputViewLayout
            controlButtonsProps={{
                isDisabled: {
                    done: !state.loadedFileItems.length
                    , clear: !state.loadedFileItems.length
                }
                , onDone: _handleControlDone
                , onCancel: onCancel
                , onClear: _handleControlClear
                , infoData: state as any
            }}
        >
            <ToggleRS
                checked={state.displayMode === "card"}
                onChange={({ value }) => {
                    _set_state({ displayMode: value ? "card" : "row" })
                }}
            />
            <FileDialogInput
                multiple
                fileDialogRef={ref => {
                    _refs.fileDialogRef = ref
                }}
                onChange={_handleFileDialogChange}
                fileRenderer={({ data }) => {
                    const {
                        fileID
                    } = data as Required<typeof data>
                    return (
                        <ImageCard
                            data={imageInfosMapByFileId[fileID]}
                            width={200}
                            displayMode={state.displayMode}
                        />
                    )

                }}
            // onClick={_handle_FileDialogInput_Click}
            // placeholder={placeholder}
            />
        </InputViewLayout >
    )
}
