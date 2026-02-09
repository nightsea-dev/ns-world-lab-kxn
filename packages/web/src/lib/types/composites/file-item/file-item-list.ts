import { AnyFileItemType, FileItem } from "./file-item"


// ========================================
export type FileItemList<
    F extends AnyFileItemType = FileItem
> =
    | FileList
    | Iterable<F>


export type InputFileItemList<
    F extends AnyFileItemType = File
> =
    | FileItemList<F>
    | null


