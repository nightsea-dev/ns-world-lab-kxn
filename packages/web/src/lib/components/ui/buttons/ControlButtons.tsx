import {
    EntryItem,
    EventHandlersFromMap
    , KeyOf,
    OverrideMap
} from "@ns-world-lab-knx/types"
import { FunctionComponent, ReactNode } from "react"
import { _cn, _memo, _tw } from "../../../utils"
import {
    ButtonGroupRS
    , ButtonIsDisabledFn
    , ShowInfoToggle
    , ButtonRSProps,
    ButtonGroupRSProps
} from "../rs"
import { _capitalise, _isEmpty, entriesOf } from "@ns-world-lab-knx/logic"
import { Box, BoxProps, ObjectView, ObjectViewProps, ObjectViewValue } from "../_basic"
import { BasicSize } from "rsuite/esm/internals/types"
import { ObjectViewWithToggle } from "../data-display"

// ======================================== types

// ======================================== events
export type ControlButtons_EventsMap = {
    cancel: {}
    clear: {}
    done: {}
    showInfoChange: {
        showInfo: boolean
    }
}

type EventKind
    = KeyOf<ControlButtons_EventsMap>

export type ControlButton_EventKind
    = Exclude<EventKind, `show${string}`>

export type ControlButton_EventsMap
    = Pick<ControlButtons_EventsMap, ControlButton_EventKind>

export type ControlButton_EventMapFor<
    O extends Partial<ControlButtons_EventsMap> | undefined = undefined
    , Ex extends ControlButton_EventKind | never = never
> = OverrideMap<ControlButton_EventsMap, O, Ex>

export type ControlButtons_EventHandlers
    = EventHandlersFromMap<ControlButtons_EventsMap>


// ========================================  CONSTS
const EVENT_KINDS = [
    "cancel"
    , "clear"
    , "done"
    , "showInfoChange"
] as EventKind[]

    , EMPTY_isDisabledFn: ButtonIsDisabledFn<any> = (() => false)

type InputViewControl_ButtonIsDisabledFn
    = ButtonIsDisabledFn<EventKind>

type InputViewControl_ButtonIsDisabledFnMap
    = Record<EventKind, InputViewControl_ButtonIsDisabledFn>

type InputViewControl_ButtonIsDisabledInputMap
    = Partial<
        Record<EventKind, InputViewControl_ButtonIsDisabledFn | boolean>
    >


// ======================================== props
type BaseControlButtonsProps<
    TInfoData extends ObjectViewValue | undefined = undefined
> =
    & {
        // showInfo: boolean
        infoData: TInfoData extends ObjectViewValue ? ObjectViewProps<TInfoData>["data"] : never
        showInfoName: string
        hideButtons: ControlButton_EventKind[]
        isDisabled: InputViewControl_ButtonIsDisabledInputMap | boolean
        buttonProps: Omit<
            ButtonRSProps,
            | KeyOf<ControlButtons_EventHandlers>
        >
    }
    & ControlButtons_EventHandlers

export type ControlButtonsProps<
    TInfoData extends ObjectViewValue | undefined = undefined
> =
    & Partial<
        & BaseControlButtonsProps<TInfoData>
        & Omit<
            & BoxProps
            & Pick<ButtonGroupRSProps, "children">
            & Pick<ButtonRSProps, "size">
            , keyof BaseControlButtonsProps<TInfoData>
        >
    >

// ======================================== renderer
export type ControlButtonsRenderer<
    TInfoData extends ObjectViewValue | undefined = undefined
> = FunctionComponent<ControlButtonsProps<TInfoData>>



// ======================================== component
export const ControlButtons = <
    TInfoData extends ObjectViewValue | undefined = undefined
>({
    // showInfo
    showInfoName
    , infoData
    , isDisabled: isDisabledFnMap_IN

    , buttonProps: common_buttonProps
    , hideButtons

    , onCancel
    , onClear
    , onDone

    , onShowInfoChange

    , size = "sm"
    , children

    , ...rest
} = {} as ControlButtonsProps<TInfoData>
) => {

    const { isDisabledFn } = _memo([isDisabledFnMap_IN], () => {

        if (_isEmpty(isDisabledFnMap_IN)) {
            return {
                isDisabledFn: EMPTY_isDisabledFn
            }
        }

        if (typeof (isDisabledFnMap_IN) === "boolean") {
            return {
                isDisabledFn: () => isDisabledFnMap_IN
            }
        }

        const isDisabledFnMap = Object.fromEntries(
            EVENT_KINDS
                .map(k => {
                    if (_isEmpty(isDisabledFnMap_IN[k])) {
                        return
                    }
                    const v = isDisabledFnMap_IN[k]
                        , fn = typeof (v) === "function"
                            ? v
                            : () => v
                    return [k, fn]
                }).filter(Boolean) as EntryItem<EventKind, InputViewControl_ButtonIsDisabledFn | undefined>[]
        )

        return {
            isDisabledFn: (k: EventKind) => isDisabledFnMap[k]?.(k)
        }

    })

    const { buttonsInput } = _memo([
        onCancel
        , onClear
        , onDone
    ], () => ({
        buttonsInput: entriesOf({
            cancel: onCancel
            , clear: onClear
            , done: onDone
        }).filter(([k, fn]) =>
            !!fn
            && (!hideButtons || !hideButtons.includes(k))
        )
            .map(([k, onClick]) => {
                return [
                    _capitalise(k)
                    , {
                        appearance: k === "done" ? "primary" : undefined
                        , size
                        , ...common_buttonProps
                        , disabled: isDisabledFn(k)
                        , onClick
                    } as ButtonRSProps
                ] as EntryItem<typeof k, ButtonRSProps>
            })
    })
    )

    const toggleSize: BasicSize = _memo([size], () => {
        switch (size) {
            case "lg": {
                return "md" as BasicSize
            }
            case "md": {
                return "sm" as BasicSize
            }
            case "sm":
            case "xs": {
                return "xs" as BasicSize
            }
        }
    })

    return (
        <Box
            {...rest}
            data-control-buttons
        >
            <ObjectViewWithToggle
                data={infoData}
                header={showInfoName}
                className="mb-2"
                showOnlyArrayLength
                toggleProps={{
                    name: showInfoName
                    , size: toggleSize
                    , label: <div>Show {showInfoName ? <b>{showInfoName}</b> : undefined}</div>
                }}
                onChange={({ isShown: showInfo }) => onShowInfoChange?.({ showInfo })}
            />
            <div
                className={_cn(`
                    inline-flex
                    gap-2 
                    py-0.5
                    items-center
                    justify-between
                    `
                )}
            >
                <ButtonGroupRS
                    buttons={buttonsInput}
                    showOnlyIfOnClickHandlerExists
                    size={size}
                    children={children}
                />
            </div>
        </Box>
    )

}

