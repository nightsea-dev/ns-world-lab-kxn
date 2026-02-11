import {
    IdeaWithKindAndAuthor
} from '@ns-world-lab-kxn/types'
import {
    _cn,
    PayloadRendererProps,
    PayloadWithContentRenderer,
} from '@ns-world-lab-kxn/web'

// ======================================== props
export type IdeaPayloadRendererProps =
    & PayloadRendererProps<IdeaWithKindAndAuthor>

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
