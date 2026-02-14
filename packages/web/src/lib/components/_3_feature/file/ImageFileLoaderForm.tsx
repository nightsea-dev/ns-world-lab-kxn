import { EventHandlersFromMap, ExtractEventHandlersMap, HasData, HasName, HasUrl, EventHandlersFromMapPartial } from "@ns-world-lab/types"
import { FileLoader_Props, LoadedFileItemWithPartialError, FileItemWithPartialUrlAndPartialFileID, FileLoader } from "../../../types"
import { SimpleForm, SimpleFormProps } from "../simple-form"
import { _use_state, createImageInfo, fetchImage, FetchImageInput } from "../../../utils"
import { useImageLoader } from "../../../hooks"
import { ButtonCollectionRS, ImageFactory } from "../../_2_composite"
import { createImageSource } from "@ns-world-lab/logic"
import { Box } from "../../_1_primitive"


type FromSource = HasName & HasUrl
const EMPTY_ImageInfo = () => ({
    name: ""
    , url: ""
} as FromSource)



type BaseProps = {
    enableFactoryButtons?: boolean
}

type Props =
    & BaseProps
    & FileLoader_Props<LoadedFileItemWithPartialError>



export const ImageFileLoaderForm: FileLoader.FC<
    Props
> = ({
    enableFactoryButtons
    , onLoad: onLoad_IN
}) => {

        const [state, _set_state] = _use_state({
            loaderStatus: "IDLE" as "IDLE" | "LOADING"
            , imageInfo: EMPTY_ImageInfo()
        })
            , { fetchFn } = useImageLoader({
                onLoad: onLoad_IN
            })

            , formHandlers = {

                onChange: ({ currentData: formData }) => _set_state({ imageInfo: formData })

                , onDone: ({ data: imageInfo }) => {

                    _set_state({
                        imageInfo
                        , loaderStatus: "LOADING"
                    })

                    fetchFn(imageInfo)
                        .then(result => {
                            _set_state(p => ({
                                ...p
                                , imageInfo: EMPTY_ImageInfo()
                            }))
                        })
                        .finally(() => {
                            _set_state({
                                loaderStatus: "IDLE"
                            })
                        })

                }
            } as ExtractEventHandlersMap<SimpleFormProps<FromSource>>


        return (
            <div>
                <div>
                    enableFactoryButtons: {String(enableFactoryButtons)}
                </div>
                <SimpleForm
                    data-manual-image-file-loader
                    bordered
                    data={state.imageInfo}
                    buttonAreDisabled={state.loaderStatus === "LOADING"}
                    {...formHandlers}
                    buttonLabels={{
                        done: "Add"
                    }}
                />
                {enableFactoryButtons && onLoad_IN
                    && <ImageFactory
                        onImageFileItem={({ data }) => onLoad_IN({ data: [data] })}
                        onImageInfo={({
                            data: {
                                src: url
                                , name
                            }
                        }) => _set_state({
                            imageInfo: {
                                name
                                , url
                            }
                        })}
                    />
                }
            </div>
        )
    }

export {
    type Props as ImageFileLoaderForm_Props
}
