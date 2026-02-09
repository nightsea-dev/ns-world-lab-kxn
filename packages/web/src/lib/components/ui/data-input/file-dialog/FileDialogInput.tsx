import React, { ChangeEvent, DragEvent, FunctionComponent, HTMLAttributes, InputHTMLAttributes, ReactNode, RefCallback, RefObject, useEffect, useRef, useState } from "react"
import { entriesOf, extractFrom, pickFrom } from "@ns-lab-knx/logic"
import { EventHandler, EventHandlersFromMap, HasChildren, HasData, HasEventHandler, HasLabel, HasPartialEventHandler, HasPartialUrl, KeyOf, PartialEventHandlersFromMap, XOR } from "@ns-lab-knx/types"
import {
    _cn, _filterFiles
    , _getFileUrl, _memo, _normaliseFiles, _use_state
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
import { Box, ObjectView } from "../../_basic"
import { FileWithUrlRenderer } from "./FileRenderer"
import {
    FileLoaderProps
    , HasFileLoaderEventHandlers, InputFileItemList
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

        , _addFileItems = (
            inputFileItemList: InputFileItemList
        ) => {

            _set_state({
                m_state: { name: "ADDING FILES" }
            })

            const { loadedFileItems: current_loadedFileItems } = state
                , {
                    filteredFiles: filesToAdd
                    , normalisedFiles
                } = _filterFiles(inputFileItemList, current_loadedFileItems)

                , next_loadedFileItems = [...current_loadedFileItems]

            let latestAction = `LOADED FILES: ${normalisedFiles.length}`

            console.log(latestAction)

            if (filesToAdd.length) {
                next_loadedFileItems[
                    reverseListAdding
                        ? "unshift" : "push"
                ](...(
                    reverseListAdding
                        ? filesToAdd.reverse()
                        : filesToAdd
                ))
                latestAction = `ADDED FILES: ${filesToAdd.length}`
                _set_state({
                    loadedFileItems: next_loadedFileItems
                })
                _emitChange({
                    eventKind: "added fileItems"
                    , addedFileItems: filesToAdd
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
                current_loadedFileItems
                , addedFiles: filesToAdd
            }

        }

        , {
            lifecycle_state
            , onChange: onChange_lifecycle
            , onClick: onClick_lifecycle
        } = useFileDialogLifecycle({
            onLoad: ({ loadedFileItems }) => _addFileItems(loadedFileItems)
        })

        , _removeFileFn = (
            ...fileItems: (LoadedFileItem | LoadedFileItem[])[]
        ) => {

            const requestedFilesToRemove = fileItems.flat(1)

            if (!requestedFilesToRemove.length) {
                return {}
            }

            const fileIdsToRemoveSet
                = new Set(
                    requestedFilesToRemove.map(({ fileID }) => fileID)
                        .filter(Boolean)
                )
                , { loadedFileItems } = state

                , out = {
                    toRemove: [] as LoadedFileItem[]
                    , toKeep: [] as LoadedFileItem[]
                }

            loadedFileItems.forEach(o => {
                out[
                    fileIdsToRemoveSet.has(o.fileID)
                        ? "toRemove"
                        : "toKeep"
                ].push(o)
            })

            if (out.toRemove.length) {
                _revokeUrls(out.toRemove)
                _set_state({
                    loadedFileItems: out.toKeep
                })
            }
            _set_state({
                m_state: {
                    name: "IDLE"
                    , latestAction: `[REMOVE FILE]  `
                }
            })

            return {
                loadedFileItems: out.toKeep
                , removedItems: out.toRemove
            }
        }

        , _clear = () => {
            const {
                removedItems
                , loadedFileItems
            } = _removeFileFn(state.loadedFileItems)
                ;
            ; !loadedFileItems
                || _emitChange({
                    eventKind: "clear"
                    , loadedFileItems
                })
        }


        , _handleInputChange: InputHTMLAttributes<HTMLInputElement>["onChange"]
            = ev => {
                // debugger
                onChange_lifecycle?.(ev)
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handleInputClick: InputHTMLAttributes<HTMLInputElement>["onClick"]
            = () => {
                onClick_lifecycle?.()
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handleItemCloseButtonClick: FileCollectionViewProps["onItemCloseButtonClick"]
            = ({ data: data }) => {
                const {
                    loadedFileItems
                    , removedItems
                } = _removeFileFn(data)
                    ;
                ; !removedItems
                    || _emitChange({
                        eventKind: "removed  fileItems"
                        , loadedFileItems
                        , removedItems
                    })
            }

        , _handleDragEvent = (
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
                        // _set_state({ dragIsOver: true })
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
                    debugger
                    // _set_state({ dragIsOver: false })
                    _set_state({
                        m_state: {
                            name: "IDLE"
                            , latestAction: handlerKey
                        }
                    })

                    _addFileItems(ev.dataTransfer?.files)
                    break
                }
            }

        }

        , dragHandlers = {
            onDragOver: ev => _handleDragEvent("onDragOver", ev)
            , onDragLeave: ev => _handleDragEvent("onDragLeave", ev)
            , onDrop: ev => _handleDragEvent("onDrop", ev)
            , onDragEnter: ev => _handleDragEvent("onDragEnter", ev)
        } as DragEventHemdlers


        , _handleKeyDown: HTMLAttributes<HTMLElement>["onKeyDown"]
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
            onKeyDown={_handleKeyDown}
            className={_cn(
                "relative my-2"
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
            />

            <input
                type="file"
                multiple={multiple}
                ref={el => {
                    _refs.inputElement = el
                }}
                className={_cn(
                    "border border-gray-200 rounded-[5px] p-2"
                    , "hover:bg-gray-100 transition-all duration-[.2s]"
                    , inputIsHidden ? "hidden" : undefined
                )}
                onChange={_handleInputChange}
                onClick={_handleInputClick}
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
                    onItemCloseButtonClick={_handleItemCloseButtonClick}
                    onClearButtonClick={_clear}
                />)}


            {afterFileCollectionChildren && (
                <div
                    data-after-file-collection-children-container
                >{afterFileCollectionChildren}</div>
            )}


        </Box>
    )
}
