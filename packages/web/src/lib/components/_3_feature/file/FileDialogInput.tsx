import React, {
    DragEvent
    , HTMLAttributes, InputHTMLAttributes, ReactNode
    , RefCallback
    , useRef
} from "react"
import {
    toRemoveByKey, pickFrom
} from "@ns-world-lab/logic"
import {
    HasLabel
    , KeyOf
    , XOR
} from "@ns-world-lab/types"
import {
    _cn, _memo, _revokeUrls, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID
    , _use_state, PickHtmlAttributes
} from "../../../utils"
import {
    useFileDialogLifecycle,
    UseFileDialogLifecycleInput
} from "./use-file-dialog-lifecycle"
import { Box } from "../../_1_primitive"
import {
    FileItemRenderer
    , LoadedFileItemWithPartialError
} from "../../../types"
import { ObjectViewWithToggle } from "../../_2_composite"
import { Default_FileItemRenderer } from "./DefaultFileItemRenderer"
import { FileItem_ListView, FileItem_ListView_Props } from "./FileItemListView"



// ======================================== 

type DragEventHemdlers = PickHtmlAttributes<
    | "onDragOver"
    | "onDragEnter"
    | "onDragLeave"
    | "onDrop"
>
type DragEventHandlerKey
    = KeyOf<DragEventHemdlers>


// ======================================== handle

export type FileDialogInput_Ref =
    & {
        inputElement?: HTMLInputElement | null
        clear: () => void
    }


// ======================================== props
export type FileDialogInput_Props =
    & Partial<
        & HasLabel<ReactNode>
        & {
            isDroppable: boolean
            inputIsHidden: boolean
            showFileItemList: boolean
            reverseListAdding: boolean

            placeholder: ReactNode
            beforeFileItemListChildren: ReactNode

            fileDialogRef: RefCallback<FileDialogInput_Ref>
            fileItemRenderer: FileItemRenderer
        }
        & XOR<
            {
                afterFileItemListChildren: ReactNode
            }
            , PickHtmlAttributes<"children">
        >
        & PickHtmlAttributes<"className">
        & Pick<HTMLInputElement, "multiple">
        & {
            onChange: (
                ev:
                    & {
                        loadedFileItems: LoadedFileItemWithPartialError[]
                    }
                    & (

                        | {
                            eventKind: "clear"
                        }
                        | {
                            eventKind: "removed  fileItems"
                            removedItems: LoadedFileItemWithPartialError[]
                        }
                        | {
                            eventKind: "added fileItems"
                            addedFileItems: LoadedFileItemWithPartialError[]
                        }
                    )
            ) => void
        }
    >

