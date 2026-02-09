import { _cn, PickHtmlAttributes } from "../../../utils"
import {
    PartialEventHandlersFromMap
    , PickRequired
} from "@ns-world-lab-knx/types"
import {
    Input,
    InputProps
} from "rsuite"
import {
    ButtonGroupRS
    , ButtonGroupRSProps
    , ShowInfoToggle
} from "../../ui"


// ======================================== events
export type BoardSurfaceControlPanelEvent =
    & {
        numberOfItems: number
        showInfo: boolean
    }

export type BoardSurfaceControlPanelEventsMap = {
    change:
    & BoardSurfaceControlPanelEvent

    , numberOfItemsEnterKey:
    & BoardSurfaceControlPanelEvent
}

// ======================================== props
export type BoardSurfaceControlPanelProps =
    & {
        numberOfItems?: number
        showInfo?: boolean
        buttonsAreDisabled?: boolean
    }
    & PickRequired<
        ButtonGroupRSProps
        , "buttons"
    >
    & PartialEventHandlersFromMap<BoardSurfaceControlPanelEventsMap>
    & PickHtmlAttributes<"className">


// ======================================== component
export const BoardSurfaceControlPanel = ({
    buttons: buttonsMap
    , numberOfItems
    , showInfo = true
    , buttonsAreDisabled
    , onChange
    , onNumberOfItemsEnterKey
    , ...rest
}: BoardSurfaceControlPanelProps
) => {
    numberOfItems = Math.max(1, numberOfItems || 1)
    console.log({ buttonsMap })
    const _handle_NumberOfItemsInputChange: InputProps["onChange"]
        = value => {
            onChange?.({
                numberOfItems: Number(value)
                , showInfo
            })
        }
        , _handle_NumberOfItemsInputKeyDown: InputProps["onKeyDown"]
            = ev => {
                if (
                    !onNumberOfItemsEnterKey
                    || ev.key !== "Enter"
                ) {
                    return
                }

                onNumberOfItemsEnterKey({
                    numberOfItems: Number(ev.currentTarget.value)
                    , showInfo
                })
            }

    return (
        <div
            {...rest}
            className={_cn(`
                absolute 
                border border-gray-200
                bottom-1 
                left-2
                flex flex-row items-center gap-2
                z-20
                opacity-50
                hover:opacity-100
                cursor-default
                bg-white
                rounded-[10px]
                transition-all
                duration-200
                px-2
                py-0
                scale-[.75]
                hover:scale-[1]
                mt-6
                
                origin-bottom-left
                `
                , rest.className
            )}
        >
            <ShowInfoToggle
                checked={showInfo}
                name="BoardSurface"
                size="xs"
                onChange={({ showInfo }) => onChange?.({
                    numberOfItems
                    , showInfo
                })}
            />
            <Input
                data-number-of-items-input
                type="number"
                className="text-center"
                size="sm"
                min={1}
                max={10}
                value={numberOfItems}
                width={60}
                onChange={_handle_NumberOfItemsInputChange}
                onKeyDown={_handle_NumberOfItemsInputKeyDown}
            />
            <ButtonGroupRS
                buttons={buttonsMap}
                disabled={buttonsAreDisabled}
                buttonProps={{
                    //className: "hover:scale-[2] hover:scale-[2] origin-[50%_100%] hover:z-50 transition-all duration-[.2s]"
                    //appearance: "default"
                    //className: "mx-[0.5px]!"
                }}
                wrapperType="Box"
                className="m-0! p-0!"
                bordered={false}
            />
        </div>
    )
}
