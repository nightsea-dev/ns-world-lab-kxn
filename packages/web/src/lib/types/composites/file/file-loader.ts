import { EventHandlersFromMap, HasData, HasDataProvider, HasPartialError, HasProvider } from "@ns-world-lab/types"
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
> = HasData<TLoadedFileItem[]>

// ======================================== events/loader
type Event<
    TLoadedFileItem extends LoadedFileItem = LoadedFileItem
>
    = HasLoadedFileItems<TLoadedFileItem>

type EventsMap<
    TLoadedFileItem extends LoadedFileItem = LoadedFileItem
> = {
    load: Event<TLoadedFileItem>
}


// ======================================== renderer/props
type HasEventHandlers<
    TFileItem extends LoadedFileItem = LoadedFileItem
>
    = EventHandlersFromMap<EventsMap<TFileItem>>

type Props<
    TFileItem extends LoadedFileItem = LoadedFileItem
> =
    & HasEventHandlers<TFileItem>


// ======================================== renderer/component-type
type EnsurePropsMatchItem<
    TProps
    , TFileItem extends LoadedFileItem = LoadedFileItem
> = TProps extends Props<TFileItem> ? TProps : never

type FileLoader_FC<
    TProps extends Props<LoadedFileItemWithPartialError> = Props<LoadedFileItemWithPartialError>
// , TFileItem extends LoadedFileItemWithPartialError
// = TProps extends FileLoader_Props<infer _fileItem> ? _fileItem : LoadedFileItemWithPartialError
> =
    & React.FC<TProps>



//EnsurePropsMatchItem<TProps, TFileItem>>
// export type FileLoader<
//     P extends FileLoaderProps<any>
// > = Renderer<P>



// export type HasFileLoader<P = {}> = {
//     fileLoader: FileLoader<P, LoadedFileItemWithPartialError>
// }



export {
    type Props as FileLoader_Props
    , type Event as FileLoader_Event
    , type EventsMap as FileLoader_EventsMap
    , type HasEventHandlers as HasFileLoader_EventHandlers
}


export namespace FileLoader {
    export type FC<
        TProps extends Props<LoadedFileItemWithPartialError> = Props<LoadedFileItemWithPartialError>
    > = FileLoader_FC<TProps>
}


export type HasFileItemProvider<
    TProps extends Props<LoadedFileItemWithPartialError> = Props<LoadedFileItemWithPartialError>
>
    = HasDataProvider<FileLoader_FC<TProps>>

