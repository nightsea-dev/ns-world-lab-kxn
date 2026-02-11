import { EventHandlersFromMap, PickRequired } from "@ns-world-lab-kxn/types"
import { _isBoolean } from "@ns-world-lab-kxn/logic"
import { HasClassName } from "../types"
import { _cn, _effect, _memo, _use_state, PickHtmlAttributes, Tw } from "../utils"


export type PinIconData = {
    isPinned: boolean
}
export type PinButtonPosition = | "top-left" | "top-right" | "bottom-right" | "bottom-left"

export type UseIsPinnedInput =
    & Partial<
        & PinIconData
        & {
            position: PinButtonPosition
            margin?: number
        }
        & EventHandlersFromMap<{
            change: PinIconData
        }>
        & HasClassName
    >

export type UseIsPinnedOutput =
    & {
        positionTw: Tw
    }
    & PickRequired<
        UseIsPinnedInput
        , "isPinned" | "className"
    >
    & Required<PickHtmlAttributes<"onClick">>
// & PinIconData
// & HasClassName

export const useIsPinned = ({
    isPinned
    , className
    , position: position_IN = "top-right"
    , margin = 2
    , onChange

    // , iconType = "PushPin"
    // , width
    // , height
    // , iconProps


}: UseIsPinnedInput
): UseIsPinnedOutput => {
    const [state, _set_state] = _use_state({
        isPinned: true
    } as PinIconData)

        , onClick: UseIsPinnedOutput["onClick"]
            = () => {
                const isPinned = !state.isPinned
                _set_state({ isPinned })
                onChange?.({ isPinned })
            }
        , { positionTw } = _memo([position_IN, margin], () => {
            return {
                positionTw: position_IN.split(/\-/img).map(v => [v, `[${margin}px]`].join("-")).join(" ") as Tw
            }

        })

    _effect([isPinned], () => {
        if (!_isBoolean(isPinned) || state.isPinned === isPinned) {
            return
        }
        _set_state({ isPinned })
    })

    return {
        className: _cn(`
                ---border 
                ---border-gray-50
                hover:border-gray-300
                hover:bg-gray-200
                p-1
                rounded-[5px]           
                transition-all duration-[.2s]
                `
            , positionTw
            , className
        )
        , ...state
        , onClick
        , positionTw
        // , onChange
    }

}
