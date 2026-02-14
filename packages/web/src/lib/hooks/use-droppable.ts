import { DragEventHandler, HTMLAttributes, useCallback, useRef, useState } from "react"
import { _cb, _memo, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID, _use_state } from "../utils"
import { EventHandlersFromMap, PickRequired } from "@ns-world-lab/types"
import { FileItemWithUrlAndFileIDAndID } from "../types"

type EventsMap = {
    drop: {
        data: FileItemWithUrlAndFileIDAndID[]
        files: File[]
    }
    dragging: {
        isDragging: boolean
    }
}


type Input =
    Partial<
        & {
            disabled: boolean
        }
        & EventHandlersFromMap<EventsMap>
    >


type HandlersMap = PickRequired<
    HTMLAttributes<HTMLElement>,
    | "onDragEnter"
    | "onDragOver"
    | "onDragLeave"
    | "onDrop"
>

type Output = {
    isDragging: boolean
    getHandlers: () => HandlersMap
}


// ========================================
export const useDroppable = ({
    disabled
    , onDrop: onDrop_IN
    , onDragging: onDragging_IN
}: Input = {}
): Output => {

    const [state, _set_state] = _use_state({
        isDragging: false
    })
        , _set_isDragging = (
            isDragging: boolean
        ) => {
            _set_state({ isDragging })
            onDragging_IN?.({ isDragging })
        }

        , dragCounter = useRef(0)

        , handlers = _memo<HandlersMap>([disabled], () => ({
            onDragEnter: (ev) => {
                if (disabled) {
                    return
                }
                ev.preventDefault()
                dragCounter.current += 1
                _set_isDragging(true)
            }
            , onDragOver: (ev) => {
                if (disabled) {
                    return
                }
                ev.preventDefault()
            }
            , onDragLeave: (ev) => {
                if (disabled) {
                    return
                }
                ev.preventDefault()
                dragCounter.current -= 1
                if (dragCounter.current === 0) {
                    _set_isDragging(false)
                }
            }
            , onDrop(ev) {

                if (disabled) {
                    return
                }
                ev.preventDefault()
                dragCounter.current = 0
                _set_isDragging(false)
                const files = Array.from(ev.dataTransfer.files)
                    , data = _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID(files)
                onDrop_IN?.({
                    data
                    , files
                })
            }
        }))

    return {
        ...state
        , getHandlers: () => handlers
    }
}




export {
    type Input as UseDroppable_Input
    , type Output as UseDroppable_Output
}
