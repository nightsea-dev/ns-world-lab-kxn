import {
    _cn,
    _effect, _use_state, ButtonGroupRS, ClockWithShowToggle, MainPage, TailwindSanity_02, useElementHeight

} from '@ns-world-lab/web'
import { API, createUser } from "@ns-world-lab/logic"
import { UsersTable } from '../../components'
import {
    EventHandlersFromMap, HasData, HasUsers, User

} from "@ns-world-lab/types"
import { useId, useRef } from 'react'
import { Input, Loader } from 'rsuite'

// const APP_NAME = '@ns-world-lab/admin'
// ======================================== types
type M_Status = "IDLE" | "LOADING USERS"

// ======================================== events
export type UserAdmin_Page_EventsMap = {
    change: HasUsers
}
// ======================================== props
export type UserAdmin_Page_Props =
    & Partial<
        & {
            loadUsersOnFirstRender: boolean
        }
        & EventHandlersFromMap<UserAdmin_Page_EventsMap>
    >


// ======================================== component
export const UserAdmin_Page = ({
    loadUsersOnFirstRender = true
    , onChange
}: UserAdmin_Page_Props
) => {

    const id = useId()

        , [state, _set_state] = _use_state({
            users: [] as User[]
            , status: "IDLE" as M_Status
            , isFirstRender: true
            , numberOfUsersToLoad: 50
            // , selectedUser: undefined as undefined | User
        })

        , _reset = () => {
            _set_state({
                users: []
            })
        }

        , _loadUsers = async () => {
            if (state.status !== "IDLE") {
                return
            }
            _set_state({
                users: []
                , status: "LOADING USERS"
            })
            API.fetchUsers(state.numberOfUsersToLoad)
                .then(users => {
                    _set_state(p => ({
                        ...p
                        , users
                        , status: "IDLE"
                    }))
                    // .map((user) => ({
                    //     // why did they use  [user:any] ???
                    //     // data.map((user: any) => ({
                    //     /**
                    //      * * why the [uuid]
                    //      */
                    //     uuid: user.id,
                    //     name: user.name,
                    //     email: user.email,
                    //     job: user.job,
                    // }))


                })
                .catch(console.error)
                .finally(() => {
                    _set_state(p => ({
                        ...p
                        , status: "IDLE"
                    }))
                })
        }

    _effect([state.users, state.isFirstRender], () => {
        if (state.isFirstRender) {
            return
        }
        onChange?.({
            users: state.users
        })
    })
    _effect([loadUsersOnFirstRender, state.isFirstRender], () => {
        if (!state.isFirstRender
            || !loadUsersOnFirstRender
            || !!state.users.length
        ) {
            return
        }
        _loadUsers()
    })

    _effect([], () => {
        // document.title = APP_NAME
        _set_state({
            isFirstRender: false
        })
        // _loadUsers()
    })


    return (
        <div
            id={id}
            data-user-admin
            className={_cn(`
                    h-full min-h-0 flex flex-col 
                    ---p-2
                `
                // , "border border-gray-500"
                // , "border-[10px] border-amber-500"
            )}
        >
            {/* <TailwindSanity_02 /> */}
            <div
                data-control-panel
                className={`
                    shrink-0 flex flex-row items-center gap-4
                    `}
            >
                <Input
                    type="number"
                    disabled={state.status === "LOADING USERS"}
                    min={0}
                    value={state.numberOfUsersToLoad}
                    onChange={v => _set_state({
                        numberOfUsersToLoad: Number(v ?? 0)
                    })}
                    className='inline !w-[50px] text-right p-0'
                    size="xs"
                    onKeyUp={ev => {
                        if (ev.key === "Enter") {
                            _loadUsers()
                        }
                    }}
                />
                <ButtonGroupRS
                    className='my-1'
                    disabled={state.status === "LOADING USERS"}
                    buttons={{
                        "load Users": {
                            appearance: "primary"
                            , onClick: _loadUsers
                        }
                        , reset: {
                            disabled: !state.users.length
                            , onClick: _reset
                        }
                    }}
                >
                    {/* <Button
                        appearance='primary'
                        size='xs'
                        onClick={_loadUsers}
                    >load Users</Button>
                    <Button
                        size='xs'
                        onClick={_reset}
                        disabled={!state.users.length}
                    >reset</Button> */}
                </ButtonGroupRS>
                <ClockWithShowToggle
                    data-clock
                    show
                />
                {state.status === "IDLE" ? ""
                    : <div>
                        <Loader
                            className='inline mr-2'
                        /> {state.status}
                    </div>}
            </div>
            <UsersTable
                data-users-table
                data={state.users}
                showIndex
            />
        </div>
    )
}

{/* <div>
    <Header title={APP_NAME} />
    <MainComponent>
        <ClockWrapper />
        <UsersTable />
    </MainComponent>
    <Footer />
</div> */}