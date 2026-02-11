import { HasChildren, KeyOf } from "@ns-world-lab/types"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { keysOf } from "@ns-world-lab/logic"
import { _cn } from "../../../../utils"

const BUTTON_TW_APPEARANCES_MAP = {
    //  primary: "rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-500 hover:shadow-md transition"
    // primary: "rounded-lg bg-primary px-4 py-2 text-white shadow-sm hover:bg-[#4DA3FF] hover:shadow-md transition"
    // primary: "rounded-lg bg-[#1E90FF] px-4 py-2 text-white shadow-sm hover:bg-[#4DA3FF] hover:shadow-md transition"
    primary: "rounded-lg bg-[#00b7f3] px-4 py-2 text-white shadow-sm hover:bg-[#4DA3FF] hover:shadow-md transition"
    , secondary: "rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
} as const

export const BUTTON_TW_APPEARANCES
    = keysOf(BUTTON_TW_APPEARANCES_MAP)

// ========================================
export type ButtonTwAppearance = KeyOf<typeof BUTTON_TW_APPEARANCES_MAP>
// ========================================
export type ButtonTwProps =
    & Partial<
        & {
            appearance: ButtonTwAppearance
        }
        // & PickHtmlAttributes<"children">
        & ButtonHTMLAttributes<HTMLButtonElement>
    >

// ========================================
export const ButtonTw = ({
    appearance = "secondary"
    , ...rest
}: ButtonTwProps

) => {

    return (
        <button
            {...rest}
            className={_cn(
                BUTTON_TW_APPEARANCES_MAP[appearance]
                , rest.className
            )}
        />
    )

}