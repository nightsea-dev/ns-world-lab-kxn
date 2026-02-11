import {
    IdeaWithKindAndAuthor
} from '@ns-world-lab/types'
import {
    _cn,
    PayloadRenderer_Props,
    PayloadWithContentRenderer,
} from '@ns-world-lab/web'

// ======================================== props
export type IdeaPayloadRendererProps =
    & PayloadRenderer_Props<IdeaWithKindAndAuthor>

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
