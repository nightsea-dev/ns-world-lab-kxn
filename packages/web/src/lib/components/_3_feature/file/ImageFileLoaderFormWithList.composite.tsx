import { ExtractEventHandlersMap, KeyOf } from "@ns-world-lab/types"
import { _cn, _memo, _use_state } from "../../../utils"
import { ImageFileLoaderForm, ImageFileLoaderForm_Props } from "./ImageFileLoaderForm"
import React from "react"
import { FileItemListView, FileItemListView_Props } from "./FileItemListView"
import { useCollectionWithKey, useImageLoader } from "../../../hooks"
import { LoadedFileItemWithPartialError } from "../../../types"
import { FileItemLoaderWithListView } from "./FileItemLoaderWithListView.types"
import { ButtonCollectionRS } from "../../_2_composite"
import { createImageSource } from "@ns-world-lab/logic"


type Data = LoadedFileItemWithPartialError

type DataProviderProps = {}
// action/behaviour (takes precendence over display/rendering of data) => verb=>noun principle
// & Pick<
//     ManualImageFileLoader_Props,
//     // | "onLoad"
// >

type ListDisplayProps =
    // view/display
    & Pick<
        FileItemListView_Props,
        // | "data"
        | "className"
        | "noDataPlaceholder"
        | "headerProps"
        | "fileItemRenderer"
        | "header" //"tableHeader"

        | "onItemError"
        | "onClearButtonClick"
        | "onItemCloseButtonClick"
    // | "onClick"
    // | "children"
    // | "dataProvider"


    // | "fileItemListRef"
    // | "reversedListAdding"
    // | "onChange"
    >
// & {
//     listProps: Pick<
//         FileItemList_Props,
//         | "className"
//     >
// }



export type ManualImageLoaderWithList_Props =
    & DataProviderProps
// & ListDisplayProps


export const ManualImageLoaderWithList: FileItemLoaderWithListView.FC<ManualImageLoaderWithList_Props>
    = props => {

        const {
            className
            , fileItemRenderer
            , header
            , headerProps
            , noDataPlaceholder

            , onClearButtonClick: onClearButtonClick_IN
            , onItemCloseButtonClick: onItemCloseButtonClick_IN
            , onItemError

            , fileItemCollectionRef
            , reversedListAdding
            , onChange
        } = {
            ...props as Omit<
                typeof props,
                KeyOf<DataProviderProps>
            >
        }

            , {
                actionHandlers: collection
                , state
                , getStateAsync
                , handleActionEvent
            } = useCollectionWithKey<Data, "fileID">({
                key: "fileID"
                , reversedListAdding
                , onChange
            })


            , listViewProps = _memo<
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

            ], () => ({
                className
                , fileItemRenderer
                , header
                , headerProps
                , noDataPlaceholder

                , onClearButtonClick: ev => {
                    collection.clear()
                    onClearButtonClick_IN?.(ev)
                }
                , onItemCloseButtonClick: ev => {
                    collection.remove(ev)
                    onItemCloseButtonClick_IN?.(ev)
                }
                , onItemError


            }))

            , dataProviderProps
                = _memo<
                    Pick<ImageFileLoaderForm_Props, "onLoad">
                >([collection], () => ({
                    onLoad: ({ data }) => collection.add({ data })
                    , enableFactoryButtons: true
                }))

            , {
                // onLoad: dataProvider_onLoad
            } = props as Omit<
                typeof props,
                KeyOf<ListDisplayProps>
            >

        fileItemCollectionRef?.({
            clear: collection.clear
            , state
        })


        return (
            <div
                data-dialog-file-loader-with-list
            >
                <div
                    data-data-provider
                >
                    <ImageFileLoaderForm
                        {...dataProviderProps}

                    // onLoad={collection.add}
                    />
                </div>
                <div
                    data-list-view
                >
                    <FileItemListView
                        data={state.current}
                        {...listViewProps}

                    />
                </div>

            </div>
        )
    }