// ======================================== component
export const FileDialogInput = ({
    label
    , placeholder: placeholder_IN = "Drop files here, or click to choose"
    , isDroppable = true
    , inputIsHidden = true
    , showFileItemList = true
    , fileDialogRef
    , fileItemRenderer = Default_FileItemRenderer
    , beforeFileItemListChildren
    , children
    , afterFileItemListChildren = children
    , multiple
    , reverseListAdding = true
    , onChange
    , ...rest_01
}: FileDialogInput_Props
) => {

    const [state, _set_state] = _use_state({
        loadedFileItems: [] as LoadedFileItemWithPartialError[]
        , m_state: { name: "IDLE" } as
            | {
                name: "IDLE"
                latestAction?: string
            }
            | {
                name: "ADDING FILES"
            }
            | {
                name: "DRAGGING"
                handlerKey: DragEventHandlerKey
            }
        , showInfo: false
    })
        , { loadedFileItemsByFileID } = _memo([state.loadedFileItems], () => ({
            loadedFileItemsByFileID: Object.fromEntries(
                state.loadedFileItems.map(o => [o.fileID, o])
            )
        }))
        , { current: _refs } = useRef({} as Pick<FileDialogInput_Ref, "inputElement">)
        , _openDialog = () => _refs.inputElement?.click()

        , { placeholder } = _memo([placeholder_IN, isDroppable], () => {

            return {
                placeholder: placeholder_IN ?? (
                    isDroppable
                        ? "Drop files here, or click to choose"
                        : "Click to choose"
                )
            }
        })

        , _emit_Change: FileDialogInput_Props["onChange"]
            = ev => onChange?.(ev)

        , _add_Files = ({
            source
            , files
        }:
            | {
                source: "drop"
                files: FileList
            }
            | {
                source: "lifecycle"
                files: LoadedFileItemWithPartialError[]
            }
        ) => {

            _set_state({
                m_state: { name: "ADDING FILES" }
            })


            const {
                loadedFileItems: current_loadedFileItems
            } = state
                , fileItemsToAdd = _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID(files)
                    .filter(({ fileID }) => !loadedFileItemsByFileID[fileID])

            if (!fileItemsToAdd.length) {
                return
            }

            let latestAction = `ADD FILE ITEMS | current_loadedFileItems: ${current_loadedFileItems.length}`

            if (fileItemsToAdd.length) {
                const next_loadedFileItems = [...current_loadedFileItems]
                next_loadedFileItems[
                    reverseListAdding
                        ? "unshift" : "push"
                ](...(
                    reverseListAdding
                        ? fileItemsToAdd.reverse()
                        : fileItemsToAdd
                ))
                latestAction = `ADDED FILE ITEMS | fileItemsToAdd: ${fileItemsToAdd.length}`
                _set_state({
                    loadedFileItems: next_loadedFileItems
                })
                _emit_Change({
                    eventKind: "added fileItems"
                    , addedFileItems: fileItemsToAdd
                    , loadedFileItems: next_loadedFileItems
                })
            } else {
                latestAction = "NO NEW FILES"
            }

            console.log(latestAction)

            _set_state({
                m_state: {
                    name: "IDLE"
                    , latestAction
                }
            })

            return {
                /**
                 * * current_loadedFileItems
                 */
                loadedFileItems: current_loadedFileItems
                , addedFileItems: fileItemsToAdd
            }

        }

        , _handle_UseFileDialogLifecycleInput_Load: UseFileDialogLifecycleInput["onLoad"]
            = ({ loadedFileItems }) => _add_Files({
                source: "lifecycle"
                , files: loadedFileItems
            })

        , {
            lifecycle_state
            , onChange: onChange_lifecycle
            , onClick: onClick_lifecycle
        } = useFileDialogLifecycle({
            onLoad: _handle_UseFileDialogLifecycleInput_Load
        })

        , _remove_FileItems = (
            ...fileItems: (LoadedFileItemWithPartialError | LoadedFileItemWithPartialError[])[]
        ) => {

            const requestedFilesToRemove = fileItems.flat(1)

            if (!requestedFilesToRemove.length) {
                return {}
            }

            const { loadedFileItems: current_loadedFileItems } = state
                , {
                    toRemove: removedItems
                    , toKeep: loadedFileItems
                } = toRemoveByKey(
                    current_loadedFileItems
                    , requestedFilesToRemove
                    , "fileID"
                )

            if (removedItems.length) {
                _revokeUrls(removedItems)
                _set_state({
                    loadedFileItems
                })
            }

            _set_state({
                m_state: {
                    name: "IDLE"
                    , latestAction: `[REMOVE FILE]  `
                }
            })

            return {
                loadedFileItems
                , removedItems
            }
        }

        , _clear = () => {
            const loadedFileItems = [] as LoadedFileItemWithPartialError[]
            _set_state({ loadedFileItems })
            _emit_Change({
                eventKind: "clear"
                , loadedFileItems
            })
        }


        , _handle_InputChange: InputHTMLAttributes<HTMLInputElement>["onChange"]
            = ev => {
                onChange_lifecycle?.(ev)
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handle_InputClick: InputHTMLAttributes<HTMLInputElement>["onClick"]
            = ev => {
                onClick_lifecycle?.(ev)
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handle_ListItem_CloseButtonClick: FileItem_ListView_Props["onItemCloseButtonClick"]
            = ({ data }) => {
                debugger
                const {
                    loadedFileItems
                    , removedItems
                } = _remove_FileItems(data)
                    ;
                ; !removedItems
                    || _emit_Change({
                        eventKind: "removed  fileItems"
                        , loadedFileItems
                        , removedItems
                    })
            }

        , _handle_ItemError: FileItem_ListView_Props["onItemError"]
            = ev => {
                // debugger
                console.warn(`[${[FileDialogInput.name, _handle_ItemError].join(".")}] NOT IMPLEMENTED`, { ev })
            }

        , _handle_DragEvent = (
            handlerKey: DragEventHandlerKey
            , ev: DragEvent<HTMLElement>
        ) => {
            if (!isDroppable) {
                return
            }
            ev.preventDefault()
            ev.stopPropagation()
            switch (handlerKey) {
                case "onDragLeave": {
                    // _set_state({ dragIsOver: false })
                    _set_state({
                        m_state: {
                            name: "IDLE"
                            , latestAction: "DRAGGING"
                        }
                    })
                    break
                }

                case "onDragEnter":
                case "onDragOver": {
                    if (state.m_state.name !== "DRAGGING") {
                        _set_state({
                            m_state: {
                                name: "DRAGGING"
                                , handlerKey
                            }
                        })
                    }
                    break
                }
                case "onDrop": {
                    _set_state({
                        m_state: {
                            name: "IDLE"
                            , latestAction: handlerKey
                        }
                    })

                    _add_Files({
                        source: "drop"
                        , files: ev.dataTransfer?.files
                    })
                    break
                }
            }

        }

        , dragHandlers = {
            onDragOver: ev => _handle_DragEvent("onDragOver", ev)
            , onDragLeave: ev => _handle_DragEvent("onDragLeave", ev)
            , onDrop: ev => _handle_DragEvent("onDrop", ev)
            , onDragEnter: ev => _handle_DragEvent("onDragEnter", ev)
        } as DragEventHemdlers


        , _handle_KeyDown: HTMLAttributes<HTMLElement>["onKeyDown"]
            = ev => {
                if (ev.key === "Enter" || ev.key === " ") {
                    _openDialog()
                }
            }

    fileDialogRef?.({
        ..._refs
        , clear: _clear
    })

    return (
        <Box
            {...rest_01}
            {...dragHandlers}
            data-file-dialog-input
            role="button"
            tabIndex={0}
            onKeyDown={_handle_KeyDown}
            className={_cn(`
                relative my-2                
                `
                , state.m_state.name === "DRAGGING" ? "bg-gray-300" : undefined
                , rest_01.className
            )}
            header={<b>
                {FileDialogInput.name}
            </b>}
        >
            <ObjectViewWithToggle
                data={{
                    ...pickFrom(lifecycle_state, "dialogMState")
                    , state
                }}
                header={FileDialogInput.name}
                label="Show Info"
                showOnlyArrayLength
            />

            <input
                type="file"
                multiple={multiple}
                ref={el => {
                    _refs.inputElement = el
                }}
                className={_cn(`
                    border border-gray-200 rounded-[5px] 
                    p-2
                    hover:bg-gray-100 
                    transition-all 
                    duration-[.2s]
                    `
                    , inputIsHidden ? "hidden" : undefined
                )}
                onChange={_handle_InputChange}
                onClick={_handle_InputClick}
            />

            {beforeFileItemListChildren && (
                <div
                    data-before-file-collection-children-container
                >{beforeFileItemListChildren}</div>
            )}

            {(showFileItemList || !inputIsHidden) && (
                <FileItem_ListView
                    data={state.loadedFileItems}
                    fileItemRenderer={fileItemRenderer}
                    placeholder={placeholder}
                    onClick={_openDialog}
                    onItemCloseButtonClick={_handle_ListItem_CloseButtonClick}
                    onItemError={_handle_ItemError}
                    onClearButtonClick={_clear}
                    className={`
                        cursor-default
                        `}
                    headerProps={{
                        className: _cn(`
                            overflow-hidden
                            transition-all
                            duration-200
                            hover:bg-orange-50
                        `)
                    }}
                />)}


            {afterFileItemListChildren && (
                <div
                    data-after-file-collection-children-container
                >{afterFileItemListChildren}</div>
            )}


        </Box>
    )
}
