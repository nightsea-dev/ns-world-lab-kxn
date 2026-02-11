import { EventHandlersFromMap, HasData, HasId, KeyOf } from "@ns-world-lab-kxn/types"
import { ReactNode } from "react"
import { HasRenderer } from "../../../types"
import { Box, BoxProps, NoData } from "../../_1_primitive"
import { ButtonRS, CloseButton } from "../controls"

// ======================================== props
type BaseListNSProps<
    TData extends HasId
> =
    & HasData<TData[]>
    & Partial<
        {
            headerLabel: ReactNode
        }
        & EventHandlersFromMap<{
            remove: HasData<TData>
            clear: {}
        }>
    >
    & HasRenderer<
        & HasData<TData>
        & {
            idx: number
        }
    >


export type ListNSProps<
    TData extends HasId
> =
    & BaseListNSProps<TData>
    & Omit<
        Pick<
            BoxProps,
            | "className"
            | "childrenContainerProps"
            | "bordered"
            | "header"
        >
        , KeyOf<BaseListNSProps<TData>>
    >

// ======================================== component
export const ListNS = <
    TData extends HasId
>({
    data: data
    , renderer: R
    , headerLabel
    , onClear
    , onRemove
    , ...rest
}: ListNSProps<TData>
) => {
    return (
        <Box
            {...rest}
            data-list-ns
            childrenContainerProps={{
                //className: "flex justify-between"
            }}
            header={
                <>
                    <div>
                        {headerLabel ?? `Items [${data.length}]`}
                    </div>
                    <ButtonRS
                        className={!data.length ? "hidden" : undefined}
                        disabled={!data.length}
                        onClick={onClear}
                    >Clear</ButtonRS>
                </>
            }
        >
            {!data.length
                ? <NoData />
                : data.map((item, idx) => (
                    <div
                        data-list-ns-item
                        className={`
                            w-full
                            flex items-start justify-between
                            gap-2
                            border
                            border-gray-200
                            rounded-md
                            px-2
                            py-1
                            my-1
                            `}
                    >
                        <div className="flex-1 min-w-0">
                            <R
                                key={item.id}
                                data={item}
                                idx={idx}
                            />
                        </div>
                        <CloseButton
                            onClick={() => onRemove?.({ data: item })}
                        />
                    </div>))}
        </Box>
    )

}