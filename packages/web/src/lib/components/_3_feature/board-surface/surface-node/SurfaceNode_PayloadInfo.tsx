import { EventHandlersFromMap, HasData, HasPayload, PayloadWithKind } from "../../../../../../../types/src"
import { _cn, _use_state, OmitHtmlAttributes } from "../../../../utils"
import { ObjectView } from "../../../_2_composite"


export type SurfaceNode_PayloadInfo_Props<
    P extends PayloadWithKind<any>
>
    =
    & Partial<
        & HasPayload<P>
        & OmitHtmlAttributes<"onChange">
        & EventHandlersFromMap<{
            change: {
                mouseIsOver: boolean
            }
        }>
    >

export const SurfaceNode_PayloadInfo = <
    P extends PayloadWithKind<any>
>({
    payload
    , onChange
    , className
    , ...rest
}: SurfaceNode_PayloadInfo_Props<P>) => {
    const [state, _set_state] = _use_state({
        mouseIsOver: false
    })
        , _set = (mouseIsOver: boolean) => {
            _set_state({ mouseIsOver })
            onChange?.({ mouseIsOver })
        }
        , min = 20
    return (
        <div
            {...rest}
            data-surface-node-payload-info
            onMouseOver={() => _set(true)}
            onMouseOut={() => _set(false)}
            className={_cn(
                // state.mouseIsOver ? "scale-20" : "scale-100"
                `
                inline
                absolute
                rounded-[10px]
                hover:rounded-[unset]
                bottom-2
                right-2
                scale-100
                hover:scale-100
                hover:bottom-0
                hover:right-0
                opacity-50
                hover:opacity-100
                duration-500
                origin-bottom-left
                overflow-hidden
                w-[${min}px]
                h-[${min}px]
                hover:w-full
                hover:h-full
                transition-[width,height,bottom,right]
                z-50
                `
                , className
            )}
        >
            <ObjectView
                className={`
                    ---translate-y-[-30px]
                `}
                header="payload-info"
                data={payload}
            />
        </div>
    )

}