import { _cn, _effect } from "../../../../utils"
import { ControlButton_ButtonEventsMap, ControlButtons, ControlButtons_Props } from "../../../_2_composite"
import { Box, BoxProps } from "../../../_1_primitive"
import { EventHandlersFromMap, ExtractEventHandlersMap } from "@ns-world-lab/types"
import { ButtonProps } from "rsuite"
import { _t } from "@ns-world-lab/logic"
import { useId, useRef } from "react"
import { useMountCounter } from "../../../../hooks"

// type EventsMap = {
//     done: {}
//     cancel: {}
// }

// type EventsMapHandlers = EventHandlersFromMap<EventsMap>


// ======================================== props
type Props =
    & BoxProps
    & {
        controlButtonsProps: ControlButtons_Props
    }



// ======================================== component
export const InputViewLayout: React.FC<Props> = ({
    controlButtonsProps
    , children
    // , onDone
    // , onCancel
    , ...rest
}) => {

    const id = useId()

    useMountCounter(InputViewLayout)

    return (
        <Box
            {...rest}
            id={id}
            data-input-view-layout
            className={_cn(`
                h-full w-full flex flex-col gap-4 p-6 overflow-auto
                `
                , rest.className
            )}
        >

            <ControlButtons
                infoDataViewHeader="Info"
                justifyChildren="right"
                bordered={false}
                {...controlButtonsProps}
            // onDone={onDone}
            // onCancel={onCancel}
            />

            <div
                data-input-view-layout-children-container
            >
                {children}
            </div>
        </Box>
    )
}



export {
    type Props as InputViewLayout_Props
}
