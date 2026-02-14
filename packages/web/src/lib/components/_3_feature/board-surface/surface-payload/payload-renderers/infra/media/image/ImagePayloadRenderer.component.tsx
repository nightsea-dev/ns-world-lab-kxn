import {
    ImageWithKind,
} from '@ns-world-lab/types'
import {
    getRandomColour
} from '@ns-world-lab/logic'
import { PayloadRenderer, PayloadRenderer_Props } from '../../../../_types'
import { _memo, _use_state, PickCssProperties } from '../../../../../../../../utils'
import { useImageExtent, UseImageExtentInput } from '../../../../../../../../hooks'
import { ImageErrorPlaceholder } from '../../../../../../../_2_composite'

export type ImagePayloadRendererDisplayType
    = "img" | "bg" | "card"

// ======================================== props
export type ImagePayloadRenderer_Props =
    & PayloadRenderer_Props<ImageWithKind>
    & Partial<
        & {
            useRandomColour: boolean
            displayType: ImagePayloadRendererDisplayType
        }
    >

// ======================================== component
/**
 * [payload-renderer]
 */
export const ImagePayloadRenderer: PayloadRenderer.FC<ImageWithKind, ImagePayloadRenderer_Props> = ({
    payload
    , useRandomColour
    , displayType = "img"
    // , imageRenderer: R
    , ...rest
}) => {

    const [state, _set_state] = _use_state({} as {
        error?: Error
    })

    const {
        id
        , kind
        , mimeType
        , name
        , src
        , extent
        , file
        , size
    } = payload

        , { backgroundColor } = _memo([useRandomColour], () => {
            return {
                backgroundColor: !useRandomColour
                    ? "white" : getRandomColour().toRgbString()
            } as PickCssProperties<"backgroundColor">
        })

        , { commonProps } = _memo([id, name, mimeType, extent], () => ({
            commonProps: {
                "data-image-payload-renderer": id
                , title: `${name} ${!extent ? undefined : `( ${[extent.width, extent.height].join(" x ")} )`}`
                , "data-name": name
                , "data-mime-type": mimeType
            }
        }))

        , _handle_Error: UseImageExtentInput["onError"]
            = ({
                error
                , data: imageInfo
            }) => {
                const {
                    name
                    , message
                    , stack
                } = error

                _set_state({ error })


            }

        , imageExtentHandlers = useImageExtent({
            data: payload
            , onError: _handle_Error
        })


    // console.log({
    //     bgColour: backgroundColor
    // })

    if (!src) {
        throw new Error(`[payload.src] is required.`)
    }

    return (
        state.error
            ? (
                <ImageErrorPlaceholder
                    data={payload}
                    error={state.error}
                />
            )
            : displayType === "img"
                ? (
                    <img
                        src={src}
                        {...commonProps}
                        className={`
                    pointer-events-none w-full h-full 
                    object-contain
                    `}
                        style={{
                            backgroundColor
                        }}
                        {...imageExtentHandlers}
                    />
                )
                : <div
                    {...commonProps}
                    style={{
                        backgroundImage: `url("${src}")`
                        , width: "100%"
                        , height: "100%"
                        , backgroundSize: "contain"
                        , backgroundRepeat: "no-repeat"
                        , backgroundPosition: "50% 50%"
                        , backgroundColor
                    }}
                />


    )

}
