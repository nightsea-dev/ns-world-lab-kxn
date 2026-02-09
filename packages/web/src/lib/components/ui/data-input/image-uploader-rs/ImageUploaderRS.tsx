import { ReactElement, ReactNode, useEffect, useId, useState } from "react"
import {
    FileType, Loader, Modal
    , Uploader as RSUploader
    , UploaderProps as RSUploaderProps
} from "rsuite"
import {
    EventHandlersFromMap
    , HasId
} from "@ns-lab-knx/types"
import {
    ControlButtons
    , ControlButtonsProps, ControlButtonsRenderer
} from "../../buttons"
import {
    FileDialogInput
    , FileDialogInputProps
} from "../file-dialog"
import {
    _effect, _filterFiles, _getFileID
    , _getFileUrl, _memo, _use_state
} from "../../../../utils"
import {
    HasLoadedFileItems
    , LoadedFileItem
} from "../../../../types"
import { Box, ObjectView } from "../../_basic"
import { ImageInfo, ImageCard } from "../../media"
import { ListNS } from "../../collections"
import { pickFrom } from "../../../../../../../logic/src"


// ======================================== types
export type LoadedFileItemWithID =
    & LoadedFileItem
    & HasId

// ======================================== helpers/transformations
const _transform_LoadedFileItem_to_LoadedFileItemWithID = (
    loadedFileItem: LoadedFileItem
): LoadedFileItemWithID => ({
    ...loadedFileItem
    , id: loadedFileItem.fileID
})

    , _transform_RsFileType_to_LoadedFileItem = ({
        blobFile
    }: FileType
    ): LoadedFileItemWithID => {
        const fileID = _getFileID(blobFile!)!
        return {
            ...blobFile!
            , fileID
            , url: _getFileUrl(blobFile!)!
            , id: fileID
        }
    }

    , _transform_RsFileType_to_ImageInfo = (
        fileType: FileType
    ): ImageInfo => {
        const {
            fileID: id
            , name
            , url: src
        } = _transform_RsFileType_to_LoadedFileItem(fileType)
        return { id, src, name }
    }



// ======================================== events
export type ImageUploaderRS_EventsMap = {
    cancel: {}
    done: HasLoadedFileItems<LoadedFileItemWithID>
}

// ======================================== types
type ImageUploaderRS_Status =
    | "IDLE"
    | "PROCESSING"
    | "SELECTING IMAGES"
    | "SEEKING"

// ======================================== props
export type ImageUploaderRS_Props =
    & Partial<
        & {
            controlButtonsRenderer: ControlButtonsRenderer
        }
        & Pick<FileDialogInputProps, "placeholder">
        & EventHandlersFromMap<ImageUploaderRS_EventsMap>
    >



