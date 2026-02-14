import {
    EntryItem,
    EventHandlersFromMap
    , KeyOf,
    OverrideMap
} from "@ns-world-lab/types"
import { ReactNode } from "react"
import { _capitalise, _isEmpty, entriesOf } from "@ns-world-lab/logic"
import { BasicSize } from "rsuite/esm/internals/types"
import { ButtonGroupRS, ButtonGroupRSProps, ButtonIsDisabledFn, ButtonRSProps } from "./ButtonGroupRS"
import { ObjectViewProps, ObjectViewValue } from "../../ObjectView"
import { _cn, _memo } from "../../../../utils"
import { ObjectViewWithToggle } from "../../ObjectViewWithToggle"
import { Box, BoxProps } from "../../../_1_primitive"

// ======================================== types

// ======================================== events
type _AllEvMap_ = {
    cancel: {}
    clear: {}
    done: {}
    showInfoChange: {
        showInfo: boolean
    }
}

type AllEventKind = KeyOf<_AllEvMap_>

type ButtonEventKind
    = Exclude<AllEventKind, `show${string}`>

type ButtonEventsMap
    = Pick<_AllEvMap_, ButtonEventKind>

type ButtonEventsMapFor<
    O extends Partial<_AllEvMap_> | undefined = undefined
    , Ex extends ButtonEventKind | never = never
> = OverrideMap<ButtonEventsMap, O, Ex>

type AllEventHandlers
    = EventHandlersFromMap<_AllEvMap_>


// ========================================  CONSTS
const EVENT_KINDS = [
    "cancel"
    , "clear"
    , "done"
    , "showInfoChange"
] as AllEventKind[]

    , EMPTY_isDisabledFn: ButtonIsDisabledFn<any> = (() => false)

type InputViewControl_ButtonIsDisabledFn
    = ButtonIsDisabledFn<AllEventKind>


type InputViewControl_ButtonIsDisabledInputMap
    = Partial<
        Record<AllEventKind, InputViewControl_ButtonIsDisabledFn | boolean>
    >


// ======================================== props
type BaseProps<
    TInfoData extends ObjectViewValue | undefined = undefined
> =
    & {
        infoData: TInfoData extends ObjectViewValue ? ObjectViewProps<TInfoData>["data"] : never
        infoDataViewHeader: ReactNode
        infoDataViewToggleName: string
        hideButtons: ButtonEventKind[]
        isDisabled: InputViewControl_ButtonIsDisabledInputMap | boolean
        buttonProps: Omit<
            ButtonRSProps,
            | KeyOf<AllEventHandlers>
        >
        buttonLabels: Partial<Record<AllEventKind, ReactNode>>
    }
    & AllEventHandlers

type Props<
    TInfoData extends ObjectViewValue | undefined = undefined
> =
    & Partial<
        & BaseProps<TInfoData>
        & Omit<
            & BoxProps
            & Pick<ButtonGroupRSProps, "children">
            & Pick<ButtonRSProps, "size">
            , keyof BaseProps<TInfoData>
        >
    >

// ======================================== renderer
type ControlButtonsRenderer_FC<
    TInfoData extends ObjectViewValue | undefined = undefined
> = React.FC<Props<TInfoData>>



// ======================================== component
export const ControlButtons = <
    TInfoData extends ObjectViewValue | undefined = undefined
>({
    // showInfo
    infoDataViewHeader
    , infoDataViewToggleName
    , infoData
    , isDisabled: isDisabledFnMap_IN

    , buttonProps: common_buttonProps
    , buttonLabels
    , hideButtons

    , onCancel
    , onClear
    , onDone

    , onShowInfoChange

    , size = "sm"
    , children

    , ...rest
} = {} as Props<TInfoData>
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
                    return [
                        k
                        , fn
                    ]
                }).filter(Boolean) as EntryItem<AllEventKind, InputViewControl_ButtonIsDisabledFn | undefined>[]
        )

        return {
            isDisabledFn: (k: AllEventKind) => isDisabledFnMap[k]?.(k)
        }

    })

        , { buttons: buttonsInput } = _memo<
            Pick<ButtonGroupRSProps, "buttons">
        >([onCancel, onClear, onDone, buttonLabels]
            , () => ({
                buttons: entriesOf({
                    cancel: onCancel
                    , clear: onClear
                    , done: onDone
                }).filter(([k, fn]) =>
                    !!fn
                    && (!hideButtons || !hideButtons.includes(k))
                )
                    .map(([k, onClick]) => {
                        return [
                            buttonLabels?.[k] ?? _capitalise(k)
                            , {
                                appearance: k === "done" ? "primary" : undefined
                                , size
                                , ...common_buttonProps
                                , disabled: isDisabledFn(k)
                                , onClick
                            } as ButtonRSProps
                        ] as EntryItem<typeof k, ButtonRSProps>
                    })
            }))


        , toggleSize = _memo<BasicSize>([size], () => {
            switch (size) {
                case "lg": {
                    return "md"
                }
                case "md": {
                    return "sm"
                }
                case "sm":
                case "xs": {
                    return "xs"
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
                header={infoDataViewHeader}
                className="mb-2"
                showOnlyArrayLength
                toggleProps={{
                    name: infoDataViewToggleName
                    , size: toggleSize
                    , label: <div>Show {infoDataViewHeader ? <b>{infoDataViewHeader}</b> : undefined}</div>
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














export {

    type _AllEvMap_ as ControlButtons_AllEventsMap

    , type ButtonEventKind as ControlButton_ButtonEventKind

    , type ButtonEventsMap as ControlButton_ButtonEventsMap

    , type ButtonEventsMapFor as ControlButton_ButtonEventsMapFor

    , type AllEventHandlers as ControlButtons_AllEventHandlers

    , type Props as ControlButtons_Props

}

export namespace ControlButtons {
    export type FC<
        TInfoData extends ObjectViewValue | undefined = undefined
    > = ControlButtonsRenderer_FC<TInfoData>
}