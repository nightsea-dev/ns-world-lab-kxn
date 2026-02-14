import { ReactNode, useReducer, useRef } from "react"
import {
    HasData, HasEventKind
    , EventHandlersFromMapPartial
} from "@ns-world-lab/types"
import {
    ImageCard
    , ImageCard_EventsMap
    , ImageCard_Props
} from "./ImageCard"
import { _effect, _use_state } from "../../../../utils"
import { NoData } from "../../../_1_primitive"
import { ImageInfo } from "../../../../types"
import { ButtonRS } from "../../controls"

const EMPTY_data = [] as ImageInfo[]


type EventKind =
    | keyof ImageCard_EventsMap
    | "remove"


type Event =
    & HasData<ImageInfo>
    & HasEventKind<EventKind>
    & {
        idx: number
    }

type EventsMap = {
    change: Event
}


// ======================================== props
type Props =
    Partial<
        & HasData<ImageInfo[]>
        & {
            noDataRender: ReactNode
        }
    >
    & EventHandlersFromMapPartial<EventsMap>

// ======================================== component
export const ImageList: React.FC<Props> = ({
    data: data_IN
    , noDataRender
    , onChange
    , ...rest
}) => {

    const [state, _set_state] = _use_state({} as {
        items?: ImageInfo[]
    })
        , _refs = useRef({} as {
            previous_data_IN?: ImageInfo[]
        })

        , _handleRename: ImageCard_Props["onRename"] = ({
            data
        }) => {

            const {
                items = []
            } = state
                , idx = items.findIndex(o => o.src === data.src)
            if (idx === undefined || idx < 0) {
                return
            }
            items[idx] = { ...items[idx], ...data }
            _set_state({
                items: [...items]
            })

        }
        , _handleRemove = ({
            data
        }:
            & HasData<ImageInfo>
            // & {
            //     idx: number
            // }
        ) => {
            const {
                items: _items = []
            } = state
                , items = [..._items]
                , [item] = items.splice(
                    items.findIndex(o => o.src === data.src)
                    , 1
                )
            if (!item) {
                return { data, removed: false }
            }
            !item.src || URL.revokeObjectURL(item.src)
            return { data, removed: true }
        }
    // , _handleEvent = (
    //     ev:
    //         | {
    //             eventKind: "remove"
    //             idx: number
    //         }
    //         | {
    //             eventKind: "rename"
    //             idx: number
    //             name: string
    //         }
    // ) => {
    //     if (!state.items?.length) {
    //         return
    //     }
    //     debugger
    //     const {
    //         eventKind
    //         , idx
    //     } = ev
    //     let {
    //         items
    //     } = state

    //         , item = (items = [...items])[idx] ?? {}

    //     switch (eventKind) {
    //         case "rename": {
    //             const {
    //                 name
    //             } = ev
    //             item = items[idx] = { ...item, name }
    //             break;
    //         }
    //         case "remove": {
    //             const {
    //                 src
    //             } = item
    //             if (!src) {
    //                 return
    //             }
    //             URL.revokeObjectURL(src)
    //             items.splice(idx, 1)
    //             break
    //         }
    //     }

    //     _set_state({ items })

    //     onChange?.({
    //         data: item
    //         , idx
    //         , eventKind
    //     })

    // }


    _effect([data_IN], () => {

        data_IN ??= EMPTY_data

        if (_refs.current.previous_data_IN === data_IN
            || state.items === data_IN
        ) {
            return
        }
        _refs.current.previous_data_IN === data_IN

        _set_state({
            items: data_IN ?? []
        })
    })

    return (
        <div
            {...rest}
            data-image-list
            className="flex-1 overflow-auto border border-gray-200 rounded p-3"
        >
            {!state.items?.length
                ? (noDataRender || <NoData />)
                : <div
                    className="grid grid-cols-2 gap-3"
                >
                    {state.items.map((data, idx) => (
                        <ImageCard
                            key={data.id}
                            data={data}
                            onRename={_handleRename}
                        >
                            <div className="flex justify-end">
                                <ButtonRS
                                    onClick={() => _handleRemove({ data: data })}
                                >
                                    Remove
                                </ButtonRS>
                            </div>
                        </ImageCard>
                    ))}
                </div>}
        </div>
    )
}







export {

    type EventKind as ImageList_EventKind

    , type Event as ImageList_Event

    , type EventsMap as ImageList_EventsMap

    , type Props as ImageList_Props

}