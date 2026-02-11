import { EventHandlersFromMap, KeyOf } from "@ns-world-lab-kxn/types"
import { Box, ToggleRS, ToggleRSProps } from "../_1_primitive"
import { ObjectView, ObjectViewProps, ObjectViewValue } from "./ObjectView"
import { _cn, _effect, _use_state, CssPosition } from "../../utils"

// ======================================== props/base
type BaseObjectViewWithToggleProps =
    & Partial<
        & {
            isShown: boolean
            toggleProps: Omit<
                ToggleRSProps,
                | "checked"
                | "onChange"
            >
        }
        & Pick<ToggleRSProps, "label">

        // ======================================== events (some)
        & EventHandlersFromMap<{
            change: {
                isShown: boolean
            }
        }>
    >

// ======================================== props
export type ObjectViewWithToggleProps<
    T extends ObjectViewValue
> =
    & BaseObjectViewWithToggleProps
    & Omit<ObjectViewProps<T>, KeyOf<BaseObjectViewWithToggleProps> | "isHidden">


// ======================================== component
export const ObjectViewWithToggle = <
    T extends ObjectViewValue
>({
    isShown = false
    , onChange
    , data: data
    , label: toggleLabel = "Show"
    , toggleProps
    , className
    , absolute
    , top
    , right
    , bottom
    , left
    , ...rest
}: ObjectViewWithToggleProps<T>
) => {


    const [state, _set_state] = _use_state({
        isShown
    })
        , _handleToggleChange: ToggleRSProps["onChange"]
            = ({ value: isShown }) => {
                _set_state({ isShown })
                onChange?.({ isShown })
            }

    _effect([isShown], () => {
        if (typeof (isShown) !== "boolean" || state.isShown === isShown) {
            return
        }
        _set_state({ isShown })
    })
    return (
        <Box
            data-object-view-with-toggle
            bordered={false}
            className={_cn(
                "inline"
                , className
            )}
            style={absolute ? {
                position: "absolute"
                , top
                , right
                , bottom
                , left
            } : undefined}

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
            <ObjectView
                relative
                {...rest}
                data={data}
                className="w-full"
                isHidden={!state.isShown}
            // header={showInfoName}
            // header={ImageUploaderRS.name}
            // grayHeader
            />
        </Box>
    )
}