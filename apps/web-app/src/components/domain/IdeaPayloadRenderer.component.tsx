import {
    IdeaWithAuthor
} from '@ns-lab-knx/types'
import {
    _cn,
    PAYLOAD_RENDERERS,
    PayloadRendererProps,
} from '@ns-lab-knx/web'

// ======================================== props
export type IdeaPayloadRendererProps =
    & PayloadRendererProps<IdeaWithAuthor>

// ======================================== component
/**
 * [payload-renderer]
 */
export const IdeaPayloadRenderer = ({
    payload
}: IdeaPayloadRendererProps
) => {

    // const {
    //     content
    //     , color
    //     , kind
    //     , title
    // } = payload

    return (
        <PAYLOAD_RENDERERS.WithContentRenderer
            payload={payload}
        />
    )

}
