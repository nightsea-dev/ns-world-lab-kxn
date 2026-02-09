import {
    IdeaWithAuthor
} from '@ns-world-lab-knx/types'
import {
    _cn,
    PayloadRendererProps,
    PayloadWithContentRenderer,
} from '@ns-world-lab-knx/web'

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
        <PayloadWithContentRenderer
            payload={payload}
        />
    )

}
