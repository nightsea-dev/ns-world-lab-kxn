import { SVGProps } from "react"
import { KeyOf } from "@ns-world-lab-kxn/types"
import { _cn } from "../../utils"

const PIN_ICONS = {
    Dock: (props: SVGProps<SVGSVGElement>) => (
        <svg
            {...props}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" y1="5" x2="12" y2="15" />
            <circle cx="12" cy="5" r="2" />
            <line x1="7" y1="15" x2="17" y2="15" />
        </svg>
    )

    , PushPin: (props: SVGProps<SVGSVGElement>) => (
        <svg
            {...props}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 3h6" />
            <path d="M10 3v5l-3 3v2h10v-2l-3-3V3" />
            <path d="M12 13v8" />
        </svg>
    ),
} as const

export type PinIconType = KeyOf<typeof PIN_ICONS>


export type PinIconProps =
    & {
        iconType?: PinIconType
    }
    & Omit<SVGProps<SVGSVGElement>, "viewBox">

export const PinIcon = ({
    iconType = "Dock",
    width = 18,
    height = width,
    className,
    ...rest
}: PinIconProps) => {
    const R = PIN_ICONS[iconType]

    return (
        <R
            {...rest}
            data-pin-icon
            width={width}
            height={height}
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={_cn("transition-transform duration-150", className)}
        />
    )
}
