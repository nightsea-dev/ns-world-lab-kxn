import { EventHandlersFromMap, HasData, KeyOf } from "@ns-world-lab/types"
import { CSSProperties } from "react"
import { _cn } from "../../../utils"

// ======================================== events
export const TableRow_COMMON_STYLES = {
    border: '1px solid #ccc',
    padding: '8px',
} as CSSProperties

// ======================================== events
type HasIdx = {
    idx: number
}
export type TableRowEventsMap<
    TData extends object
> = {
    click:
    & HasData<TData>
    & HasIdx
}
// ======================================== props
export type TableRowProps<
    TData extends object
> =
    & HasData<TData>
    & HasIdx
    & {
        valueKeys: KeyOf<TData>[]
    }
    & Partial<
        & {
            isSelected: boolean
            showIdx: boolean
            // valueCellRenderer: (props: HasData<TData>) => ReactNode
        }
        & EventHandlersFromMap<TableRowEventsMap<TData>>
    >

// ======================================== component
export const TableRow = <
    TData extends object
>({
    idx
    , data: data//: user
    // , data: {
    //     email
    //     , job
    //     , name
    //     , uuid
    // }
    , isSelected
    , showIdx
    , valueKeys
    , onClick
    // , valueCellRenderer = ObjectView<TData>
}: TableRowProps<TData>
) => {

    return (
        <tr
            data-table-row
            onClick={() => onClick?.({ idx, data: data })}
            className={_cn(
                (isSelected
                    ? `
                    bg-[dodgerblue]
                    text-white
                    `
                    : `
                    bg-[white]
                    hover:bg-gray-100
                    `)
            )
            }
        // style={{
        //     backgroundColor: isSelected ? 'lightgray' : 'white'
        // }}
        >
            {showIdx && (
                <td
                    key={["idx", idx].join("|")}
                    style={TableRow_COMMON_STYLES}
                // className="hover:bg-gray-100"
                >{String(idx)}</td>
            )}
            {
                //     [
                //     idx
                //     , name
                //     , email
                //     , job
                // ]
                valueKeys.map((k, i) => (
                    <td
                        key={["value", k].join("|")}
                        style={TableRow_COMMON_STYLES}
                    // className="hover:bg-gray-100"
                    >
                        {String(data[k])}
                    </td>
                ))
            }
        </tr >
    )
}