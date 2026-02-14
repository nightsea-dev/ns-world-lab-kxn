import {
    _effect
    , BoardSurface_Component,
    _memo,
    _use_state,
    BoardSurface_Props,
    IdeaPayloadRenderer
} from '@ns-world-lab/web'
import {
    createIdeaWithAuthor,
    createIdeaWithAuthorCollection
} from "@ns-world-lab/logic"
import {
    ExtractEventsMap,
    IdeaWithKindAndAuthor
} from '@ns-world-lab/types'
import { AppPage } from '../../_types'

// ======================================== CONST
// ======================================== props
export type IdeasBoard_Page_Props =
    & Partial<
        & Pick<
            BoardSurface_Props<IdeaWithKindAndAuthor>,
            | "data"
            | "onPayloadsAdded"
            | "onPayloadsRemoved"
            | "onChange"
        >
    >

// ======================================== events/derived from props
export type IdeasBoard_Page_EventMap
    = ExtractEventsMap<IdeasBoard_Page_Props>


// ======================================== component
export const IdeasBoard_Page: AppPage.FC<IdeasBoard_Page_Props> = ({
    data: data_IN
    // , createPayloadFn = () => createIdeaWithAuthor()
    // , children = IdeaPayloadRenderer
    , ...rest
}) => {

    const [state, _set_state] = _use_state({
        data: [] as IdeaWithKindAndAuthor[]
        , isFirstRender: true
    })

    _effect([data_IN], () => {
        if (!data_IN || data_IN === state.data) {
            return
        }
        _set_state({
            data: data_IN
        })
    })

    _effect([], () => {

        if (!state.isFirstRender || state.data.length) {
            return
        }

        _set_state({
            data: [createIdeaWithAuthor()]
            , isFirstRender: false
        })
    })

    return (
        <BoardSurface_Component
            {...rest}
            data={state.data}
            // children={children}
            // createPayloadFnMap={{
            //     "Add Idea": createIdeaWithAuthor
            // }}
            payloadInfosMap={{
                idea: {
                    factory: createIdeaWithAuthorCollection
                    , payloadRenderer: IdeaPayloadRenderer
                    , buttonLabel: "Add Idea"
                }
            }}

        >
            {/* {IdeaPayloadRenderer} */}
            {/* {({ payload }) => {
                return <IdeaPayloadRenderer
                    payload={payload}
                />
            }} */}
        </BoardSurface_Component>
    )

}

