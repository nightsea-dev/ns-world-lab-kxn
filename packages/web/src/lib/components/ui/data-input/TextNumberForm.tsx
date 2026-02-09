import { EventHandlersFromMap, EventHandlersWithKindFromMap, EventsWithKindFromMap, HasData, KeyOf, PartialOrFull, ValueOf } from "@ns-lab-knx/types"
import { FormValueInput, FormValueInputProps, ValidFormValue } from "./FormValueInput"
import { _effect, _use_state } from "../../../utils"
import { useRef } from "react"
import { _capitalise, _isNumber, entriesOf, keysOf, pickFromAsArray, valuesOf } from "@ns-lab-knx/logic"
import { ButtonGroupRS, ShowInfoToggle } from "../rs"
import { Box, ObjectView } from "../_basic"
import { ControlButton_EventKind, ControlButton_EventMapFor, ControlButtons, ControlButtonsProps } from "../buttons"




// ======================================== helpers
const _eqData = <
    TData extends FormData
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


export type FormData =
    & Record<string, ValidFormValue>



// ======================================== events - TextNumberFormView
export type FormEventsMap<
    TData extends FormData
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
    = Extract<KeyOf<FormEventsMap<any>>, ControlButton_EventKind>

export type FormEventHandlersWithKindMap<
    TData extends FormData
> = EventHandlersFromMap<FormEventsMap<TData>>


// ======================================== props - TextNumberFormView
export type TextNumberFormProps<
    TData extends FormData
> =
    & HasData<TData>
    & Partial<
        & {
            hideButtons: ButtonEventKind[] | boolean
        }
        & FormEventHandlersWithKindMap<TData>
    >

const _isValidData = <
    TData extends FormData
>(
    data: TData
) =>
    valuesOf(data)
        .every(v => _isNumber(v) || (v as string ?? "").trim().length)


// ======================================== component 
/**
 * * TextNumberFormView
 */
export const TextNumberForm = <
    TData extends FormData
>({
    data: data_IN
    , hideButtons
    , onChange
    , onDone
}: TextNumberFormProps<TData>
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

        , _handleClear = () => _clear_current_data()
        , _handleDone = () => {
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

                    onClear={_handleClear}
                    onDone={_handleDone}

                    showInfoName={TextNumberForm.name}
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
