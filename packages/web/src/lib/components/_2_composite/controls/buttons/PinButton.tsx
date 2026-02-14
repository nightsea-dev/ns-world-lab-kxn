import { _isBoolean } from "@ns-world-lab/logic"
import { PinIcon, PinIconProps } from "../../../_1_primitive"
import { useIsPinned, UseIsPinnedInput } from "../../../../hooks/use-is-pinned"
import { _cn } from "../../../../utils"


type IconProps = Omit<PinIconProps, "onClick" | "onChange">


export type PinButtonProps =
    & Omit<
        & Partial<
            & {
                iconProps: & Pick<IconProps, "width" | "height" | "iconType">
            }
            & UseIsPinnedInput
            & Pick<IconProps, "width" | "height" | "iconType" | "className">
        >
        , "children"
    >

export const PinButton: React.FC<PinButtonProps> = ({
    isPinned: isPinned_IN
    , className: className_IN
    , position: position_IN = "top-right"
    , margin = 2

    , iconType = "PushPin"
    , width
    , height
    , iconProps


    , onChange: onChange_IN
    , ...rest
}) => {

    const {
        className
        , isPinned
        , onClick
        , positionTw
    } = useIsPinned({
        isPinned: isPinned_IN
        , className: className_IN
        , onChange: onChange_IN
    })

    return (
        <div
            {...rest}
            data-pin-button
            data-position-tw={positionTw}
            aria-pressed={isPinned}
            onClick={onClick}
            className={className}
        >
            <PinIcon
                {...iconProps}
                className={_cn(`
                    `
                    , isPinned ? "rotate-0" : "rotate-45 opacity-50"
                )}
                {...{
                    width
                    , height
                    , iconType
                }}
            />
        </div>
    )
}
