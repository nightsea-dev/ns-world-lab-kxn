import { EventHandlersFromMap, HasPartialError } from "@ns-world-lab/types"
import { FileItemWithUrlAndFileID } from "./file-item"

// ======================================== types/loader
export type LoadedFileItem =
    & FileItemWithUrlAndFileID

export type LoadedFileItemWithPartialError =
    & LoadedFileItem
    & HasPartialError

// ======================================== capabilities/loader
export type HasLoadedFileItems<
    TLoadedFileItem extends LoadedFileItem = LoadedFileItem
> = {
    loadedFileItems: TLoadedFileItem[]
}

// ======================================== events/loader
export type FileLoader_Event<
    TLoadedFileItem extends LoadedFileItem = LoadedFileItem
>
    = HasLoadedFileItems<TLoadedFileItem>

export type FileLoader_EventsMap<
    TLoadedFileItem extends LoadedFileItem = LoadedFileItem
> = {
    load: FileLoader_Event<TLoadedFileItem>
}


// ======================================== renderer/props
export type HasFileLoader_EventHandlers<
    T extends LoadedFileItem = LoadedFileItem
>
    = EventHandlersFromMap<FileLoader_EventsMap<T>>

export type FileLoader_Props<
    T extends LoadedFileItem = LoadedFileItem
> =
    & HasFileLoader_EventHandlers<T>

// ======================================== renderer/component-type
// export type FileLoader<
//     P extends FileLoaderProps<any>
// > = Renderer<P>