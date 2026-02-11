import { ImportMetaEnv, ObjectViewWithToggle } from "@ns-world-lab-kxn/web";
import { ComponentProps, FunctionComponent, ReactElement, ReactNode, useId, useRef } from "react"
import { IdeaWithKind, IdeaWithKindAndAuthor, KeyOf, SuffixedString, User } from "@ns-world-lab-kxn/types"
import { createIdeaWithAuthor, createUser, keysOf } from "@ns-world-lab-kxn/logic"
import {
    _cb, _effect, _memo, _use_state
    , HasSurfaceNode, ObjectView
    , MainPage
    , ShowInfoToggle, SurfaceNode
    , ToggleRS
    , WorkspaceView
} from "@ns-world-lab-kxn/web"
import { Nav } from "rsuite"
import {
    IdeasBoard, IdeasBoardProps, KnownPayload, KnownPayloadsBoard
    , KnownPayloadsBoardProps
    , UserAdmin, UserAdminProps
} from "../../features"

const PAGES_MAP = {
    IdeasBoard
    , KnownPayloadsBoard
    , UserAdmin
}

    , PAGE_KEYS = keysOf(PAGES_MAP).sort((a, b) => a.localeCompare(b))

type PAGES_MAP = typeof PAGES_MAP
type PageKey = KeyOf<PAGES_MAP>

type PageStates = {
    IdeasBoard: {
        surfaceNodes: SurfaceNode<IdeaWithKindAndAuthor>[]
    }
    KnownPayloadsBoard: {
        surfaceNodes: SurfaceNode<KnownPayload>[]
    }
    UserAdmin: {
        loadedUsers: User[]
    }
}

// ========================================

const {
    APP_NAME: APP_NAME
    , IS_IN_DEBUG_MODE: IS_IN_DEBUG_MODE
} = ImportMetaEnv

console.log({ APP_NAME, IS_IN_DEBUG_MODE })

// ========================================
export const MainApp = ({
    initialPageKey = "KnownPayloadsBoard"
}: {
    initialPageKey?: PageKey
}) => {

    const id = useId()
        , [pagesStates, _set_pagesStates] = _use_state({
            IdeasBoard: {
                surfaceNodes: []
            }
            , KnownPayloadsBoard: {
                surfaceNodes: []
            }
            , UserAdmin: {
                loadedUsers: []
            }
        } as PageStates)

        , [state, _set_state] = _use_state({
            currentPageKey: initialPageKey
            , currentUser: createUser() as User

            // , surfaceNodes: [] as SurfaceNode<any>[]

            // , loadedUsers: [] as User[]

            , infoIsShown: false

        })


        , _refs = useRef({

            IdeasBoardProps: {
                createDataItemFn: createIdeaWithAuthor
                , data: [createIdeaWithAuthor()]
                , onChange: ({
                    eventKind
                    , payloads
                    , surfaceNodes
                }) => {
                    _set_pagesStates(p => ({
                        ...p
                        , IdeasBoard: {
                            surfaceNodes
                        }
                    }))
                }
            }

            , KnownPayloadsBoardProps: {
                onChange: ({
                    eventKind
                    , payloads
                    , surfaceNodes
                }) => {
                    _set_pagesStates(p => ({
                        ...p
                        , KnownPayloadsBoard: {
                            surfaceNodes
                        }
                    }))
                }
            }

            , UserAdminProps: {
                onUsersChange: ({ users: loadedUsers }) => {
                    _set_pagesStates(p => ({
                        ...p
                        , UserAdmin: {
                            loadedUsers
                        }
                    }))
                }
            }

        } as {
                [k in PageKey as `${k}Props`]: ComponentProps<PAGES_MAP[k]>
            })

        , _handle_NavButtonClick = _cb((
            selectedFeatureKey: PageKey
        ) => {
            _set_state(p => ({
                ...p
                , currentPageKey: selectedFeatureKey
            }))
        })

    _effect([], () => {
        document.title = APP_NAME
    })

    return (
        <MainPage
            id={id}
            data-main-app
            headerTitle={state.currentPageKey}
            headerUser={state.currentUser}
            headerMidContent={(
                <div
                    data-nav-menu-container
                    className="flex items-center gap-2 whitespace-nowrap"
                >
                    <ObjectViewWithToggle
                        data={{
                            state
                            , pagesStates
                        }}
                        showOnlyArrayLength
                        isShown={state.infoIsShown}
                        onChange={({ isShown: infoIsShown }) => _set_state({ infoIsShown })}
                        label="Show Info"
                    />
                    <Nav
                        appearance="subtle"
                        activeKey={state.currentPageKey}
                        onSelect={(eventKey) => {
                            if (!eventKey) {
                                return
                            }
                            _handle_NavButtonClick(eventKey as PageKey)
                        }}
                    >
                        {PAGE_KEYS.map((k) => (
                            <Nav.Item
                                key={k}
                                eventKey={k}
                            >
                                {k}
                            </Nav.Item>
                        ))}
                    </Nav>
                    {/* <ShowInfoToggle
                        checked={state.showInfo}
                        onChange={({ showInfo: showInfo }) => _set_state({ showInfo })}
                    /> */}
                </div>
            )}
        >
            {/* <TailwindSanity_02 /> */}
            <WorkspaceView
                isActive={state.currentPageKey === "IdeasBoard"}
            >
                <IdeasBoard
                    {..._refs.current.IdeasBoardProps}
                />
            </WorkspaceView>
            <WorkspaceView
                isActive={state.currentPageKey === "UserAdmin"}
            >
                <UserAdmin
                    {..._refs.current.UserAdminProps}
                />
            </WorkspaceView>
            <WorkspaceView
                isActive={state.currentPageKey === "KnownPayloadsBoard"}
            >
                <KnownPayloadsBoard
                    {..._refs.current.KnownPayloadsBoardProps}
                />
            </WorkspaceView>
        </MainPage>
    )

}