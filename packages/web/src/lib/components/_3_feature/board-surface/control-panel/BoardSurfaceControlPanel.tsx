import { _cn, _effect, _use_state, PickHtmlAttributes } from "../../../../utils"
import {
    EventHandlersFromMapPartial
    , PickRequired
} from "@ns-world-lab/types"
import {
    Input,
    InputProps
} from "rsuite"
import { ButtonGroupRS, ButtonGroupRSProps, PinButton } from "../../../_2_composite"
import { ShowInfoToggle } from "../../../_1_primitive"
import { ImportMetaEnv } from "../../../../infra"

const {
    MAX_PAYLOAD_FACTORY_ADD
} = ImportMetaEnv

// ======================================== events
type Event =
    & {
        numberOfItems: number
        showInfo: boolean
    }

type EventsMap = {
    change:
    & Event

    , numberOfItemsEnterKey:
    & Event
}

// ======================================== props
type Props =
    & Partial<{
        numberOfItems: number
        showInfo: boolean
        buttonsAreDisabled: boolean
        maxPayloadFactoryAdd: number
    }>
    & PickRequired<
        ButtonGroupRSProps
        , "buttons"
    >
    & EventHandlersFromMapPartial<EventsMap>
    & PickHtmlAttributes<"className">


// ======================================== component
export const BoardSurface_ControlPanel: React.FC<Props> = ({
    buttons: buttonsMap
    , numberOfItems
    , showInfo = true
    , buttonsAreDisabled
    , maxPayloadFactoryAdd = MAX_PAYLOAD_FACTORY_ADD || 10
    , onChange
    , onNumberOfItemsEnterKey
    , ...rest
}) => {
    numberOfItems = Math.max(1, numberOfItems || 1)

    const [state, _set_state] = _use_state({
        isPinned: true
    })
        , _handle_NumberOfItemsInputChange: InputProps["onChange"]
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
                mt-6
                origin-bottom-left
                `
                , state.isPinned ? undefined : "scale-[.6] hover:scale-[1]"
                , rest.className

            )}
        >
            <ShowInfoToggle
                checked={showInfo}
                // name="BoardSurface"
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
                max={maxPayloadFactoryAdd}
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
            <PinButton
                width={18}
                className={`
                    mr-1
                    ---bg-red-600
                    `}
                isPinned={state.isPinned}
                onChange={_set_state}
            />
        </div>
    )
}








export {
    type Event as BoardSurface_ControlPanel_Event

    , type EventsMap as BoardSurface_ControlPanel_EventsMap

    , type Props as BoardSurface_ControlPanel_Props

}