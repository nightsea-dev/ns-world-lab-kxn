import {
    _cn,
    _effect, _use_state, ButtonGroupRS, ClockWithShowToggle,
    UsersTable,
    UsersTable_Props
} from '@ns-world-lab/web'
import { API } from "@ns-world-lab/logic"
import {
    EventHandlersFromMap
    , HasUsers, User
} from "@ns-world-lab/types"
import { useId, useRef } from 'react'
import { Input, Loader } from 'rsuite'
import { AppPage } from '../_types'

// ======================================== types
type M_Status = "IDLE" | "LOADING USERS"

// ======================================== events
export type UserAdmin_Page_EventsMap = {
    change:
    & HasUsers
    & {
        selectedUser?: User
        trigger: "api" | "select" | "reset"
    }
}
// ======================================== props
export type UserAdmin_Page_Props =
    & Partial<
        & {
            loadUsersOnFirstRender: boolean
        }
        & Pick<UsersTable_Props, "data" | "onSelect">
        & EventHandlersFromMap<UserAdmin_Page_EventsMap>
    >


// ======================================== component
export const UserAdmin_Page: AppPage.FC<UserAdmin_Page_Props> = ({
    loadUsersOnFirstRender = true
    , data: data_IN
    , onChange
    , onSelect
}) => {

    const id = useId()

        , [state, _set_state] = _use_state({
            users: [] as User[]
            , status: "IDLE" as M_Status
            , isFirstRender: true
            , numberOfUsersToLoad: 50
            , selectedUser: undefined as User | undefined
        })

        , _emit_Change = (
            trigger: UserAdmin_Page_EventsMap["change"]["trigger"]
        ) => {

            ; !onChange || _set_state(p => {
                const { users, selectedUser } = p
                setTimeout(() => onChange({
                    trigger
                    , users
                    , selectedUser
                }))
                return p
            })
        }

        , _reset = () => {
            _set_state({
                users: []
                , selectedUser: undefined
            })
            _emit_Change("reset")
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
                    _set_state(p => {
                        return {
                            ...p
                            , users
                            , status: "IDLE"
                        }
                    })
                    _emit_Change("api")
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

        , _handle_UsersTable_Select: UsersTable_Props["onSelect"] = ({
            selectedUser
        }) => {
            _set_state({ selectedUser })
            onSelect?.({ selectedUser })

            _emit_Change("select")
        }

        , _refs = useRef({} as {
            prev_data_IN?: User[]
        })

    _effect([data_IN], () => {
        if (!data_IN
            || data_IN === state.users
            || data_IN === _refs.current.prev_data_IN
        ) {
            return
        }
        _set_state({
            users: _refs.current.prev_data_IN = data_IN
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
        _set_state({
            isFirstRender: false
        })
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
                />
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
                onSelect={_handle_UsersTable_Select}
            />
        </div>
    )
}
