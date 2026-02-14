import React, {
    RefCallback
} from "react"
import {
    toRemoveByKey
    , _t
} from "@ns-world-lab/logic"
import {
    ExtractEventHandlersMap,
    ExtractEventsMap,
    FirstParam,
    HasChildren,
    HasHeader,
    HasId,
    HasLabel
    , KeyOf
    , XOR
} from "@ns-world-lab/types"
import {
    _cb,
    _cn, _effect, _memo, _revokeUrls, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID
    , _use_state
} from "../../../utils"
import {
    FileLoader
    , FileLoader_Props
    , HasFileItemProvider
    , LoadedFileItemWithPartialError
} from "../../../types"
import { FileItemListView, FileItemListView_Props as FileItemListView_Props } from "./FileItemListView"
import { useCollectionWithKey, UseCollectionWithKey_ActionKey, UseCollectionWithKey_ChangeEvent, UseCollectionWithKey_ChangeEventHandler, UseCollectionWithKey_ChangeEventKind, UseCollectionWithKey_ActionHandlersMap, UseCollectionWithKey_Input, useMountCounter } from "../../../hooks"




type Data = LoadedFileItemWithPartialError
type ChangeEvent = UseCollectionWithKey_ChangeEvent<Data, "fileID">
type ChangeHandler = UseCollectionWithKey_ChangeEventHandler<Data, "fileID">
type ChangeEventKind = UseCollectionWithKey_ChangeEventKind
type Ref = Pick<UseCollectionWithKey_ActionHandlersMap<Data, "fileID">, "clear" | "getStateAsync">


// ======================================== props
type Props<
    TProps extends FileLoader_Props<Data> = FileLoader_Props<Data>
> =
    & XOR<
        HasFileItemProvider<TProps>
        , HasChildren<
            FileLoader.FC<TProps>
        >
    >

    & Partial<

        & Pick<UseCollectionWithKey_Input<Data, "fileID">, "reversedListAdding">
        & {
            fileItemListRef: RefCallback<Ref>
            onChange: ChangeHandler
        }

        & Pick<
            FileItemListView_Props,
            | "className"
            | "fileItemRenderer"
            | "header"
            | "headerProps"
            | "noDataPlaceholder"

            | "onClearButtonClick"
            | "onItemCloseButtonClick"
            | "onItemError"
        >

    >




// ======================================== component
// Controls the list state
export const FileItemListWithProvider: React.FC<Props> = ({
    children
    , dataProvider: DP = children!

    , className
    , fileItemRenderer
    , header
    , headerProps
    , noDataPlaceholder
    , onClearButtonClick
    , onItemCloseButtonClick
    , onItemError


    , fileItemListRef
    , reversedListAdding
    , onChange: onChange_IN

    , ...rest

}) => {
    const {
        actionHandlers: collection
        , state: {
            current: loadedFileItems
        }
    } = useCollectionWithKey<Data, "fileID">({
        k: "fileID"
        , reversedListAdding
        , onChange: (ev) => {
            if (!onChange_IN) {
                return
            }
            const {
                action
                , current
            } = ev
            switch (action) {
                case "add": {
                    const { added } = ev
                    return onChange_IN({
                        eventKind: action//"added fileItems"
                        , current
                        , added
                    })
                }
                case "clear": {
                    return onChange_IN({
                        eventKind: action//"clear"
                        , current
                    })
                }
                case "remove": {
                    const { removed } = ev
                    return onChange_IN({
                        eventKind: action//"removed  fileItems"
                        , current
                        , removed
                    })

                }


            }


        }
    })

        , [state, _set_state] = _use_state({
            // loadedFileItems: [] as FileItem[]
            m_state: { name: "IDLE" } as
                | {
                    name: "IDLE"
                    latestAction?: string
                }
                | {
                    name: "ADDING FILES"
                }
            , showInfo: false
        })

        , _emit_Change = _memo<NonNullable<Props["onChange"]>>(
            [onChange_IN]
            , () => {

                debugger

                return ev => !onChange_IN || setTimeout(() => onChange_IN(ev))

            }
        )

        , _add_FileItems = _cb<
            NonNullable<FileLoader_Props<Data>["onLoad"]>
        >([
            reversedListAdding
            , _emit_Change
        ], ({ data: loadedFileItems }) => {
            collection.add(loadedFileItems)

        })

        , listHandlers: ExtractEventHandlersMap<FileItemListView_Props>
            = _memo([collection], () => ({
                onClearButtonClick: collection.clear
                , onItemCloseButtonClick: ({ data }) => {
                    collection.remove(data)
                    // debugger
                    // _remove_FileItems(data)

                }
                , onItemError: ev => {
                    // debugger
                    console.warn(`[${[FileItemListWithProvider.name, listHandlers.onItemError.name].join(".")}] NOT IMPLEMENTED`, { ev })
                }
            }))


    fileItemListRef?.({
        // getLoadedItems: () => [...loadedFileItems]
        // , clear: collection.clear
        clear: collection.clear
        , getStateAsync: collection.getStateAsync
    })

    useMountCounter(FileItemListWithProvider)

    return (
        <div
            {...rest}
            data-file-item-list-with-provider
        >
            <div>
                {(() => {
                    const p = _memo([_add_FileItems], () => {

                        debugger

                        return {
                            onLoad: _add_FileItems
                        }

                    })
                    return <DP
                        {...p}
                    // onLoad={_add_FileItems}
                    />
                })()}
            </div>
            <div>
                <FileItemListView
                    data={loadedFileItems}
                    {...listHandlers}


                    {...{
                        className
                        , fileItemRenderer
                        , header
                        , headerProps
                        , noDataPlaceholder

                        // , onClearButtonClick
                        // , onItemCloseButtonClick
                        // , onItemError
                    }}

                />
            </div>

        </div>
    )
}



export {
    type ChangeEvent as FileItemListWithProvider_ChangeEvent
    , type ChangeEventKind as FileItemListWithProvider_ChangeEventKind
    , type ChangeHandler as FileItemListWithProvider_ChangeHandler
    , type Ref as FileItemListWithProvider_Ref
    , type Props as FileItemListWithProvider_Props
}



