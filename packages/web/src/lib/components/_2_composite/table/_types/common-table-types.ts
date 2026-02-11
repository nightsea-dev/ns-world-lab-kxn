import { MouseEvent, ReactNode } from "react"
import { EventHandlersFromMap, HasData, KeyOf } from "@ns-world-lab/types"
import { _capitalise, keysOf } from "@ns-world-lab/logic"
import { _memo } from "../../../../utils"

// ======================================== DEFAULTS
export const DEFAULT_CommonTable = {
    idxColWidth: 50
}

// ======================================== events
export type CommonTableEventsMap<
    T extends object
> = {
    rowClick: {
        dataItem: T
        ev: MouseEvent<Element>
    }
}
// ======================================== props
export type CommonTableProps<
    T extends object
> =
    & Partial<
        & HasData<T[]>
        & {
            showIndex: boolean
            idxColWidth: number
            keys: KeyOf<T>[]
            labels: {
                [k in KeyOf<T>]: ReactNode
            }
            isSelectedFn: (
                info: {
                    rowData: T
                    , rowIndex?: number
                }) => boolean
        }
        & EventHandlersFromMap<CommonTableEventsMap<T>>
    >

// ======================================== hooks
export const useTableKeys = <
    T extends object
>({
    data
    , keys: keys_IN
}: Pick<CommonTableProps<T>, "data" | "keys">) => {
    return _memo([data, keys_IN], () => {

        if (!data?.length) {
            return {}
        }
        const keys = keys_IN ?? []
        return {
            keys: keys.length
                ? keys
                :
                [...new Set(
                    (data ?? []).map(o => keysOf(o)).flat(1)
                )]
        }

    })
}


