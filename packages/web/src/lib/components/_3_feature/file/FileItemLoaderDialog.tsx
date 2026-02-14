import React, {
    HTMLAttributes, InputHTMLAttributes, isValidElement, ReactNode
    , useRef
} from "react"
import { _t } from "@ns-world-lab/logic"
import {
    EventHandlersFromMap,
    ExtractEventHandlersMapPartial,
    HasChildren
    , HasData, KeyOf,
    XOR
} from "@ns-world-lab/types"
import {
    _cb,
    _cn, _effect, _memo, _revokeUrls, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID
    , _use_state
    , PickHtmlAttributes
} from "../../../utils"
import {
    FileItemWithUrlAndFileIDAndID,
    FileLoader,
    FileLoader_Props, LoadedFileItemWithPartialError
} from "../../../types"
import { useFileDialogWithLifecycle, UseFileDialogLifecycle_Input } from "./hooks"
import { Checkbox } from "rsuite"
import { useDroppable, useMountCounter } from "../../../hooks"
import { DropArea, DropAreaLayout, HasIsDroppable } from "./DropArea"

// ======================================== 


// ======================================== events
type EventsMap = {
    isDroppableChange: HasIsDroppable
}
// ======================================== props
type BaseProps =


    & Partial<
        & XOR<
            HasChildren<ReactNode | DropAreaLayout.FC>
            , {
                dropAreaLayout: ReactNode | DropAreaLayout.FC
            }
        >
        & {
            multiple: boolean
            showInput: boolean
        }
        & HasIsDroppable
        & PickHtmlAttributes<"className">

        & EventHandlersFromMap<EventsMap>
    >

type Props =
    & BaseProps
    & Omit<FileLoader_Props<LoadedFileItemWithPartialError>, KeyOf<BaseProps>>

type M_State =
    | {
        name: "IDLE"
        latestAction?: string
    }
    | {
        name: "PROCESSING FILES"
    }
    | {
        name: "DRAGGING"
    }