// ======================================== component
export const ImageUploaderRS = ({
    placeholder = "Click to upload or drag an image"
    , controlButtonsRenderer: R = ControlButtons
    , onCancel
    , onDone
}: ImageUploaderRS_Props
) => {

    const id = useId()

        , [state, _set_state, _set_state_async] = _use_state({
            loadedFileItemsWithID: [] as LoadedFileItemWithID[]
            , status: "IDLE" as ImageUploaderRS_Status
        })
        , { imageInfos } = _memo([state.loadedFileItemsWithID]
            , () => ({
                imageInfos: state.loadedFileItemsWithID.map(_transform_RsFileType_to_ImageInfo)
            })
        )

        , _handle_FileDialogInput_Click: FileDialogInputProps["onClick"]
            = ev => {

            }

        , _handle_FileDialogInput_Load: FileDialogInputProps["onLoad"]
            = ({ loadedFileItems }) => {

                debugger

                _set_state_async({
                    status: "PROCESSING"
                }).then(state => {

                    debugger

                    const {
                        filteredFiles: fileItemsToAdd
                        , normalisedFiles
                    } = _filterFiles(loadedFileItems, state.loadedFileItemsWithID)

                    if (!fileItemsToAdd.length) {
                        return
                    }

                    _set_state(p => {
                        const next_loadedFileItemsWithID = [...p.loadedFileItemsWithID]
                        next_loadedFileItemsWithID.push(
                            ...fileItemsToAdd.map(_transform_LoadedFileItem_to_LoadedFileItemWithID)
                        )
                        return {
                            ...p
                            , loadedFileItemsWithID: next_loadedFileItemsWithID
                        }
                    })


                }).finally(() => {
                    _set_state_async({
                        status: "IDLE"
                    })
                })


            }

        , _handleControlButtonDone = () => {
            const { loadedFileItemsWithID: loadedFileItems } = state
            onDone?.({ loadedFileItems })
            onCancel?.()
        }

        , _handleLoaderClick: RSUploaderProps["onClickCapture"] = ev => {
            if (state.status === "SEEKING") {
                return
            }
            _set_state({
                status: "SEEKING"
            })
        }

        , _handleRsUploaderChange: RSUploaderProps["onChange"]
            = fileTypeList => _handle_FileDialogInput_Load({
                loadedFileItems: fileTypeList.map(_transform_RsFileType_to_LoadedFileItem)
            })

        , _handleControlButtonClear = (
            ...fileList: FileType[]
        ) => {

            if (!fileList.length) {
                if (!(fileList = state.loadedFileItemsWithID).length) {
                    return
                }
            }

            debugger
            fileList.forEach(({
                blobFile
            }) => {
                const url = _getFileUrl(blobFile)
                    ; !url || URL.revokeObjectURL(url)
            })
            _set_state({
                loadedFileItemsWithID: []
            })
        }

        , _handleRsUploaderRemove: RSUploaderProps["onRemove"] = ({
            blobFile
        }) => {

            if (!blobFile) {
                return
            }

            const fileID_toRemove = _getFileID(blobFile)!
                , {
                    loadedFileItemsWithID: current_loadedFileItems
                } = state
                , [removedITem] = current_loadedFileItems.splice(
                    current_loadedFileItems.findIndex(({ fileID }) => fileID === fileID_toRemove)
                    , 1
                )
            if (!removedITem) {
                return
            }
            debugger
            _handleControlButtonClear(removedITem)
        }

        , _handleRsUploaderRenderInfo: RSUploaderProps["renderFileInfo"] = (
            fileType
            , fileElement
        ) => {
            return (
                !fileType.blobFile
                    ? fileElement
                    : <ImageCard
                        data={_transform_RsFileType_to_ImageInfo(fileType)}
                    />
            )
        }




    _effect([], () => {
        return () => {
            _handleControlButtonClear()
        }
    })


    return (
        <Box
            id={id}
            className="h-full w-full flex flex-col gap-4 p-6"
            header={ImageUploaderRS.name}
        >
            {state.status !== "IDLE"
                && (
                    <Modal
                        backdrop={false}
                        centered
                        keyboard={false}
                        container={() => document.getElementById(id)!}
                    >
                        <Loader />
                    </Modal>)}

            {R && (
                <R
                    showInfoName={ImageUploaderRS.name + ".ControlButtonsRenderer"}
                    isDisabled={{
                        clear: !state.loadedFileItemsWithID.length
                        , done: !state.loadedFileItemsWithID.length
                    }}
                    onCancel={onCancel}
                    onClear={_handleControlButtonClear}
                    onDone={_handleControlButtonDone}
                    infoData={state as any}
                />
            )}

            <FileDialogInput
                multiple
                onLoad={_handle_FileDialogInput_Load}
                onClick={_handle_FileDialogInput_Click}
                placeholder={placeholder}
            />
            <div>imageInfos: {imageInfos.length}</div>
            {/* 
            {false &&
                <RSUploader
                    action=""
                    autoUpload={false}
                    multiple
                    draggable
                    accept="image/*"
                    fileList={state.loadedFileItemsWithID}
                    className="cursor-default"
                    style={{
                        cursor: "default"
                    }}
                    onClickCapture={_handleLoaderClick}
                    onBeforeInput={ev => {
                        console.log("onBeforeInput", ev)
                        debugger
                    }}
                    onChange={_handleRsUploaderChange}
                    onRemove={_handleRsUploaderRemove}
                    renderFileInfo={_handleRsUploaderRenderInfo}
                >
                    <div style={{
                        height: 200
                        , display: 'flex'
                        , alignItems: 'center'
                        , justifyContent: 'center'
                    }}>
                        <span>{message}</span>
                    </div>
                </RSUploader>
            } */}

            {/* <ImageGrid
                data={state.fileInputItems}
                noData={(
                    <div
                        className="text-gray-500"
                    >
                        No images selected
                    </div>
                )}
            /> */}

            <ListNS
                data={imageInfos}
                renderer={ImageCard}
                headerLabel={<div>
                    Images [{imageInfos.length}]
                </div>}
            />


        </Box>
    )
}
