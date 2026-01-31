import { FunctionComponent, ReactElement, ReactNode, useId, useRef } from "react"
import { KeyOf, User } from "@ns-lab-klx/types"
import { createIdeaWithAuthor, createUser, keysOf } from "@ns-lab-klx/logic"
import {
    _cb, _effect, _memo, _use_state
    , ObjectView, Page
    , PickHtmlAttributes, SurfaceNode,
    ToggleRS,
    ToggleTW,
    ViewContainer
} from "@ns-lab-klx/web"
import { Button, ButtonGroup, Nav, NavMenu, Toggle } from "rsuite"
import { IdeasBoard, IdeasBoardProps } from "../board-surface"
import { UserAdmin, UserAdminProps } from "../user-admin"

const FEATURES = {
    IdeasBoard
    , UserAdmin
}
    , FEATURE_KEYS = keysOf(FEATURES).sort((a, b) => a.localeCompare(b))

type FEATURES = typeof FEATURES
type FeatureKey = KeyOf<FEATURES>



// ========================================
export const MainApp = ({
    initialFeatureKey = "IdeasBoard"
}: {
    initialFeatureKey?: FeatureKey
}) => {

    const id = useId()

        , [state, _set_state] = _use_state({
            selectedFeatureKey: initialFeatureKey
            , currentUser: createUser() as User

            , surfaceNodes: [] as SurfaceNode<any>[]
            , loadedUsers: [] as User[]

            , showInfo: false

        })

        , _refs = useRef({

            ideasBoardProps: {
                createDataItemFn: createIdeaWithAuthor
                , data: [createIdeaWithAuthor()]
            } as IdeasBoardProps

            , userAdminProps: {
                // loadUsersOnFirstRender: true
                onUsersChange: ({
                    users: loadedUsers
                }) => _set_state({ loadedUsers })
            } as UserAdminProps

        })

        , _handleClick = _cb((
            selectedFeatureKey: FeatureKey
        ) => {
            _set_state(p => ({
                ...p
                , selectedFeatureKey
            }))
        })


    return (
        <Page
            id={id}
            data-main-app
            headerTitle={state.selectedFeatureKey}
            headerUser={state.currentUser}
            headerMidContent={(
                <div
                    data-nav-menu-container
                    className="flex items-center gap-2 whitespace-nowrap"
                >

                    {state.showInfo &&
                        <ObjectView
                            data={state}
                            showOnlyArrayLength
                        />
                    }
                    <Nav
                        appearance="subtle"
                        activeKey={state.selectedFeatureKey}
                        onSelect={(eventKey) => {
                            if (!eventKey) return
                            _handleClick(eventKey as FeatureKey)
                        }}
                    >
                        {FEATURE_KEYS.map((k) => (
                            <Nav.Item eventKey={k} key={k}>
                                {k}
                            </Nav.Item>
                        ))}
                    </Nav>
                    <ToggleRS
                        checked={state.showInfo}
                        onChange={({ value: showInfo }) => _set_state({ showInfo })}
                    >
                        Show Info
                    </ToggleRS>

                </div>
            )}
        >
            {/* <TailwindSanity_02 /> */}
            <ViewContainer
                isVisible={state.selectedFeatureKey === "IdeasBoard"}
            >
                <IdeasBoard
                    {..._refs.current.ideasBoardProps}
                />
            </ViewContainer>
            <ViewContainer
                isVisible={state.selectedFeatureKey === "UserAdmin"}
            >
                <UserAdmin
                    {..._refs.current.userAdminProps}
                />
            </ViewContainer>
        </Page>
    )

}