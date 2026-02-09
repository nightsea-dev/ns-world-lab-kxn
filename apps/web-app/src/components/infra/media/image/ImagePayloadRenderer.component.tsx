import {
    IdeaWithAuthor,
    ImageWithKind
} from '@ns-world-lab-knx/types'
import {
    _cn,
    _memo,
    PayloadRendererProps,
    PickCssProperties,
} from '@ns-world-lab-knx/web'
import {
    getRandomColour
} from '@ns-world-lab-knx/logic'

// ======================================== props
export type ImagePayloadRendererProps =
    & PayloadRendererProps<ImageWithKind>
    & Partial<
        & {
            inBg: boolean
            useRandomColour: boolean
        }
    >

// ======================================== component
/**
 * [payload-renderer]
 */
export const ImagePayloadRenderer = ({
    payload
    , inBg
    , useRandomColour
}: ImagePayloadRendererProps
) => {

    const {
        id
        , kind
        , mimeType
        , name
        , src
        , dimensions
        , file
        , size
    } = payload

        , { backgroundColor } = _memo([useRandomColour], () => {
            return {
                backgroundColor: !useRandomColour
                    ? "white" : getRandomColour().toRgbString()
            } as PickCssProperties<"backgroundColor">
        })

    console.log({
        bgColour: backgroundColor
    })

    if (!src) {
        throw new Error(`[payload.src] is required.`)
    }

    return (
        inBg
            ? <div
                title={name}
                data-name={name}
                data-mime-type={mimeType}
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
            : <img
                src={src}
                title={name}
                data-name={name}
                data-mime-type={mimeType}
                className={`
                    pointer-events-none w-full h-full 
                    object-contain
                    `}
                style={{
                    backgroundColor
                }}
            />

    )

}
