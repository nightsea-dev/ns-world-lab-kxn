import React, { ChangeEvent, DragEvent, FunctionComponent, HTMLAttributes, InputHTMLAttributes, ReactNode, RefObject, useEffect, useRef, useState } from "react"
import { entriesOf, extractFrom, pickFrom } from "@ns-lab-knx/logic"
import { EventHandlersFromMap, HasChildren, HasData, HasEventHandler, HasLabel, HasPartialEventHandler, HasPartialUrl, KeyOf, PartialEventHandlersFromMap, XOR } from "@ns-lab-knx/types"
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
    , InputFileItemList
    , LoadedFileItem
} from "../../../../types"
import { ObjectViewWithToggle } from "../../data-display"


// ======================================== handle
export type FileDialogHandleValue =
    & {
        inputElement?: HTMLInputElement | null
    }

export type FileDialogHandleRef = RefObject<FileDialogHandleValue>

// ======================================== props
export type FileDialogInputProps =
    & FileLoaderProps
    & Partial<
        & HasLabel<ReactNode>
        & {
            placeholder: ReactNode
            isDroppable: boolean
            inputIsHidden: boolean
            showFileCollection: boolean
            handleRef: FileDialogHandleRef
            fileRenderer: FileWithUrlRenderer
            beforeFileCollectionChildren: ReactNode
        }
        & XOR<
            {
                afterFileCollectionChildren: ReactNode
            }
            , PickHtmlAttributes<"children">
        >
        & PickHtmlAttributes<"className" | "onClick">
        & Pick<HTMLInputElement, "multiple">
    >

// ======================================== component
export const FileDialogInput = ({
    label
    , placeholder: placeholder_IN = "Drop files here, or click to choose"
    , isDroppable = true
    , inputIsHidden //= true
    , showFileCollection = true
    , handleRef
    , fileRenderer = FileWithUrlRenderer.DEFAULT
    , beforeFileCollectionChildren
    , children
    , afterFileCollectionChildren = children
    , multiple
    , onLoad: onLoad_IN
    , onClick: onClick_IN
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
        , { current: _refs } = useRef({} as {
            inputElement?: HTMLInputElement | null
        })
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


        , _addFiles = (
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
                next_loadedFileItems.push(...filesToAdd)
                latestAction = `ADDED FILES: ${filesToAdd.length}`
                _set_state({
                    loadedFileItems: next_loadedFileItems
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
            onLoad: ({ loadedFileItems }) => _addFiles(loadedFileItems)
        })

        , _removeFileFn = (
            ...fileItems: (LoadedFileItem | LoadedFileItem[])[]
        ) => {
            debugger
            const requestedFilesToRemove = fileItems.flat(1)

            if (!requestedFilesToRemove.length) {
                return
            }

            const fileIdsToRemove
                = requestedFilesToRemove.map(({ fileID }) => fileID)
                    .filter(Boolean)

                , { loadedFileItems } = state

                , out = {
                    toRemove: [] as LoadedFileItem[]
                    , toKeep: [] as LoadedFileItem[]
                }
            loadedFileItems.forEach(o => {
                out[
                    fileIdsToRemove.includes(o.fileID)
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
                current_loadedFileItems: out.toKeep
                , removed: out.toRemove
            }
        }

        , _handleChange: InputHTMLAttributes<HTMLInputElement>["onChange"]
            = ev => {
                onChange_lifecycle?.(ev)
                onLoad_IN?.({
                    loadedFileItems: state.loadedFileItems
                })
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handleClick: InputHTMLAttributes<HTMLInputElement>["onClick"]
            = ev => {
                onClick_lifecycle?.()
                onClick_IN?.(ev)
                    ;
                ; !_refs.inputElement || (_refs.inputElement.value = "")
            }

        , _handleItemCloseButtonClick: FileCollectionViewProps["onItemCloseButtonClick"]
            = ({ data }) => _removeFileFn(data)

        , _handleClearButtonClick: FileCollectionViewProps["onClearButtonClick"]
            = (ev) => _removeFileFn(state.loadedFileItems)

        , _handleCollectionClick: FileCollectionViewProps["onClick"]
            = () => _openDialog()


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

                    _addFiles(ev.dataTransfer?.files)
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

    if (handleRef) {
        handleRef.current.inputElement = _refs.inputElement
    }
    // handleRef ??= useRef<FileDialogHandleValue>({})
    ;

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
            {/* <div
                className={_cn(
                    "absolute w-[100%] h-[100%] z-[1000] bg-gray-300"
                    , state.dragIsOver ? undefined : "hidden"
                )}
            /> */}
            <ObjectViewWithToggle
                data={{
                    ...pickFrom(lifecycle_state, "dialogMState")
                    , state
                }}
                header={FileDialogInput.name}
            />
            {/* <Box>
                {state.showInfo && <ObjectView
                    data={{
                        ...pickFrom(lifecycle_state, "dialogMState")
                        , state
                    }}
                    showOnlyArrayLength
                    header={FileDialogInput.name}
                // grayHeader
                />}
                <ShowInfoToggle
                    checked={state.showInfo}
                    onChange={_set_state}
                    name={FileDialogInput.name}
                />
            </Box> */}

            {label && (
                <div
                    data-label-container
                >
                    {label}
                </div>)}
            <div
                data-placeholder
            >{placeholder}</div>

            <input
                type="file"
                multiple={multiple}
                ref={el => {
                    ; !handleRef || (handleRef.current.inputElement = el)
                    _refs.inputElement = el
                }}
                className={_cn(
                    "border border-gray-200 rounded-[5px] p-2"
                    , "hover:bg-gray-100 transition-all duration-[.2s]"
                    , inputIsHidden ? "hidden" : undefined
                )}
                onChange={_handleChange}
                onClick={_handleClick}
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
                    onClick={_handleCollectionClick}
                    onItemCloseButtonClick={_handleItemCloseButtonClick}
                    onClearButtonClick={_handleClearButtonClick}
                />)}


            {afterFileCollectionChildren && (
                <div
                    data-after-file-collection-children-container
                >{afterFileCollectionChildren}</div>
            )}


        </Box>
    )
}
