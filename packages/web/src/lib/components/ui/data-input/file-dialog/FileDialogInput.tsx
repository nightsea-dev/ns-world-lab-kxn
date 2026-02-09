import React, {
    DragEvent
    , HTMLAttributes, InputHTMLAttributes, ReactNode
    , RefCallback
    , useRef
} from "react"
import {
    toRemoveByKey, pickFrom
} from "@ns-world-lab-knx/logic"
import {
    HasLabel
    , KeyOf
    , XOR
} from "@ns-world-lab-knx/types"
import {
    _cn, _filterFiles
    , _getFileUrl, _memo, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID, _use_state
    , _effect,
    _revokeUrls,
    PickHtmlAttributes,
    _getFileID
} from "../../../../utils"
import {
    useFileDialogLifecycle
} from "./use-file-dialog-lifecycle"
import {
    FileCollectionView
    , FileCollectionViewProps
} from "./FileCollectionView"
import { Box } from "../../_basic"
import { FileWithUrlRenderer } from "./FileWithUrlRenderer"
import {
    InputFileItemList
    , LoadedFileItem
} from "../../../../types"
import { ObjectViewWithToggle } from "../../data-display"


// ======================================== handle

export type FileDialogRef =
    & {
        inputElement?: HTMLInputElement | null
        clear: () => void
    }

// export type FileDialogRefType
//     = RefCallback<
//         FileDialogRef
//     >


// ======================================== props
export type FileDialogInputProps =
    // & FileLoaderProps
    & Partial<
        & HasLabel<ReactNode>
        & {
            placeholder: ReactNode
            isDroppable: boolean
            inputIsHidden: boolean
            showFileCollection: boolean
            fileDialogRef: RefCallback<FileDialogRef>
            fileRenderer: FileWithUrlRenderer
            beforeFileCollectionChildren: ReactNode
            reverseListAdding: boolean
        }
        & XOR<
            {
                afterFileCollectionChildren: ReactNode
            }
            , PickHtmlAttributes<"children">
        >
        & PickHtmlAttributes<"className">
        & Pick<HTMLInputElement, "multiple">
        & {
            onChange: (
                ev:
                    & {
                        loadedFileItems: LoadedFileItem[]
                    }
                    & (

                        | {
                            eventKind: "clear"
                        }
                        | {
                            eventKind: "removed  fileItems"
                            removedItems: LoadedFileItem[]
                        }
                        | {
                            eventKind: "added fileItems"
                            addedFileItems: LoadedFileItem[]
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
    , showFileCollection = true
    , fileDialogRef
    , fileRenderer = FileWithUrlRenderer.DEFAULT
    , beforeFileCollectionChildren
    , children
    , afterFileCollectionChildren = children
    , multiple
    , reverseListAdding = true
    // , onLoad: onLoad_IN
    // , onClick: onClick_IN
    , onChange
    // , onItemsRemoved
    , ...rest_01
}: FileDialogInputProps
) => {


    type DragEventHemdlers = PickHtmlAttributes<
        | "onDragOver"
        | "onDragEnter"
        | "onDragLeave"
        | "onDrop"
    >
    type DragEventHandlerKey
        = KeyOf<DragEventHemdlers>


    const [state, _set_state] = _use_state({
        loadedFileItems: [] as LoadedFileItem[]
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
        , { current: _refs } = useRef({} as Pick<FileDialogRef, "inputElement">)
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

        , _emitChange: FileDialogInputProps["onChange"]
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
                files: LoadedFileItem[]
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
            // , {
            //     filteredFiles: filesToAdd
            //     , normalisedFiles
            // } = _filterFiles(inputFileItemList, current_loadedFileItems)

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
                _emitChange({
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

        , {
            lifecycle_state
            , onChange: onChange_lifecycle
            , onClick: onClick_lifecycle
        } = useFileDialogLifecycle({
            onLoad: ({ loadedFileItems }) => _add_Files({
                source: "lifecycle"
                , files: loadedFileItems
            })
        })

        , _remove_FileItems = (
            ...fileItems: (LoadedFileItem | LoadedFileItem[])[]
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
            const {
                removedItems
                , loadedFileItems
            } = _remove_FileItems(state.loadedFileItems)
                ;
            ; !loadedFileItems
                || _emitChange({
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
            = () => {
                onClick_lifecycle?.()
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handle_ItemCloseButtonClick: FileCollectionViewProps["onItemCloseButtonClick"]
            = ({ data }) => {
                const {
                    loadedFileItems
                    , removedItems
                } = _remove_FileItems(data)
                    ;
                ; !removedItems
                    || _emitChange({
                        eventKind: "removed  fileItems"
                        , loadedFileItems
                        , removedItems
                    })
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

            {beforeFileCollectionChildren && (
                <div
                    data-before-file-collection-children-container
                >{beforeFileCollectionChildren}</div>
            )}

            {(showFileCollection || !inputIsHidden) && (
                <FileCollectionView
                    data={state.loadedFileItems}
                    fileRenderer={fileRenderer}
                    placeholder={placeholder}
                    onClick={_openDialog}
                    onItemCloseButtonClick={_handle_ItemCloseButtonClick}
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


            {afterFileCollectionChildren && (
                <div
                    data-after-file-collection-children-container
                >{afterFileCollectionChildren}</div>
            )}


        </Box>
    )
}
