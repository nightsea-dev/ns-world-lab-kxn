import { CSSProperties, HTMLAttributes, ReactNode, RefCallback } from "react"
import {
    _cn
    , _memo, PickHtmlAttributes
} from "../../../utils"
import {
    HasChildren,
    HasData,
    XOR
} from "@ns-lab-knx/types"

export type HeaderNSProps =
    & XOR<
        HasData<ReactNode>
        , HasChildren<ReactNode>
    >
    & Partial<{
        bgColour: CSSProperties["color"]
        | "gray-100"
        | "gray-200"

        headerRef: RefCallback<HTMLElement | null>
    }>
    & PickHtmlAttributes


export const HeaderNS = ({
    data
    , children = data
    , bgColour// = "gray-200"
    , headerRef
    , ...rest
}: HeaderNSProps
) => (
    <div
        {...rest}
        ref={headerRef}
        className={_cn(`
            flex
            items-center
            justify-between
            py-1.5
            px-2
            text-[14px]
            font-normal
            `
            , _memo([bgColour], () => {
                if (!bgColour) {
                    return `bg-[dodgerblue] text-white`
                }
                if (bgColour === "gray-100") {
                    return "bg-gray-100"
                }
                if (bgColour === "gray-200") {
                    return "bg-gray-200"
                }
                return `bg-[${bgColour}]`
            })
            , rest.className
        )}
    >
        {children}
    </div>
)