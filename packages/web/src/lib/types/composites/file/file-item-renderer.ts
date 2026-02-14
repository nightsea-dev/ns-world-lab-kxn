import {
    ExtractEventHandlersMap,
    ExtractEventsMap,
    HasData,
    HasPartialError,
    HasPartialErrorWithDataHandler,
} from "@ns-world-lab/types";
import { FileItemWithUrlAndFileID } from "./file-item";
import { HasClassName, HasPartialClassName } from "../../capabilities";
import React from "react";

// ======================================== types
type DataItem
    =
    & FileItemWithUrlAndFileID
    & HasPartialError
// ======================================== types/props
type Props<
    TDataItem extends DataItem = DataItem
> =
    & HasData<TDataItem>
    & HasPartialClassName
    & HasPartialErrorWithDataHandler<TDataItem>

// ======================================== types/eventHandlers
type EventHandlers<
    TDataItem extends DataItem = DataItem
> = ExtractEventHandlersMap<Props<TDataItem>>

type EventsMap<
    TDataItem extends DataItem = DataItem
> = ExtractEventsMap<
    EventHandlers<
        TDataItem
    >
>



// ======================================== types/renderer
type FileItemRenderer_FC<
    TDataItem extends DataItem = DataItem
> = React.FC<
    Props<TDataItem>
>

// ======================================== capabilities
export type HasFileItemRenderer<
    TDataItem extends DataItem = DataItem
> =
    & {
        fileItemRenderer: FileItemRenderer_FC<TDataItem>
    }

export {
    type DataItem as FileItemRenderer_DataItem
    , type Props as FileItemRenderer_Props
    , type EventHandlers as FileItemRenderer_EventHandlers
    , type EventsMap as FileItemRenderer_EventsMap
}

export namespace FileItemRenderer {
    export type FC<
        TDataItem extends DataItem = DataItem
    > = FileItemRenderer_FC<TDataItem>
}

