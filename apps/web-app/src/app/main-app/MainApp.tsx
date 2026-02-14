import { ImportMetaEnv, ObjectViewWithToggle, SurfaceNode_Ref } from "@ns-world-lab/web";
import { ComponentProps, useId, useRef } from "react"
import { ExtractEventHandlersMap, ExtractEventsMap, HasPayloads, IdeaWithKindAndAuthor, KeyOf, User } from "@ns-world-lab/types"
import { _t, createIdeaWithAuthor, createUser, keysOf } from "@ns-world-lab/logic"
import {
    _cb, _effect, _memo, _use_state
    , MainPage
    , SurfaceNode
    , WorkspaceView
} from "@ns-world-lab/web"
import { Nav, NavProps } from "rsuite"
import { IdeasBoard_Page, IdeasBoard_Page_EventMap, PAGE_KEYS, PAGE_LABELS } from "../../pages";
import { KnownPayload_Type, KnownPayloadsBoard_Page, KnownPayloadsBoard_Page_EventsMap, KnownPayloadsBoard_Page_Props } from "../../pages/board-surface/payloads-board";
import { UserAdmin_Page, UserAdmin_Page_EventsMap } from "../../pages/user-admin";
import { PageKey, PAGES_MAP } from "../../pages";



type PageStates = {
    IdeasBoard:
    Partial<
        & Pick<IdeasBoard_Page_EventMap["change"], "payloads" | "surfaceNodes">
    >

    KnownPayloadsBoard:
    Partial<
        & Pick<KnownPayloadsBoard_Page_EventsMap["change"], "payloads" | "surfaceNodes">
    >

    UserAdmin:
    Partial<
        Pick<UserAdmin_Page_EventsMap["change"], "selectedUser" | "users" | "trigger">
    >
}

// ========================================

const {
    APP_NAME
    , IS_IN_DEBUG_MODE
    , MAX_NUMBER_OF_PAYLOADS
    , MAX_PAYLOAD_FACTORY_ADD
    , INITIAL_PAGE_KEY: INITIAL_PAGE_KEY_IN
} = ImportMetaEnv as ImportMetaEnv & {
    INITIAL_PAGE_KEY: PageKey
}

    , INITIAL_PAGE_KEY = PAGE_KEYS.find(k => k === INITIAL_PAGE_KEY_IN) ?? "KnownPayloadsBoard"


// ========================================
export const MainApp: React.FC<{
    initialPageKey?: PageKey
}> = ({
    initialPageKey = INITIAL_PAGE_KEY//"KnownPayloadsBoard"
}) => {

        const id = useId()
            , [pagesStates, _set_pagesStates] = _use_state({
                IdeasBoard: {}
                , KnownPayloadsBoard: {}
                , UserAdmin: {}
            } as PageStates)

            , [state, _set_state] = _use_state({
                selectedPageKey: initialPageKey
                , currentUser: createUser() as User
                , infoIsShown: false
            })


            , _refs = useRef({

                IdeasBoard_Props: {
                    current: [createIdeaWithAuthor()]
                    , onChange: ({
                        eventKind
                        , payloads
                        , surfaceNodes
                    }) => _set_pagesStates(p => ({
                        ...p
                        , IdeasBoard: { surfaceNodes, payloads }
                    }))
                }

                , KnownPayloadsBoard_Props: {
                    onChange: ({
                        eventKind
                        , payloads
                        , surfaceNodes
                    }) => _set_pagesStates(p => ({
                        ...p
                        , KnownPayloadsBoard: { surfaceNodes, payloads }
                    }))
                }

                , UserAdmin_Props: {
                    onChange: ({ users, selectedUser, trigger }) => _set_pagesStates(p => ({
                        ...p
                        , UserAdmin: { users, selectedUser, trigger }
                    }))
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
            document.title = [PAGE_LABELS[state.selectedPageKey], APP_NAME].join(" - ")
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
                        className={`
                        flex 
                        items-center 
                        gap-2 
                        whitespace-nowrap
                        `}
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
                            appearance="tabs"
                            activeKey={state.selectedPageKey}
                            onSelect={_handle_NavSelect}
                        // justified={!state.infoIsShown}
                        //vertical
                        >
                            {_memo(() => PAGE_KEYS.map((k) => (
                                <Nav.Item
                                    key={k}
                                    eventKey={k}
                                >
                                    {PAGE_LABELS[k] ?? k}
                                </Nav.Item>
                            )))}
                        </Nav>
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