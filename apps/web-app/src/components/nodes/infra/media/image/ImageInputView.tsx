import { EventHandlersFromMap, HasData } from "@ns-lab-knx/types"
import {
    _cn, _effect, _isValidUrl, _memo, _tw, _use_state
    , Box
    , ControlButton_EventMapFor
    , ControlButtons
    , FileDialogInput
    , LoadedFileItem
    , FileDialogInputProps
    , InputViewLayout
} from "@ns-lab-knx/web"




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
        dataCollection: [] as LoadedFileItem[]
    })

        , _handleAddData: FileDialogInputProps["onLoad"]
            = ({ loadedFileItems }) => {
                if (!loadedFileItems.length) {
                    return
                }

                const {
                    dataCollection
                } = state
                    , current_file_ids = new Set(
                        dataCollection.map(({ fileID }) => fileID)
                    )
                    , toAdd = loadedFileItems.filter(({ fileID }) => !current_file_ids.has(fileID))

                if (!toAdd.length) {
                    return
                }

                const next_dataCollection = [
                    ...dataCollection
                    , ...toAdd
                ]
                _set_state({
                    dataCollection: next_dataCollection
                })

            }


        , _handleControlClear = () => _set_state({
            dataCollection: []
        })


        , _handleControlDone = () => {
            const { dataCollection: data } = state
            onDone({ data })
        }

    return (
        <>
            <InputViewLayout
                controlButtonsProps={{
                    isDisabled: {
                        done: !state.dataCollection.length
                        , clear: !state.dataCollection.length
                    }
                    , onDone: _handleControlDone
                    , onCancel: onCancel
                    , onClear: _handleControlClear
                    , infoData: state as any
                }}
            >
                <FileDialogInput
                    multiple
                    onLoad={_handleAddData}
                // onClick={_handle_FileDialogInput_Click}
                // placeholder={placeholder}
                />
            </InputViewLayout >
            {/* <Box
                data-image-input-view
                className={`
                h-full w-full flex flex-col gap-4 p-6 overflow-auto
                `}
            >

                <ControlButtons
                    justifyChildren="right"
                    bordered={false}
                    showInfoName="Info"
                    isDisabled={{
                        done: !state.dataCollection.length
                        , clear: !state.dataCollection.length
                    }}
                    onDone={_handleControlDone}
                    onCancel={onCancel}
                    onClear={_handleControlClear}
                    infoData={state}
                />

                <div>
                    <FileDialogInput
                        multiple
                        onLoad={_handleAddData}
                    // onClick={_handle_FileDialogInput_Click}
                    // placeholder={placeholder}
                    />
                </div>
            </Box> */}
        </>
    )
}
