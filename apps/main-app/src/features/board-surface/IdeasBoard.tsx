import {
    _effect
    , BoardSurfaceProps
    , BoardSurface
} from '@ns-lab-klx/web'
import {
    createIdeaWithAuthor
} from "@ns-lab-klx/logic"
import {
    IdeaNodeComponent
} from '../../components'
import {
    IdeaWithAuthor
} from '@ns-lab-klx/types'

// ======================================== CONST
const APP_NAME = "@ns-lab-klx/main-app"
// ======================================== props
export type IdeasBoardProps =
    & Partial<
        & Pick<
            BoardSurfaceProps<IdeaWithAuthor>,
            | "data"
            | "createPayloadFn"
            | "onNodesAdded"
            | "onNodesRemoved"
            | "children"
        // | "payloadRenderer"
        >
    >
// ======================================== component
export const IdeasBoard = ({
    data
    , createPayloadFn = createIdeaWithAuthor
    , children = IdeaNodeComponent
    , ...rest
}: IdeasBoardProps
) => {

    _effect([], () => {
        document.title = APP_NAME
    })

    return (
        <BoardSurface
            {...rest}
            data={data}
            createPayloadFn={createPayloadFn}
            children={children}
            kind="idea"
        // createPayloadFn={createDataItemFn}
        // kind="idea"
        // data={data}
        // payloadRenderer={() => {
        //     return (
        //         <IdeaNodeComponent
        //         />
        //     )
        // }}
        />
    )

}

