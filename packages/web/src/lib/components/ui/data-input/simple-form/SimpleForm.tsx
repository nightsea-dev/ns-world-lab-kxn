import {
    EventHandlersFromMap
    , HasData, KeyOf, PartialOrFull
} from "@ns-world-lab-knx/types"
import {
    FormValueInput
    , ValidInputValue
} from "./FormValueInput"
import { _effect, _use_state } from "../../../../utils"
import { useRef } from "react"
import { _capitalise, _isNumber, entriesOf, keysOf, pickFromAsArray, valuesOf } from "@ns-world-lab-knx/logic"
import { Box, ObjectView } from "../../_basic"
import {
    ControlButton_EventKind, ControlButton_EventMapFor, ControlButtons
} from "../../buttons"




// ======================================== helpers
const _eqData = <
    TData extends ValidFormData
>(
    ...[a, b]: [TData, TData]
) => {

    if (a === b) {
        return true
    }
    const [entries_A, entries_B]
        = [a, b].map(v => entriesOf(v))

    if (entries_A.length !== entries_B.length) {
        return false
    }

    return entries_A.every(([k, v], i) => entries_B[i][0] === k && entries_B[i][1] === v)

}
// ======================================== types
export type ValidFormData =
    & Record<string, ValidInputValue>



// ======================================== events
export type SimpleFormEventsMap<
    TData extends ValidFormData
> =
    & {
        change:
        & {
            previousData: TData
            currentData: TData
        }
    }
    & ControlButton_EventMapFor<{
        done:
        & HasData<TData>
    }
        , "cancel"
    >

type ButtonEventKind
    = Extract<KeyOf<SimpleFormEventsMap<any>>, ControlButton_EventKind>

export type SimpleFormEventHandlersWithKindMap<
    TData extends ValidFormData
> = EventHandlersFromMap<SimpleFormEventsMap<TData>>


// ======================================== props
export type SimpleFormProps<
    TData extends ValidFormData
> =
    & HasData<TData>
    & Partial<
        & {
            hideButtons: ButtonEventKind[] | boolean
        }
        & SimpleFormEventHandlersWithKindMap<TData>
    >

const _isValidData = <
    TData extends ValidFormData
>(
    data: TData
) =>
    valuesOf(data)
        .every(v => _isNumber(v) || (v as string ?? "").trim().length)


// ======================================== component
/**
 * * TextNumberForm
 */
export const SimpleForm = <
    TData extends ValidFormData
>({
    data: data_IN
    , hideButtons
    , onChange
    , onDone
}: SimpleFormProps<TData>
) => {

    const [state, _set_state] = _use_state({
        currentData: data_IN
        , showInfo: false
    })
        , { current: _refs } = useRef({
            prevData_IN: data_IN
            , keys: keysOf(data_IN)
        } as {
            prevData_IN?: TData
            keys: KeyOf<TData>[]
        })

        , _set_data = <
            K extends KeyOf<TData>
        >(
            partial: PartialOrFull<TData, K>
        ) => {

            const { currentData: previousData } = state
                , currentData = {
                    ...previousData
                    , ...partial
                }

            _set_state({ currentData })

            onChange?.({ currentData, previousData })

            return { previousData, currentData }

        }

        , _clear_current_data = () => {
            const {
                currentData: previousData
            } = state
                , currentData = { ...previousData }

            entriesOf(currentData).forEach(([k, v]) => {
                switch (typeof (v)) {
                    case "string": {
                        currentData[k] = "" as any
                        break
                    }
                    case "number": {
                        currentData[k] = 0 as any
                        break
                    }
                }
            })

            return _set_data(currentData)

        }

        , _handle_Clear = () => _clear_current_data()
        , _handle_Done = () => {
            if (!_isValidData(state.currentData)
                || !onDone) {
                return
            }
            onDone({
                data: state.currentData
            })
        }

    _effect([data_IN, state.currentData], () => {
        if (
            !data_IN
            || data_IN === _refs.prevData_IN
            || _eqData(data_IN, state.currentData)
        ) {
            return
        }
        _set_state({
            currentData: data_IN
        })
    })

    return (
        <Box
            data-text-number-form
            className={`
                grid
                gap-4
                ---bg-gray-100
                p-1
                `}
        >
            <div>
                {_refs.keys.map(k => (
                    <FormValueInput
                        key={k}
                        k={k}
                        v={state.currentData[k]}
                        onChange={_set_data as any}
                    />
                ))}
            </div>
            {(hideButtons === true)
                || <ControlButtons
                    justifyChildren="right"
                    bordered={false}
                    className="pt-2"
                    size="md"
                    hideButtons={
                        typeof (hideButtons) === "boolean"
                            ? undefined
                            : hideButtons
                    }
                    isDisabled={{
                        //clear: clearIsDiabled
                        done: !_isValidData(state.currentData)
                    }}

                    onClear={_handle_Clear}
                    onDone={_handle_Done}

                    showInfoName={SimpleForm.name}
                    onShowInfoChange={_set_state}

                />
            }

            {
                state.showInfo
                && <ObjectView
                    data={state}
                    header="state-info"
                />
            }

        </Box>
    )
}
