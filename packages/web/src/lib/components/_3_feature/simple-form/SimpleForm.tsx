import {
    EventHandlersFromMap
    , ExtractEventHandlersMap, HasData, KeyOf, PartialOrFull
} from "@ns-world-lab/types"
import {
    SimpleFormFormValueInput as FormValueInput
    , SimpleFormValidInputValue as ValidInputValue
} from "./SimpleFormFormValueInput"
import { ReactNode, useRef } from "react"
import {
    _capitalise, _isEmpty, _isNumber, entriesOf
    , keysOf
} from "@ns-world-lab/logic"
import {
    ControlButton_ButtonEventKind
    , ControlButtons
    , ControlButtons_Props
    , ObjectView

} from "../../_2_composite"
import { _cn, _effect, _use_state } from "../../../utils"
import { Box, BoxProps } from "../../_1_primitive"




// ======================================== helpers
const _isValidData = <
    TData extends ValidFormData
>(
    data: TData
    , requiredKeys = [] as KeyOf<TData>[]
) => {

    for (const k in data) {
        const v = data[k]
        if (requiredKeys.includes(k)
            && (
                !_isNumber(v)
                || _isEmpty(v)
            )
        ) {
            return false
        }
    }

    return true
}

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
type ValidFormData =
    & Record<string, ValidInputValue>



// ======================================== events
type ChangeEvent<
    TData extends ValidFormData
> = {
    previousData: TData
    currentData: TData
}
type EventsMap<
    TData extends ValidFormData
> =
    & {
        change: ChangeEvent<TData>
        done: HasData<TData>
        cancel: {}
    }


type ButtonEventKind
    = Extract<KeyOf<EventsMap<any>>, ControlButton_ButtonEventKind>

type EventHandlersWithKindMap<
    TData extends ValidFormData
> = EventHandlersFromMap<EventsMap<TData>>


// ======================================== props
type BaseProps<
    TData extends ValidFormData
> =
    & HasData<TData>
    & Partial<
        & {
            hideButtons: ButtonEventKind[] | boolean
            buttonAreDisabled: boolean
            // buttonLabels: Partial<Record<ButtonEventKind, ReactNode>>
        }
        & Pick<ControlButtons_Props, "buttonLabels">
        & EventHandlersWithKindMap<TData>
    >
type Props<
    TData extends ValidFormData
> =
    & BaseProps<TData>
    & Omit<BoxProps, KeyOf<BaseProps<any>> | "children">


// ======================================== component
/**
 * * TextNumberForm
 */
export const SimpleForm = <
    TData extends ValidFormData
>({
    data: data_IN
    , hideButtons
    , buttonAreDisabled
    , buttonLabels
    , onChange
    , onDone
    , ...rest
}: Props<TData>
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

        , controlButtonHandlers = {
            onShowInfoChange: _set_state
            , onDone: () => {
                if (!_isValidData(state.currentData)
                    || !onDone) {
                    return
                }
                onDone({
                    data: state.currentData
                })
            }
            , onClear: () => {
                _clear_current_data()
            }
        } as ExtractEventHandlersMap<ControlButtons_Props>

    // debugger


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
            {...rest}
            data-simple-form
            className={_cn(`
                grid
                gap-4
                ---bg-gray-100
                p-0
                `
                , rest.className
            )}
            childrenContainerProps={{
                className: "px-2 pt-0"
                , ...rest.childrenContainerProps
            }}
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
                        done: !_isValidData(state.currentData) || buttonAreDisabled
                    }}

                    infoDataViewHeader={SimpleForm.name}

                    {...controlButtonHandlers}
                    buttonLabels={{
                        done: "Add"
                    }}

                />
            }

            <ObjectView
                data={state}
                header={SimpleForm.name}
                isHidden={!state.showInfo}
            />

        </Box>
    )
}



export {
    type Props as SimpleFormProps
    , type EventHandlersWithKindMap as SimpleForm_EventHandlersWithKindMap
    , type EventsMap as SimpleForm_EventsMap
    , type ChangeEvent as SimpleForm_ChangeEvent
    , type ValidFormData as SimpleForm_ValidFormData
}


