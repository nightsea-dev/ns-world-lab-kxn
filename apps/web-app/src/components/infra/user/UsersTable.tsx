import { ReactNode, useEffect, useId, useState } from 'react'
import { EventHandlersFromMap, HasData, KeyOf, PartialEventHandlersFromMap, User } from "@ns-lab-knx/types"
import {
    _cn, _effect, _memo, _use_state, CommonTableProps, NoData, ObjectView, PickHtmlAttributes
    , ScrollableHtmlTable
    , TableRS
    , useElementHeight
} from "@ns-lab-knx/web"
import { _capitalise, entriesOf, keysOf } from "@ns-lab-knx/logic"
import { Toggle } from 'rsuite'

const TABLE_RENDERERS = {
    ScrollableHtmlTable
    , TableRS
}
    , TABLE_RENDERER_KEYS = keysOf(TABLE_RENDERERS)

type TableRendererKey = KeyOf<typeof TABLE_RENDERERS>

const COLUMN_INFOS = {
    name: {
        label: "Name"
        , order: 0
    }
    , email: {
        label: "Email"
        , order: 1
    }
    , job: {
        label: "Job Title"
        , order: 2
    }
} as {
        [k in KeyOf<User>]: {
            label: string
            order: number
            // k: k
        }
    }

    , VALUE_KEYS = entriesOf(COLUMN_INFOS)
        .sort(([_, o]) => o.order)
        .map(([k]) => k)


// ======================================== events
export type UsersTableEventsMap = {
    select: {
        selectedUser: User
    }
}

// ======================================== props
export type UsersTableProps<
    K extends KeyOf<User> = KeyOf<User>
> =
    Partial<
        & HasData<User[]>
        & PickHtmlAttributes<"className">
        & EventHandlersFromMap<UsersTableEventsMap>
        & {
            keys?: K[]
            showIndex?: boolean
            // tableRendererKey?: TableRendererKey
        }
    >

// ======================================== component
/**
 * * a generic [data-table] can be done later
 * or just use an of-the-self one
 */
export const UsersTable = ({
    data
    , keys//: keys_IN = VALUE_KEYS
    , showIndex
    // , tableRendererKey: tableRendererKey_IN = "ScrollableHtmlTable"
    , onSelect
    , ...rest
}: UsersTableProps
) => {

    const id = useId()

        , [state, _set_state] = _use_state({
            users: [] as User[]
            , selectedUser: undefined as undefined | User
            , tableRendererKey: "ScrollableHtmlTable" as TableRendererKey //tableRendererKey_IN
        })

        , { ref, height } = useElementHeight()

        , _isSelected = (u?: User) => u?.uuid === state.selectedUser?.uuid

        , _handleUserRowClick: CommonTableProps<User>["onRowClick"] = ({
            dataItem: selectedUser
        }) => {
            if (_isSelected(selectedUser)) {
                selectedUser = undefined as any
            }
            _set_state({ selectedUser })
            onSelect?.({ selectedUser })
        }

        , common_props = {
            data: state.users
            , keys: ["name", "email", "job"]
            , labels: {
                job: "Job Title"
            }
            , isSelectedFn: ({ rowData }) => state.selectedUser?.uuid === rowData?.uuid
            , onRowClick: _handleUserRowClick
        } as CommonTableProps<User>


    _effect([data], () => {
        _set_state({
            users: data ?? []
        })
    })


    return (
        <div
            {...rest}
            id={id}
            ref={ref}
            data-users-table
            className={_cn(
                `
                flex-1 min-h-0 cursor-default 
                overflow-hidden
                `
                // , `border-4 border-purple-500`
                , rest.className
            )}
        >
            {(() => {
                switch (state.tableRendererKey) {
                    case "ScrollableHtmlTable": {
                        return (
                            !state.users.length
                                ? <NoData />
                                : <ScrollableHtmlTable
                                    {...common_props}
                                    height={height - 10}
                                />

                        )
                    }
                    case "TableRS": {
                        return (
                            <TableRS
                                {...common_props}
                                height={height - 10}
                            />
                        )
                    }
                }
            })()}

        </div>)


}

