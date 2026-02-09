import { EventHandlersFromMap, KeyOf } from "@ns-world-lab-knx/types"
import { Box, ObjectView, ObjectViewProps, ObjectViewValue } from "../_basic"
import { _cn, _effect, _use_state } from "../../../utils"
import { ToggleRS, ToggleRSProps } from "../rs"
import { Panel } from "rsuite"







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
    , data: data
    , label: toggleLabel = "Show"
    , toggleProps
    , className
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
        <Box
            data-object-view-with-toggle
            bordered={false}
            className={className}
            //className="mb-2"
            // className={_cn(`
            //     grid
            //     gap-2 
            //     py-0.5
            //     items-center
            //     justify-between
            //     `
            // )}
            childrenContainerProps={{
                className: _cn(`
                    ---w-full
                    grid
                    gap-1 
                    py-0.5
                    items-center
                    justify-end
                    ---border border-red-500
                `
                )
            }}

        >
            <div
                className="flex justify-end"
            >
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
            {state.isShown && data && (
                <ObjectView
                    relative
                    {...rest}
                    data={data}
                    className="w-full"
                // header={showInfoName}
                // header={ImageUploaderRS.name}
                // grayHeader
                />)}
        </Box>
    )
}