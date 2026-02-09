import { ReactNode, useReducer, useRef } from "react"
import {
    HasData, HasEventKind
    // , ImageWithKind
    , PartialEventHandlersFromMap
} from "@ns-lab-knx/types"
import {
    ImageRow, ImageRowEventsMap, ImageRowProps
} from "./ImageRow"
import { _effect, _use_state } from "../../../../utils"
import { ImageInfo } from "./ImageRenderer"
import { NoData } from "../../_basic"
import { ButtonRS } from "../../rs"

const EMPTY_data = [] as ImageInfo[]


export type ImageListEventKind =
    | keyof ImageRowEventsMap
    | "remove"


export type ImageListEvent =
    & HasData<ImageInfo>
    & HasEventKind<ImageListEventKind>
    & {
        idx: number
    }

export type ImageListEventsMap = {
    change: ImageListEvent
}


// ======================================== props
export type ImageListProps =
    Partial<
        & HasData<ImageInfo[]>
        & {
            noDataRender: ReactNode
        }
    >
    & PartialEventHandlersFromMap<ImageListEventsMap>

// ======================================== component
export const ImageList = ({
    data: data_IN
    , noDataRender
    , onChange
    , ...rest
}: ImageListProps
) => {

    const [state, _set_state] = _use_state({} as {
        items?: ImageInfo[]
    })
        , _refs = useRef({} as {
            previous_data_IN?: ImageInfo[]
        })

        , _handleRename: ImageRowProps["onRename"] = ({
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
            // , idx
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
                        <ImageRow
                            key={data.id}
                            data={data}
                            onRename={_handleRename}
                        >
                            <div className="flex justify-end">
                                <ButtonRS
                                    onClick={() => _handleRemove({ data })}
                                >
                                    Remove
                                </ButtonRS>
                            </div>
                        </ImageRow>
                    ))}
                </div>}
        </div>
    )
}
