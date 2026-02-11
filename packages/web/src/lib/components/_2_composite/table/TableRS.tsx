import { ReactNode } from "react"
import { Table, TableProps } from "rsuite"
import { HasData, KeyOf } from "@ns-world-lab/types"
import { _cn, _memo, _use_state } from "../../../utils"
import { _capitalise, keysOf } from "@ns-world-lab/logic"
import { CommonTableProps, DEFAULT_CommonTable, useTableKeys } from "./_types"

import "./TableRS.css"

const {
    Column
    , Cell
    , ColumnGroup
    , HeaderCell
} = Table

// ======================================== props
export type TableRSProps<
    T extends object
> =
    & Omit<
        TableProps<T>
        , KeyOf<CommonTableProps<T>>
    >
    & Partial<
        // & {
        //     isSelectedFn: (
        //         info: {
        //             rowData: T
        //             , rowIndex?: number
        //         }) => boolean
        // }
        & CommonTableProps<T>
    >



// ======================================== component
export const TableRS = <
    T extends object
>({
    isSelectedFn
    , showIndex
    , idxColWidth = DEFAULT_CommonTable.idxColWidth
    , labels
    , onRowClick
    // , keys: keys_IN
    , ...rest
    // keys: keys_IN
    // , height
    // , bordered = true
    // , cellBordered = true
    // , rowClassName
    // , showIndex
    // , idxColWidth
    // , labels
    // , isSelectedFn
    // , ...rest
}: TableRSProps<T>
) => {
    const { keys } = useTableKeys({
        data: rest.data
        , keys: rest.keys
    })

        , _handleRowClick: TableRSProps<T>["onRowClick"] = ({
            dataItem
            , ev
        }) => {

            // debugger
            const el = ev.currentTarget as HTMLElement
                , isSelected = isSelectedFn?.({ rowData: dataItem })

            el.setAttribute("data-is-selected", String(!isSelected))
            // _handleUserRowClick({
            //     selectedUser: rowData
            // })

            // debugger

            onRowClick?.({
                dataItem
                , ev
            })
        }

    return (
        <Table
            {...rest}
            data-table-rs
            height={typeof (rest.height) === "number" ? rest.height - 10 : undefined}
            bordered={rest.bordered}
            cellBordered={rest.cellBordered}
            className={_cn(
                "data-table-rs"
                // , `
                //  ![&_[data-is-selected=true]_role=gridcell]:bg-blue-500
                // [&_[data-is-selected=true]]:text-white
                // `
            )}
            // rowClassName={
            //     rest.rowClassName
            //         ? rest.rowClassName
            //         : (rowData: T, rowIndex = 0) => {
            //             return isSelectedFn?.({
            //                 rowData: rowData as T
            //                 , rowIndex
            //             })
            //                 ? "!bg-blue-100"
            //                 : ""
            //         }}

            onRowClick={(dataItem, ev) => _handleRowClick({
                dataItem
                , ev
            })}
        >
            {[
                (showIndex ? (
                    <Column
                        // flexGrow={1}
                        // minWidth={180}
                        width={idxColWidth}
                        fixed
                    >
                        <HeaderCell>
                            #
                        </HeaderCell>
                        <Cell>
                            {(_, rowIndex = 0) => rowIndex + 1}
                        </Cell>
                    </Column>
                ) : undefined)
                , ...(keys ?? []).map((k, i) => (
                    <Column
                        key={k}
                        flexGrow={1}
                        minWidth={180}
                    >
                        <HeaderCell>
                            {labels?.[k] ?? _capitalise(k)}
                        </HeaderCell>
                        <Cell
                            dataKey={k}
                        />
                    </Column>
                ))
            ].filter(Boolean)}
        </Table>
    )
}