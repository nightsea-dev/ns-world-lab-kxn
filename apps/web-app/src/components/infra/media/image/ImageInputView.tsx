import { EventHandlersFromMap, HasData, HasMimeType, HasType, IMAGE_MIME } from "@ns-world-lab-kxn/types"
import {
    _cn, _effect, _isValidUrl, _memo, _tw, _use_state
    , ControlButton_EventMapFor
    , FileDialogInput
    , LoadedFileItem
    , FileDialogInput_Props
    , InputViewLayout,
    FileDialogInput_Ref,
    ImageCard,
    ImageInfo,
    ToggleRS,
    ImageCardDisplayMode,
    ImageCard_Props,
    FileItemRenderer,
    FileItemRenderer_Props,
    Image_FileItemRenderer,
    LoadedFileItemWithPartialError,
    InputView_EventsMap,
    InputView_Props,
} from "@ns-world-lab-kxn/web"
import { ComponentProps, useRef } from "react"






// ======================================== events - IFrameInputView
// export type Image_InputView_EventsMap
//     = InputView_EventsMap<LoadedFileItem>

// ======================================== props - IFrameInputView
export type Image_InputView_Props =
    & InputView_Props<LoadedFileItem>


// ======================================== component
export const Image_InputView = ({
    onDone
    , onCancel
}: Image_InputView_Props
) => {

    const [state, _set_state] = _use_state({
        loadedFileItems: [] as LoadedFileItemWithPartialError[]
        , displayMode: "card" as ImageCardDisplayMode
    })

        , { current: _refs } = useRef({} as {
            fileDialogRef?: FileDialogInput_Ref | null
        })

        , _handle_FileDialogChange: FileDialogInput_Props["onChange"]
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

        , _handle_ControlButton_Clear = () => {
            debugger
            _refs.fileDialogRef?.clear()
        }


        , _handle_ControlButton_Done = () => {
            const { loadedFileItems } = state
            onDone({
                data: loadedFileItems.filter(o => !o.error)
            })
        }



    return (
        <InputViewLayout
            controlButtonsProps={{
                isDisabled: {
                    done: !state.loadedFileItems.length
                    , clear: !state.loadedFileItems.length
                }
                , onDone: _handle_ControlButton_Done
                , onClear: _handle_ControlButton_Clear
                , onCancel: onCancel
                , infoData: state as any
            }}
        >
            {!!state.loadedFileItems.length
                && <ToggleRS
                    checked={state.displayMode === "card"}
                    onChange={({ value }) => {
                        _set_state({ displayMode: value ? "card" : "row" })
                    }}
                    label={<div>displayMode <b>{state.displayMode}</b></div>}
                />
            }
            <FileDialogInput
                multiple
                fileDialogRef={ref => {
                    _refs.fileDialogRef = ref
                }}

                onChange={_handle_FileDialogChange}

                fileItemRenderer={props => (
                    <Image_FileItemRenderer
                        {...props}
                        displayMode={state.displayMode}
                    />
                )}

            />
        </InputViewLayout>
    )
}
