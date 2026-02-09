import { EventHandlersFromMap } from "@ns-lab-knx/types"
import { Renderer } from "../../capabilities"
import { FileItemWithUrlAndFileID } from "./file-item"

// ======================================== types/loader
export type LoadedFileItem =
    & FileItemWithUrlAndFileID

// ======================================== capabilities/loader
export type HasLoadedFileItems<
    T extends LoadedFileItem = LoadedFileItem
> = {
    loadedFileItems: T[]
}

// ======================================== events/loader
export type FileLoaderEvent<
    T extends LoadedFileItem = LoadedFileItem
>
    = HasLoadedFileItems<T>

export type FileLoaderEventsMap<
    T extends LoadedFileItem = LoadedFileItem
> = {
    load: FileLoaderEvent<T>
}


// ======================================== renderer/props
export type HasFileLoaderEventHandlers<
    T extends LoadedFileItem = LoadedFileItem
>
    = EventHandlersFromMap<FileLoaderEventsMap<T>>

export type FileLoaderProps<
    T extends LoadedFileItem = LoadedFileItem
> =
    & HasFileLoaderEventHandlers<T>

// ======================================== renderer/component-type
// export type FileLoader<
//     P extends FileLoaderProps<any>
// > = Renderer<P>