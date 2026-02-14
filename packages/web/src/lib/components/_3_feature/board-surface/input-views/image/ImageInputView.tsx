import { useRef } from "react"
import {
    ExtractEventHandlersMap,
    ExtractEventHandlersMapPartial
} from "@ns-world-lab/types"

import { Panel, StatHelpText } from "rsuite"
import { BoolKey, LoadedFileItemWithPartialError } from "../../../../../types"
import {
    InputView, InputView_EventsMap, InputView_Props, InputViewLayout
    , InputViewLayout_Props
} from "../../../../_4_layout"
import { _cb, _memo, _use_state } from "../../../../../utils"
import { Image_FileItemRenderer, ImageCardDisplayMode } from "../../../../_2_composite"
import { Box, ToggleRS } from "../../../../_1_primitive"
import { useCollectionWithKey, useMountCounter } from "../../../../../hooks"
import { DropArea_DEFAULT, DropAreaLayout } from "../../../file/DropArea"
import {
    FileItemLoaderDialogWithList, DialogFileLoaderWithList_Props, FileItemLoaderWithListView_Props, FileItemLoaderWithListView_Ref
    , ManualImageLoaderWithList, ManualImageLoaderWithList_Props
} from "../../../file"
import { _t } from "@ns-world-lab/logic"

// ======================================== data
type TData = LoadedFileItemWithPartialError


// ======================================== events
type EventsMap
    = InputView_EventsMap<TData>

// ======================================== props
type Props =
    & InputView_Props<TData>

    & Pick<
        FileItemLoaderWithListView_Props,
        | "reversedListAdding"
    >

// ======================================== component/ClickDropArea
const ImageDropArea: DropAreaLayout.FC = ({
    isDroppable
    , placeholder = DropArea_DEFAULT.placeholders[String(!!isDroppable) as BoolKey]
}) => {
    return (
        <div
            className={`
                hover:bg-amber-500
                m-4
                `}
        >
            {placeholder}
            {/* Click/Drop AREA */}
        </div>
    )
}



// ======================================== component
export const Image_InputView: InputView.FC<Props> = ({
    reversedListAdding = true
    , onDone
    , onCancel
}) => {


    const {
        state: collectionState
        , actionHandlers: collection
        , state: {
            current: loadedFileItems
        }
        , handleActionEvent
    } = useCollectionWithKey<LoadedFileItemWithPartialError, "fileID">({ key: "fileID" })

        , [state, _set_state] = _use_state({
            displayMode: "card" as ImageCardDisplayMode
            , isDroppable: true
        })

        , { current: _refs } = useRef({} as {
            fileDialogLoader?: FileItemLoaderWithListView_Ref | null
            manualImageLoader?: FileItemLoaderWithListView_Ref | null
        })

        , loaderHandlers: ExtractEventHandlersMapPartial<DialogFileLoaderWithList_Props & ManualImageLoaderWithList_Props>
            = _memo([handleActionEvent], () => {

                return {
                    onChange: handleActionEvent
                    , onIsDroppableChange: _set_state
                }

            })

        , controlHandlers = _memo([
            collection
            //, getStateAsync
            , _refs.fileDialogLoader
            , _refs.manualImageLoader
        ], () => ({
            onClear: () => {
                _refs.fileDialogLoader?.clear()
                _refs.manualImageLoader?.clear()
            }
            , onDone: async () => {
                // debugger
                const { current: loadedFileItems } = await collection.getStateAsync()
                onDone({
                    data: loadedFileItems.filter(o => !o.error)
                })
            }
            , onCancel
        } as Pick<
            ExtractEventHandlersMap<InputViewLayout_Props["controlButtonsProps"]>,
            | "onClear"
            | "onDone"
            | "onCancel"
        >))

        , {
            data: counterData
        } = useMountCounter(Image_InputView)

    return (
        <InputViewLayout
            controlButtonsProps={{
                isDisabled: {
                    done: !loadedFileItems.length
                    , clear: !loadedFileItems.length
                }
                , infoData: {
                    inputViewState: state
                    , collectionState
                } as any
                , infoDataViewHeader: Image_InputView.name

                , ...controlHandlers
            }}
        >
            {!!loadedFileItems.length
                && <ToggleRS
                    checked={state.displayMode === "card"}
                    onChange={({ value }) => {
                        _set_state({ displayMode: value ? "card" : "row" })
                    }}
                    label={<div>displayMode <b>{state.displayMode}</b></div>}
                />
            }
            {/* <div>
                counterData.mount: {counterData.mount}<br />
                counterData.dismount: {counterData.dismount}<br />
                isDroppable:{String(state.isDroppable)}
            </div> */}
            <Panel
                header="Manual Input"
                // hidden
                collapsible
                bordered
                // defaultExpanded
            >
                <ManualImageLoaderWithList
                    reversedListAdding={reversedListAdding}
                    fileItemCollectionRef={ref => { _refs.manualImageLoader = ref }}
                    fileItemRenderer={props => (
                        <Image_FileItemRenderer
                            {...props}
                            displayMode={state.displayMode}
                        />
                    )}

                    // onChange={_handle_FileDialogChange}
                    {...loaderHandlers}

                />
            </Panel>
            <Panel
                header={"Click/Drop"}
                bordered
                collapsible
                // defaultExpanded={true}
            >
                <FileItemLoaderDialogWithList
                    reversedListAdding={reversedListAdding}
                    fileItemCollectionRef={ref => { _refs.fileDialogLoader = ref }}
                    multiple
                    isDroppable={state.isDroppable}
                    onIsDroppableChange={_set_state}

                    fileItemRenderer={props => {
                        const mProps = _memo([state.displayMode], () => ({
                            ...props
                            , displayMode: state.displayMode
                        }))
                        return <Image_FileItemRenderer
                            {...mProps}
                        />
                    }}

                    // onChange={_handle_FileDialogChange}
                    // onIsDroppableChange={_set_inputViewState}
                    {...loaderHandlers}


                >
                    {/* {ImageDropArea} */}
                </FileItemLoaderDialogWithList>
            </Panel>
        </InputViewLayout>
    )
}


export {
    type EventsMap as Image_InputView_EventsMap
    , type Props as Image_InputView_Props
}

