import { ComponentProps, FunctionComponent, ReactElement, ReactNode, useId, useRef } from "react"
import { KeyOf, SuffixedString, User } from "@ns-world-lab-knx/types"
import { createIdeaWithAuthor, createUser, keysOf } from "@ns-world-lab-knx/logic"
import {
    _cb, _effect, _memo, _use_state
    , HasSurfaceNode, ObjectView
    , Page
    , ShowInfoToggle, SurfaceNode
    , ToggleRS
    , WorkspaceView
} from "@ns-world-lab-knx/web"
import { Nav } from "rsuite"
import { IdeasBoard, IdeasBoardProps, KnownPayloadsBoard, KnownPayloadsBoardProps, UserAdmin, UserAdminProps } from "../../features"

const FEATURES_MAP = {
    IdeasBoard
    , KnownPayloadsBoard
    , UserAdmin
}
    , FEATURE_KEYS = keysOf(FEATURES_MAP).sort((a, b) => a.localeCompare(b))

type FEATURES_MAP = typeof FEATURES_MAP
type FeatureKey = KeyOf<FEATURES_MAP>



// ========================================
const APP_NAME = "@ns-world-lab-knx/web-app"
// ========================================
export const MainApp = ({
    initialFeatureKey = "KnownPayloadsBoard"
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

        , _set_nodes = ({
            data
        }: Parameters<Pick<Required<KnownPayloadsBoardProps>, "onNodesAdded" | "onNodesRemoved">["onNodesAdded" | "onNodesRemoved"]>[0]
        ) => {
            _set_state({
                surfaceNodes: data.map(({
                    surfaceNode: node
                }) => node).filter(Boolean) as SurfaceNode<any>[]
            })
        }

        , _refs = useRef({

            "IdeasBoardProps": {
                createDataItemFn: createIdeaWithAuthor
                , data: [createIdeaWithAuthor()]
            } as IdeasBoardProps

            , "KnownPayloadsBoardProps": {
                onNodesAdded: _set_nodes
                , onNodesRemoved: _set_nodes
            } as KnownPayloadsBoardProps

            , "UserAdminProps": {
                onUsersChange: ({ users: loadedUsers }) => _set_state({ loadedUsers })
            } as UserAdminProps

        } as {
                [k in FeatureKey as  `${k}Props`]: ComponentProps<FEATURES_MAP[k]>
            })

        , _handleClick = _cb((
            selectedFeatureKey: FeatureKey
        ) => {
            _set_state(p => ({
                ...p
                , selectedFeatureKey
            }))
        })

    _effect([], () => {
        document.title = APP_NAME
    })

    return (
        <Page
            id={id}
            data-web
            // className="relative flex-1 min-h-0 overflow-hidden"
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
                    <ShowInfoToggle
                        checked={state.showInfo}
                        onChange={({ showInfo: showInfo }) => _set_state({ showInfo })}
                    />
                </div>
            )}
        >
            {/* <TailwindSanity_02 /> */}
            <WorkspaceView
                isActive={state.selectedFeatureKey === "IdeasBoard"}
            >
                <IdeasBoard
                    {..._refs.current.IdeasBoardProps}
                />
            </WorkspaceView>
            <WorkspaceView
                isActive={state.selectedFeatureKey === "UserAdmin"}
            >
                <UserAdmin
                    {..._refs.current.UserAdminProps}
                />
            </WorkspaceView>
            <WorkspaceView
                isActive={state.selectedFeatureKey === "KnownPayloadsBoard"}
            >
                <KnownPayloadsBoard
                    {..._refs.current.KnownPayloadsBoardProps}
                />
            </WorkspaceView>
        </Page>
    )

}