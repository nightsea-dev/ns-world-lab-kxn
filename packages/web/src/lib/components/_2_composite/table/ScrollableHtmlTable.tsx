import { ReactNode } from "react"
import { EventHandlersFromMap, HasData, KeyOf } from "@ns-world-lab-kxn/types"
import { _capitalise, keysOf } from "@ns-world-lab-kxn/logic"
import { CommonTableProps, DEFAULT_CommonTable, useTableKeys } from "./_types"
import { _cn } from "../../../utils"
import { NoData } from "../../_1_primitive"





// ======================================== props
export type ScrollableHtmlTableProps<
    T extends object
> =
    & Partial<
        & HasData<T[]>
        & CommonTableProps<T>
        & {
            height: number
        }
    >



// ======================================== component
export const ScrollableHtmlTable = <
    T extends object
>({
    data: data
    , showIndex
    , idxColWidth = DEFAULT_CommonTable.idxColWidth
    , keys: keys_IN
    , labels
    , isSelectedFn
    , height
    , onRowClick
    , ...rest
}: ScrollableHtmlTableProps<T>
) => {

    const { keys } = useTableKeys({
        data
        , keys: keys_IN
    })

        , _handleRowClick: ScrollableHtmlTableProps<T>["onRowClick"] = ({
            dataItem
            , ev
        }) => {

            // ; (rest.data ?? []).forEach(dataItem => {

            // })

            const el = ev.currentTarget as HTMLElement
                , isSelected = isSelectedFn?.({ rowData: dataItem })

            el.setAttribute("data-is-selected", String(isSelected))
            // _handleUserRowClick({
            //     selectedUser: rowData
            // })


            onRowClick?.({
                dataItem
                , ev
            })

        }
    return (
        !data
            ? <NoData />
            : <table
                {...rest}
                className='
                    cursor-default
                    ---border-4
                    ---border-blue-900
                    border-collapse
                    w-full 
                    h-full
                    
                    flex flex-col
                    '
            // style={{
            //     height
            // }}
            >
                <thead
                    className="flex-none"
                >
                    <tr
                        className="table w-full table-fixed"
                    >
                        {showIndex && (
                            <th
                                className={`
                                        bg-gray-100
                                        text-center 
                                        w-[${idxColWidth}px]
                                `}
                            >#</th>
                        )}
                        {keys?.map((k, i) => (
                            <th
                                key={["key", k].join("|")}
                                // style={TableRow_COMMON_STYLES}
                                className={`
                                        bg-gray-100
                                `}
                            >{
                                    labels?.[k] ?? _capitalise(k)
                                }</th>
                        ))}
                    </tr>
                </thead>
                <tbody
                    className="block flex-1 overflow-auto"
                >
                    {data.map((dataItem, rowIdx) => {

                        const isSelected = isSelectedFn?.({ rowData: dataItem })

                        return (
                            <tr
                                key={rowIdx}
                                data-table-row
                                data-is-selected={isSelectedFn?.({ rowData: dataItem })}
                                className={_cn(
                                    "table w-full table-fixed"
                                    , "transition-all duration-[.1s]"
                                    , "p-2"
                                    // , "hover:bg-gray-100"
                                    , isSelected ? "bg-blue-400  text-white" : "hover:bg-gray-100"
                                )}
                                onClick={(ev) => _handleRowClick({
                                    dataItem
                                    , ev
                                })}
                            >
                                {showIndex && (
                                    <td
                                        className={`
                                            text-center 
                                            w-[${idxColWidth}px]
                                            `}
                                    >
                                        {String(rowIdx + 1)}
                                    </td>
                                )}
                                {
                                    keys?.map((k, cellIdx) => (
                                        <td
                                            key={cellIdx}

                                        >
                                            <div
                                                className={_cn(
                                                    "py-1 border-b-[1px] border-gray-100"
                                                )}
                                            >
                                                {String(dataItem[k])}
                                            </div>
                                        </td>
                                    ))
                                }
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
    )

}