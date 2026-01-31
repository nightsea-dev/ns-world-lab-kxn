import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react"
import { _cn } from "../../utils"
import { EventHandlersFromMap, XOR } from "@ns-lab-klx/types"
import { entriesOf } from "@ns-lab-klx/logic"
import { Button, ButtonGroup, ButtonProps, Input, InputProps, StatLabel, Toggle } from "rsuite"
import { ToggleRS } from "../ui"


// ======================================== events
export type BoardSurfaceControlPanelEvent =
    & {
        numberOfItems: number
        showInfo: boolean
    }

export type BoardSurfaceControlPanelEventsMap = {
    change:
    & BoardSurfaceControlPanelEvent

    , enterKey:
    & BoardSurfaceControlPanelEvent
}

// ======================================== props
export type BoardSurfaceControlPanelProps =
    & {
        buttonsMap: {
            [k: string]: ButtonProps["onClick"] | ButtonProps
        }
        numberOfItems?: number
        showInfo?: boolean
    }
    & Partial<
        & EventHandlersFromMap<BoardSurfaceControlPanelEventsMap>
    >

// ======================================== component
export const BoardSurfaceControlPanel = ({
    buttonsMap
    , numberOfItems
    , showInfo = true
    , onChange
    , onEnterKey
}: BoardSurfaceControlPanelProps
) => {
    numberOfItems = Math.max(1, numberOfItems || 1)
    return (
        <div
            className={_cn(`
                absolute bottom-2 left-2
                flex flex-row items-center gap-2
                z-20
                `
            )}
        >
            <ToggleRS
                checked={showInfo}
                size="xs"
                onChange={({ value: showInfo }) => onChange?.({
                    numberOfItems
                    , showInfo
                })}
            >
                Show Info
            </ToggleRS>

            <Input
                data-number-of-items-input
                type="number"
                className="text-center"
                size="sm"
                min={1}
                max={10}
                value={numberOfItems}
                width={50}
                onChange={value => onChange?.({
                    numberOfItems: Number(value)
                    , showInfo
                })}
                onKeyDown={ev => {
                    if (
                        onEnterKey
                        &&
                        ev.key === "Enter"
                    ) {

                        debugger
                        onEnterKey({
                            numberOfItems: Number(ev.currentTarget.value)
                            , showInfo
                        })
                    }
                }}
            />
            <ButtonGroup
            >
                {entriesOf(buttonsMap).map(([k, v], i) => {

                    const p = (typeof (v) === "function"
                        ? {
                            onClick: v
                        }
                        : v
                    ) as ButtonProps

                    return (
                        <Button
                            key={k}
                            children={k}
                            {...p}
                        />
                    )

                })}
            </ButtonGroup>

        </div>
    )
}
