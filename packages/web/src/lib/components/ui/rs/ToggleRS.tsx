import { ReactNode } from "react"
import { Toggle, ToggleProps } from "rsuite"
import { _cn, OmitHtmlAttributes, OmitHtmlAttributesFrom, PickHtmlAttributes } from "../../../utils"
import { EventHandlersFromMap, HasEventHandler, HasName, HasPartialEventHandler, HasPartialName, KeyOf, PartialEventHandlersFromMap, XOR } from "@ns-world-lab-knx/types"

// ======================================== events
export type ToggleRSEventsMap = {
    change: {
        value: boolean
    }
}
// ======================================== props
type BaseToggleRSProps =
    & {
        inline: boolean
    }
    & XOR<
        {
            label: ReactNode
        }
        , {
            children: ReactNode
        }>
    & EventHandlersFromMap<ToggleRSEventsMap>


export type ToggleRSProps =
    & Partial<
        & BaseToggleRSProps
        & Omit<ToggleProps, KeyOf<BaseToggleRSProps>>
    >

// ======================================== component
export const ToggleRS = ({
    size = "xs"
    , label
    , children = label
    , checked
    , inline
    , className
    , onChange
    , ...rest
}: ToggleRSProps
) => {

    return (
        <div
            data-toggle-rs
            className={_cn(
                `
                flex items-center 
                gap-1 
                whitespace-nowrap 
                text-[12px]
                border
                border-gray-200
                rounded-lg
                py-1.5
                px-2.5
                bg-white
                ${inline ? "inline" : ""}
                    `
                , className
            )}
        >
            <Toggle
                {...rest}
                checked={checked}
                size={size}
                onChange={
                    value => onChange?.({ value })
                }
            >
                <div
                    className="text-[12px] pt-1"
                >
                    {children}
                </div>
            </Toggle>
        </div>
    )
}


// ======================================== ShowInfoToggle/props
type BaseShowInfoToggleProps =
    & XOR<
        HasName
        , Pick<ToggleRSProps, "label" | "children">
    >
    & HasEventHandler<"change", { showInfo: boolean }>

export type ShowInfoToggleProps =
    & Partial<
        & BaseShowInfoToggleProps
        & Omit<ToggleRSProps, KeyOf<BaseShowInfoToggleProps>>
    >

// ======================================== ShowInfoToggle/component
export const ShowInfoToggle = ({
    name = ""
    , label
    , children = label
    , inline = true
    , onChange
    , ...rest
}: ShowInfoToggleProps
) => {
    return (
        <ToggleRS
            {...rest}
            data-show-info
            inline={inline}
            onChange={
                ({ value: showInfo }) => onChange?.({ showInfo })
            }
        >
            {children ?? `Show ${name} Info`}
        </ToggleRS>
    )
}