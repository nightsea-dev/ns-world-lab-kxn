import React from "react"
import {
    ExtractDataPropsMap,
    ExtractEventHandlersMap,
    KeyOf
} from "@ns-world-lab/types"
import {
    _cb,
    _cn, _effect, _memo, _revokeUrls, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID
    , _use_state
} from "../../../utils"

import { FileItemLoaderDialog, FileItemLoaderDialog_Props } from "./FileItemLoaderDialog"
import { FileItemListView, FileItemListView_Props } from "./FileItemListView"
import { useCollectionWithKey, UseCollectionWithKey_ActionChangeEventHandler } from "../../../hooks"
import { LoadedFileItemWithPartialError } from "../../../types"
import { FileItemLoaderWithListView } from "./FileItemLoaderWithListView.types"
import { _t } from "@ns-world-lab/logic"

type Data = LoadedFileItemWithPartialError


// ======================================== props
type DataProvider_Props =
    // action/behaviour (takes precendence over display/rendering of data) => verb=>noun principle
    & Pick<
        FileItemLoaderDialog_Props,
        // | "className"
        | "isDroppable"
        | "multiple"
        | "showInput"

        | "dropAreaLayout"
        | "children" // dropArea

        // | "onLoad"
        | "onIsDroppableChange"
    >


// verb => noun (naming principle)
// action => ON => data (principle)
type Props =
    & DataProvider_Props
    & {
        onChange?: UseCollectionWithKey_ActionChangeEventHandler<Data, "fileID">
    }
// & ListView_Props


// ======================================== component
export const FileItemLoaderDialogWithList: FileItemLoaderWithListView.FC<Props>
    = props => {

        const {
            dropAreaLayout
            , children
            , isDroppable
            , multiple
            , showInput
            , onIsDroppableChange: onIsDroppableChange_IN

            //  , fileItemListRef
            //  , reversedListAdding
            //  , onChange

        } = props as DataProvider_Props
            // Omit<
            //     typeof props,
            //     KeyOf<ListView_Props>
            // >

            , {
                className
                , fileItemRenderer
                , header
                , headerProps
                , noDataPlaceholder

                , onClearButtonClick: onClearButtonClick_IN
                , onItemCloseButtonClick: onItemCloseButtonClick_IN
                , onItemError

                // , fileItemListRef
                // , reversedListAdding: reverseListAdding

                // , onChange
                , fileItemCollectionRef
                , reversedListAdding
                , onChange: onChange_IN

            } = props as Omit<
                typeof props,
                | KeyOf<DataProvider_Props>
            >


            , {
                actionHandlers: collection
                , state
                , getStateAsync
                , handleActionEvent
            } = useCollectionWithKey<Data, "fileID">({
                key: "fileID"
                , reversedListAdding
                , onChange: onChange_IN
            })

            , dataProviderOnLoadProps = _memo<
                Pick<FileItemLoaderDialog_Props, "onLoad">
            >([collection]
                , () => {
                    console.log(_t(FileItemLoaderDialogWithList), "_handle_DataProviderOnLoad")
                    return {
                        onLoad: ({ data }) => collection.add({ data })
                    }
                })


            , dataProviderProps = _memo([
                dropAreaLayout
                , children
                , isDroppable
                , multiple
                , showInput
                , onIsDroppableChange_IN
                // , collection
            ], () => ({
                children
                , isDroppable
                , multiple
                , showInput
                , onIsDroppableChange: onIsDroppableChange_IN

            } as FileItemLoaderDialog_Props
            ))

            , listViewProps
                = _memo<
                    // Partial<FileItemListView_Props>
                    Omit<FileItemListView_Props, "data">
                >([
                    className
                    , fileItemRenderer
                    , header
                    , headerProps
                    , noDataPlaceholder
                    , onClearButtonClick_IN
                    , onItemCloseButtonClick_IN
                    , onItemError

                    , collection.clear
                    , collection.remove
                    // , fileItemListRef
                    // , reverseListAdding
                    // , onChange

                ], () => ({
                    className
                    , fileItemRenderer
                    , header
                    , headerProps
                    , noDataPlaceholder

                    , onClearButtonClick: (ev: any) => {
                        collection.clear()
                        onClearButtonClick_IN?.(ev)
                    }
                    , onItemCloseButtonClick: (ev) => {
                        collection.remove(ev)
                        onItemCloseButtonClick_IN?.(ev)
                    }
                    , onItemError

                }))


        fileItemCollectionRef?.({
            clear: collection.clear
            , state
        })


        return (
            <div
                data-dialog-file-loader-with-list
            >
                <div
                    data-data-provider-container
                >
                    <FileItemLoaderDialog
                        {...dataProviderProps}
                        {...dataProviderOnLoadProps}
                    />
                </div>
                <div
                    data-list-view-container
                >
                    <FileItemListView
                        data={state.current}
                        {...listViewProps}
                    />
                </div>

            </div>
        )
    }




export {
    type Props as DialogFileLoaderWithList_Props
}
