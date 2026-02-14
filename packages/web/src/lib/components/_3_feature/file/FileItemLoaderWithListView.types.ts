import { HasChildren, XOR } from "@ns-world-lab/types"
import {
    UseCollectionWithKey_ActionChangeEvent, UseCollectionWithKey_ActionChangeEventHandler
    , UseCollectionWithKey_ActionKey, UseCollectionWithKey_ActionHandlersMap,
    UseCollectionWithKey_Input,
    UseCollectionWithKey_Output

} from "../../../hooks"
import { FileLoader, FileLoader_Props, HasFileItemProvider, LoadedFileItemWithPartialError } from "../../../types"
import { RefCallback } from "react"
import { FileItemListView_Props } from "./FileItemListView"


type Data = LoadedFileItemWithPartialError
type ChangeEvent = UseCollectionWithKey_ActionChangeEvent<Data, "fileID">
type ChangeHandler = UseCollectionWithKey_ActionChangeEventHandler<Data, "fileID">
type ChangeEventKind = UseCollectionWithKey_ActionKey
type Ref =
    & Pick<UseCollectionWithKey_ActionHandlersMap<Data, "fileID">, "clear">
    & Pick<UseCollectionWithKey_Output<Data, "fileID">, "state">

type Props =

    & Partial<

        & Pick<UseCollectionWithKey_Input<Data, "fileID">, "reversedListAdding">
        & {
            fileItemCollectionRef: RefCallback<Ref>
            onChange: ChangeHandler
        }

        & Omit<FileItemListView_Props, "data">
    // & Pick<
    //     FileItemListView_Props,
    //     | "className"
    //     | "fileItemRenderer"
    //     | "header"
    //     | "headerProps"
    //     | "noDataPlaceholder"

    //     | "onClearButtonClick"
    //     | "onItemCloseButtonClick"
    //     | "onItemError"

    // >

    >




export namespace FileItemLoaderWithListView {
    export type FC<P = {}> = React.FC<P & Props>
}



export {
    type Data as FileItemLoaderWithListView_Data
    , type ChangeEvent as FileItemLoaderWithListView_ChangeEvent
    , type ChangeHandler as FileItemLoaderWithListView_ChangeHandler
    , type ChangeEventKind as FileItemLoaderWithListView_ChangeEventKind
    , type Ref as FileItemLoaderWithListView_Ref
    , type Props as FileItemLoaderWithListView_Props
}

