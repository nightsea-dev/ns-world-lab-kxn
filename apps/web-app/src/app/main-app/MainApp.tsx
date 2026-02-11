import { ImportMetaEnv, ObjectViewWithToggle } from "@ns-world-lab/web";
import { ComponentProps, useId, useRef } from "react"
import { ExtractEventHandlersMap, ExtractEventsMap, IdeaWithKindAndAuthor, KeyOf, User } from "@ns-world-lab/types"
import { _t, createIdeaWithAuthor, createUser, keysOf } from "@ns-world-lab/logic"
import {
    _cb, _effect, _memo, _use_state
    , MainPage
    , SurfaceNode
    , WorkspaceView
} from "@ns-world-lab/web"
import { Nav, NavProps } from "rsuite"
import { IdeasBoard_Page } from "../../pages";
import { KnownPayload_Type, KnownPayloadsBoard_Page } from "../../pages/board-surface/payloads-board";
import { UserAdmin_Page } from "../../pages/user-admin";

const PAGES_MAP = {
    IdeasBoard: IdeasBoard_Page
    , KnownPayloadsBoard: KnownPayloadsBoard_Page
    , UserAdmin: UserAdmin_Page
}

    , PAGE_KEYS = keysOf(PAGES_MAP).sort((a, b) => a.localeCompare(b))

type PAGES_MAP = typeof PAGES_MAP
type PageKey = KeyOf<PAGES_MAP>
type PageProps = ComponentProps<PAGES_MAP[PageKey]>
type PageEventsMap = ExtractEventHandlersMap<PageProps>


type PageStates = {
    IdeasBoard: {
        surfaceNodes: SurfaceNode<IdeaWithKindAndAuthor>[]
    }
    KnownPayloadsBoard: {
        surfaceNodes: SurfaceNode<KnownPayload_Type>[]
    }
    UserAdmin: {
        loadedUsers: User[]
    }
}

// ========================================

const {
    APP_NAME
    , IS_IN_DEBUG_MODE
    , MAX_NUMBER_OF_PAYLOADS
    , MAX_PAYLOAD_FACTORY_ADD
} = ImportMetaEnv



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
            selectedPageKey: initialPageKey
            , currentUser: createUser() as User

            // , surfaceNodes: [] as SurfaceNode<any>[]

            // , loadedUsers: [] as User[]

            , infoIsShown: false

        })


        , _refs = useRef({

            IdeasBoard_Props: {
                // createDataItemFn: createIdeaWithAuthor
                data: [createIdeaWithAuthor()]
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

            , KnownPayloadsBoard_Props: {
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

            , UserAdmin_Props: {
                onChange: ({ users: loadedUsers }) => {
                    _set_pagesStates(p => ({
                        ...p
                        , UserAdmin: {
                            loadedUsers
                        }
                    }))
                }
            }

        } as {
                [k in PageKey as `${k}_Props`]: ComponentProps<PAGES_MAP[k]>
            })

        ,
        /**
         * [_cb]
         */
        _handle_NavSelect: NonNullable<NavProps<PageKey>["onSelect"]> = _cb((
            selectedPageKey
            , ev
        ) => _set_state(p => ({
            ...p
            , selectedPageKey
        }))
        )
    // , _handle_onChange: ExtractEventHandlersMap<PAGES_MAP[Key]>

    _effect([state.selectedPageKey], () => {
        document.title = [state.selectedPageKey, APP_NAME].join(" - ")
    })

    return (
        <MainPage
            id={id}
            data-main-app
            headerTitle={state.selectedPageKey}
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
                        activeKey={state.selectedPageKey}
                        onSelect={_handle_NavSelect}
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
                isActive={state.selectedPageKey === "IdeasBoard"}
            >
                <IdeasBoard_Page
                    {..._refs.current.IdeasBoard_Props}
                />
            </WorkspaceView>
            <WorkspaceView
                isActive={state.selectedPageKey === "UserAdmin"}
            >
                <UserAdmin_Page
                    {..._refs.current.UserAdmin_Props}
                />
            </WorkspaceView>
            <WorkspaceView
                isActive={state.selectedPageKey === "KnownPayloadsBoard"}
            >
                <KnownPayloadsBoard_Page
                    {..._refs.current.KnownPayloadsBoard_Props}
                />
            </WorkspaceView>
        </MainPage>
    )

}


console.log(_t(MainApp.name), ImportMetaEnv)