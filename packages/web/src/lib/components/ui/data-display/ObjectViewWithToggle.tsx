import { EventHandlersFromMap, KeyOf } from "@ns-lab-knx/types"
import { ObjectView, ObjectViewProps, ObjectViewValue } from "../_basic"
import { _cn, _effect, _use_state } from "../../../utils"
import { ToggleRS, ToggleRSProps } from "../rs"







type BaseObjectViewWithToggleProps =
    & Partial<
        & {
            show: boolean
            toggleProps: Omit<
                ToggleRSProps,
                | "checked"
                | "onChange"
            >
        }
        & Pick<ToggleRSProps, "label">
        & EventHandlersFromMap<{
            change: {
                isShown: boolean
            }
        }>
    >


export type ObjectViewWithToggleProps<
    T extends ObjectViewValue
> =
    & BaseObjectViewWithToggleProps
    & Omit<ObjectViewProps<T>, KeyOf<BaseObjectViewWithToggleProps>>



export const ObjectViewWithToggle = <
    T extends ObjectViewValue
>({
    show
    , onChange
    , data
    , label: toggleLabel = "Show"
    , toggleProps
    , ...rest
}: ObjectViewWithToggleProps<T>
) => {

    const [state, _set_state] = _use_state({
        isShown: false
    })
        , _handleToggleChange: ToggleRSProps["onChange"]
            = ({
                value: isShown
            }) => {
                _set_state({ isShown })
                onChange?.({ isShown })
            }

    _effect([show], () => {
        if (typeof (show) !== "boolean" || state.isShown === show) {
            return
        }
        _set_state({
            isShown: show
        })
    })
    return (
        <div
            className={_cn(`
                grid
                gap-2 
                py-0.5
                items-center
                justify-between
                `
            )}
        >
            {state.isShown && data && (
                <ObjectView
                    relative
                    {...rest}
                    data={data}
                // header={showInfoName}
                // header={ImageUploaderRS.name}
                // grayHeader
                />)}
            <ToggleRS
                {...(toggleProps as any)}
                checked={state.isShown}
                onChange={_handleToggleChange}
                label={toggleProps?.label ?? toggleLabel}
            // name={toggleName}
            // size={toggleSize}
            // label={toggleLabel}
            />
        </div>
    )
}