// ======================================== component
// FileItemProvider
export const FileItemLoaderDialog: FileLoader.FC<Props> = ({
    onLoad: onLoad_IN
    , dropAreaLayout
    , children: children_IN = dropAreaLayout

    , isDroppable: isDroppable_IN
    , multiple
    , showInput

    , onIsDroppableChange: onIsDroppableChange_IN

    , ...rest_IN
}) => {


    const [state, _set_state] = _use_state({
        m_state: { name: "IDLE" } as M_State
        , isDroppable: isDroppable_IN ?? true
    })

        , _set_isDroppable = (
            { isDroppable }: HasIsDroppable
        ) => {
            // debugger
            _set_state({ isDroppable })
            onIsDroppableChange_IN?.({ isDroppable })
        }

        , { DropLayout } = _memo([children_IN], () => {
            const dropLayout: DropAreaLayout.FC
                = typeof (children_IN) === "function"
                    ? children_IN
                    : isValidElement(children_IN)
                        ? () => children_IN
                        : DropAreaLayout
            return {
                DropLayout: dropLayout
            }
        })


        , _process_Files = _cb([onLoad_IN], ({
            source
            , data: loadedFileItems
        }:
            & {
                source: "droppable hook" | "lifecycle"
            }
            & HasData<FileItemWithUrlAndFileIDAndID[]>
        ) => {

            _set_state({
                m_state: { name: "PROCESSING FILES" }
            })

            let latestAction
                = loadedFileItems.length
                    ? `FETCHED FILE ITEMS [fileItemsToAdd: ${loadedFileItems.length}]`
                    : `NO FILES WHERE FETCHED [fileItemsToAdd: ${loadedFileItems.length}]`


            _set_state(({
                m_state: {
                    name: "IDLE"
                    , latestAction
                }
            }))

            onLoad_IN({
                data: loadedFileItems
            })

        })


        , inputRef = useRef<HTMLInputElement | null>(null)

        , {
            lifecycle_state
            , inputHandlers
        } = useFileDialogWithLifecycle({
            inputRef
            , onLoad: ({ data }) => _process_Files({
                source: "lifecycle"
                , data
            })
        })

        , {
            //isDragging
            getHandlers: getDroppableHandlers
        } = useDroppable({
            onDragging: ({ isDragging }) => {
                _set_state({
                    m_state: {
                        name: isDragging ? "DRAGGING" : "IDLE"
                    }
                })
            }
            , onDrop: ({ data }) => {
                // debugger
                _process_Files({
                    source: "droppable hook"
                    , data: data
                })
            }
            , disabled: !state.isDroppable
        })

        , divHandlers: Pick<HTMLAttributes<HTMLEmbedElement>, "onPointerDown" | "onKeyDown">
            = _memo([inputRef, inputHandlers], () => {
                return {
                    onPointerDown: ev => {
                        const el = ev.target as HTMLElement
                            , isDroppableToggle
                                = !!el.closest('input[type="checkbox"]')
                                || !!el.closest('[role="checkbox"]')
                                || !!el.closest('.rs-checkbox')
                                || !!el.closest('[data-is-droppable-toggle]')
                                || !!el.closest('[data-is-droppable-checkbox]')

                        if (isDroppableToggle) {
                            debugger
                            return
                        }
                        inputHandlers.onClick()
                    }
                    , onKeyDown: ev => {
                        if (ev.key === "Enter" || ev.key === " ") {
                            inputHandlers.onClick()
                        }
                    }
                }
            })


    _effect([isDroppable_IN], () => {

        if (typeof (isDroppable_IN) !== "boolean"
            || isDroppable_IN === state.isDroppable
        ) {
            return
        }
        _set_state({
            isDroppable: isDroppable_IN
        })

    })

    useMountCounter(FileItemLoaderDialog)


    return (
        <div
            {...rest_IN}
            data-file-dialog-input
            data-drop-area
            role="button"
            tabIndex={0}
            className={_cn(`
                    relative my-2  
                    py-2
                    
                    border
                    border-blue-500/20
                    rounded-[20px]
                    `
                , state.m_state.name === "DRAGGING" ? "bg-gray-300" : undefined
                , rest_IN.className
            )}

            {...divHandlers}
        // onKeyDown={_handle_KeyDown}
        // onPointerDown={_handle_ClickToOpen}
        >
            <div
                className="w-full h-full"
                {...getDroppableHandlers()}
            >
                <input
                    type="file"
                    multiple={multiple}
                    ref={el => {
                        inputRef.current = el
                    }}
                    className={_cn(`
                                    border border-gray-200 rounded-[5px] 
                                    p-2
                                    hover:bg-gray-100 
                                    transition-all 
                                    duration-[.2s]
                                    `
                        , showInput ? undefined : "hidden"
                    )}
                    // {...inputHandlers}
                    onChange={inputHandlers.onChange}
                // onClick={_handle_InputClick}
                />
                <div
                // className="px-2"
                >
                    <Checkbox
                        data-is-droppable-checkbox
                        checked={state.isDroppable}
                        // onClick={ev => _set_state({ isDroppable: !state.isDroppable })}
                        onPointerDownCapture={ev => ev.stopPropagation()}
                        onChange={(value, isDroppable, ev) => {
                            ev.preventDefault()
                            ev.stopPropagation()
                            //console.log({ value })
                            _set_isDroppable({ isDroppable })
                        }}
                        className="ml-3"
                    >Droppable</Checkbox>
                </div>
                <div
                    className={`
                        ---border 
                        ---border-2 
                        ---border-red-500
                        flex
                        justify-center
                        `}
                >
                    <DropLayout
                        isDroppable={state.isDroppable}
                        isDragging={state.m_state.name === "DRAGGING"}
                    />
                </div>
            </div>
        </div>
    )
}






// export const FileItemLoaderDialog
//     = React.memo(
//         _FileItemLoaderDialog_
//         , (p, n) => {
//             const onLoadChanged = p.onLoad !== n.onLoad
//             console.log(_t(_FileItemLoaderDialog_), { onLoadChanged })
//             // debugger
//             return onLoadChanged
//         }
//     )




export {
    type EventsMap as FileItemLoaderDialog_EventsMap
    , type Props as FileItemLoaderDialog_Props
}

