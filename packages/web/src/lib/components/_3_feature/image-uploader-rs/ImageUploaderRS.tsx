import { ReactElement, ReactNode, useEffect, useId, useState } from "react"
import {
    FileType, Loader, Modal
    , Uploader as RSUploader
    , UploaderProps as RSUploaderProps
} from "rsuite"
import {
    EventHandlersFromMap
    , HasId
} from "@ns-world-lab-kxn/types"
import { HasLoadedFileItems, ImageInfo, LoadedFileItem } from "../../../types"
import { _effect, _getFileID_fromFile, _getUrl_fromFile, _memo, _use_state } from "../../../utils"
import { ControlButtons, ControlButtonsRenderer, ImageCard } from "../../_2_composite"
import { Box } from "../../_1_primitive"


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

    , _transform_RsFileType_to_LoadedFileItemWithID = ({
        blobFile
    }: FileType
    ): LoadedFileItemWithID => {
        const fileID = _getFileID_fromFile(blobFile!)!
        return {
            ...blobFile!
            , fileID
            , url: _getUrl_fromFile(blobFile!)!
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
        } = _transform_RsFileType_to_LoadedFileItemWithID(fileType)
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
            placeholder: ReactNode
        }
        // & Pick<FileDialogInputProps, "placeholder">
        & EventHandlersFromMap<ImageUploaderRS_EventsMap>
    >



// ======================================== component
/**
 * @deprecated use **FileDialogInput**
 */
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

        , _add_files = (
            fileItems: (LoadedFileItemWithID | LoadedFileItem)[]
        ) => {
            const fileItemsToAdd = fileItems.map(o => ({
                ...o
                , id: (o as HasId).id ?? o.fileID
            } as LoadedFileItemWithID))

            if (!fileItemsToAdd.length) {
                return
            }

            _set_state_async({
                status: "PROCESSING"
            }).then(state => {

                _set_state(p => {
                    const next_loadedFileItemsWithID = [
                        ...p.loadedFileItemsWithID
                        , ...fileItemsToAdd
                    ]
                        , unique_loadedFileItemsWithID
                            = [...new Map(
                                next_loadedFileItemsWithID
                                    .map(o => [o.fileID, o]
                                    )
                            ).values()]

                    return {
                        ...p
                        , loadedFileItemsWithID: unique_loadedFileItemsWithID
                    }
                })


            }).finally(() => {
                _set_state_async({
                    status: "IDLE"
                })
            })


        }

        // , _handle_FileDialogInput_Change: FileDialogInputProps["onChange"]
        //     = ev => {

        //         const {
        //             loadedFileItemsWithID: current_loadedFileItemsWithID
        //         } = state
        //             , {
        //                 eventKind
        //                 , loadedFileItems
        //             } = ev

        //         switch (eventKind) {
        //             case "added fileItems": {
        //                 break
        //             }
        //             case "removed  fileItems": {
        //                 break
        //             }
        //             case "clear": {
        //                 break
        //             }
        //         }
        //         debugger
        //         _add_files(loadedFileItems)


        //     }


        , _handleControlButtonDone = () => {
            const { loadedFileItemsWithID: loadedFileItems } = state
            onDone?.({ loadedFileItems })
            onCancel?.()
        }


        , _handle_RSUploader_Click: RSUploaderProps["onClickCapture"]
            = ev => {

            }
        , _handleRsUploaderChange: RSUploaderProps["onChange"]
            = fileTypeList => _add_files(fileTypeList.map(_transform_RsFileType_to_LoadedFileItemWithID))

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
                const url = _getUrl_fromFile(blobFile)
                    ; !url || URL.revokeObjectURL(url)
            })
            _set_state({
                loadedFileItemsWithID: []
            })
        }

        , _handle_RSUploader_Remove: RSUploaderProps["onRemove"] = ({
            blobFile
        }) => {

            if (!blobFile) {
                return
            }

            const fileID_toRemove = _getFileID_fromFile(blobFile)!
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

        , _handle_RSUploader_RenderInfo: RSUploaderProps["renderFileInfo"] = (
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

            {/* <Box
                header={FileDialogInput.name}
            >
                <FileDialogInput
                    multiple
                    // onLoad={_handle_FileDialogInput_Load}
                    onChange={_handle_FileDialogInput_Change}
                    placeholder={placeholder}
                />
            </Box> */}
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
                onClickCapture={_handle_RSUploader_Click}
                onBeforeInput={ev => {
                    console.log("onBeforeInput", ev)
                    debugger
                }}
                onChange={_handleRsUploaderChange}
                onRemove={_handle_RSUploader_Remove}
                renderFileInfo={_handle_RSUploader_RenderInfo}
            >
                <div style={{
                    height: 200
                    , display: 'flex'
                    , alignItems: 'center'
                    , justifyContent: 'center'
                }}>
                    <span>{placeholder}</span>
                </div>
            </RSUploader>


            {/* <ListNS
                header={[ImageUploaderRS.name, ListNS.name].join(".")}
                data={imageInfos}
                renderer={ImageCard}
                headerLabel={<div>
                    Images [{imageInfos.length}]
                </div>}
            />
 */}

        </Box>
    )
}
