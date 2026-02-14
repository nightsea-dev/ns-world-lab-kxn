import {
    IdeaWithKindAndAuthor
} from '@ns-world-lab/types'
import { PayloadRenderer } from '../../_types'
import { PayloadWithContentRenderer } from '../generic'


// ======================================== props
// export type IdeaPayloadRendererProps =
//     & PayloadRenderer_Props<IdeaWithKindAndAuthor>

// ======================================== component
/**
 * [payload-renderer]
 */
export const IdeaPayloadRenderer: PayloadRenderer.FC<IdeaWithKindAndAuthor> = ({
    payload
}) => {

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
