import {
    ExtractEventHandlersMap,
    ExtractEventsMap,
    HasData,
    HasPartialError,
    HasPartialErrorWithDataHandler,
} from "@ns-world-lab/types";
import { FileItemWithUrlAndFileID } from "./file-item";
import { HasClassName, HasPartialClassName, Renderer } from "../../capabilities";

// ======================================== types
export type FileItemRenderer_DataItem
    =
    & FileItemWithUrlAndFileID
    & HasPartialError
// ======================================== types/props
export type FileItemRenderer_Props<
    TDataItem extends FileItemRenderer_DataItem = FileItemRenderer_DataItem
> =
    & HasData<TDataItem>
    & HasPartialClassName
    & HasPartialErrorWithDataHandler<TDataItem>

// ======================================== types/eventHandlers
export type FileItemRenderer_EventHandlers<
    TDataItem extends FileItemRenderer_DataItem = FileItemRenderer_DataItem
> = ExtractEventHandlersMap<FileItemRenderer_Props<TDataItem>>

export type FileItemRenderer_EventsMap<
    TDataItem extends FileItemRenderer_DataItem = FileItemRenderer_DataItem
> = ExtractEventsMap<
    FileItemRenderer_EventHandlers<
        TDataItem
    >
>



// ======================================== types/renderer
export type FileItemRenderer<
    TDataItem extends FileItemRenderer_DataItem = FileItemRenderer_DataItem
> =
    & Renderer<
        FileItemRenderer_Props<TDataItem>
    >

// ======================================== capabilities
export type HasFileItemRenderer<
    TDataItem extends FileItemRenderer_DataItem = FileItemRenderer_DataItem
> =
    & {
        fileItemRenderer: FileItemRenderer<TDataItem>
    }

