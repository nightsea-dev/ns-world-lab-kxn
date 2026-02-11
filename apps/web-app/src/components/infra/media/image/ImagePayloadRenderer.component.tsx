import {
    HasError,
    HasPartialError,
    IdeaWithKindAndAuthor,
    ImageWithKind,
    XOR
} from '@ns-world-lab/types'
import {
    _cn,
    _memo,
    _use_state,
    HasImageInfo,
    ImageErrorPlaceholder,
    ImageRenderer,
    ImageRendererProps,
    PayloadRenderer_Props,
    PickCssProperties,
    useImageExtent,
    UseImageExtentInput,
    UseImageExtentOutput,
} from '@ns-world-lab/web'
import {
    getRandomColour
} from '@ns-world-lab/logic'
import { FunctionComponent } from 'react'

export type ImagePayloadRendererDisplayType
    = "img" | "bg" | "card"

// ======================================== props
export type ImagePayloadRendererProps =
    & PayloadRenderer_Props<ImageWithKind>
    & Partial<
        & {
            //displayType: ImagePayloadRendererDisplayType
            useRandomColour: boolean
            displayType: ImagePayloadRendererDisplayType
        }
    // & XOR<
    //     & {
    //         displayType: ImagePayloadRendererDisplayType
    //     }
    //     , {
    //         imageRenderer: ImageRenderer<
    //             & ImageRendererProps
    //             & Partial<
    //                 & HasError
    //                 & Pick<UseImageExtentInput, "onError">
    //             >
    //         >
    //     }
    // >
    >

// ======================================== component
/**
 * [payload-renderer]
 */
export const ImagePayloadRenderer = ({
    payload
    , useRandomColour
    , displayType = "img"
    // , imageRenderer: R
    , ...rest
}: ImagePayloadRendererProps
) => {

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
