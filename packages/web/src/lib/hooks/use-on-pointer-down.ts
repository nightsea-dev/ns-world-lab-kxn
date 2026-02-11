import {
    _use_state
    , PickHtmlAttributes
} from "../utils"


export type UseOnPointerDownInput =
    & PickHtmlAttributes<"onPointerDown">

export type UseOnPointerDownOutput =
    & PickHtmlAttributes<"onPointerDown" | "onPointerUp">
    & {
        pointerIsDown: boolean
    }

export const useOnPointerDown = ({
    onPointerDown
} = {} as UseOnPointerDownInput
): UseOnPointerDownOutput => {

    const [state, _set_state] = _use_state({
        pointerIsDown: false
    })


    return {
        ...state
        , onPointerDown: (ev) => {
            _set_state({
                pointerIsDown: true
            })
            onPointerDown?.(ev)
        }
        , onPointerUp: () => {
            _set_state({
                pointerIsDown: false
            })
        }
    }
}
