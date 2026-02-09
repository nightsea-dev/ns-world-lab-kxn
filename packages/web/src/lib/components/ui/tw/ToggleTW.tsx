import { ToggleProps } from "rsuite"
import { KeyOf } from "@ns-world-lab-knx/types"
import { _cn, PickHtmlAttributes } from "../../../utils"
import { ReactNode } from "react"

// ======================================== CONSTS
const SIZE_MAP = {
    xs: {
        track: "h-5 w-20",
        knob: "h-3.5 w-3.5",
        padding: "left-0.5 top-0.5",
        travel: "translate-x-14",
        text: "text-[10px]"
    },
    sm: {
        track: "h-6 w-24",
        knob: "h-4 w-4",
        padding: "left-1 top-1",
        travel: "translate-x-16",
        text: "text-xs"
    },
    md: {
        track: "h-8 w-32",
        knob: "h-6 w-6",
        padding: "left-1 top-1",
        travel: "translate-x-24",
        text: "text-xs"
    },
    lg: {
        track: "h-10 w-40",
        knob: "h-8 w-8",
        padding: "left-1 top-1",
        travel: "translate-x-28",
        text: "text-sm"
    }
} as const

// ======================================== types
export type ToggleTWSize = KeyOf<typeof SIZE_MAP>

// ======================================== props
export type ToggleTWProps =
    & {
        isChecked: boolean
        isDisabled?: boolean
        checkedChildren?: ReactNode
        unCheckedChildren?: ReactNode
        size?: ToggleTWSize
        onChange?: (next: boolean) => void
    }
    & PickHtmlAttributes<"className">

// ======================================== component
export const ToggleTW = ({
    isChecked
    , isDisabled
    , onChange
    , checkedChildren
    , unCheckedChildren
    , className
    , size = "md"
}: ToggleTWProps) => {
    const s = SIZE_MAP[size]
    const label = isChecked ? checkedChildren : unCheckedChildren

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            aria-disabled={isDisabled || undefined}
            tabIndex={isDisabled ? -1 : 0}
            onClick={() => {
                if (isDisabled) {
                    return
                }
                onChange?.(!isChecked)
            }}
            className={_cn(
                "relative inline-flex items-center rounded-full select-none",
                "transition-colors duration-200",
                isDisabled ? "cursor-default" : "cursor-pointer",
                isChecked ? "bg-blue-500" : "bg-gray-300",
                s.track,
                className
            )}
        >
            {/* single label (RSuite-style) */}
            <span
                className={_cn(
                    "absolute inset-0 flex items-center font-medium text-white",
                    s.text,
                    isChecked ? "justify-start pl-3" : "justify-end pr-3"
                )}
            >
                {label}
            </span>

            {/* knob */}
            <span
                className={_cn(
                    "absolute rounded-full bg-white shadow",
                    "transition-transform duration-200",
                    s.knob,
                    s.padding,
                    isChecked ? s.travel : "translate-x-0"
                )}
            />
        </button>
    )
}
