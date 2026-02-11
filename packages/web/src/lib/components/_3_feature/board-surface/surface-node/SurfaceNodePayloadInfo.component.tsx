import { EventHandlersFromMap, HasData, HasPayload, PayloadWithKind } from "@ns-world-lab/types"
import { _cn, _effect, _use_state, OmitHtmlAttributes } from "../../../../utils"
import { ObjectView } from "../../../_2_composite"
import React, { CSSProperties, useRef } from "react"
/**
 
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
 */

const STYLES = {

    common: {
        position: "absolute"
        , bottom: 0
        , left: 0
        //, translate: "-50%, 0"
        // , transform: "scale(.75)"
        , opacity: .5
        , transitionDuration: ".4s"
        , transformOrigin: "0 100%"
        , overflow: "hidden"
        , width: "var(--min)"
        , height: "var(--min)"
        , transitionProperty: "width,height,bottom,right,top,left,padding"
        , zIndex: 100
        , borderRadius: "0 15px 0 0"
        //, backgroundColor: "var(--color-gray-500)"
        //, color: "var(--color-gray-500)"
    } as CSSProperties
    , true: {
        borderRadius: "unset"
        , bottom: -20
        , right: 0
        , opacity: 1
        , width: "100%"
        , height: "100%"
    } as CSSProperties
    , false: {} as CSSProperties
} as const


export type SurfaceNode_PayloadInfo_Component_Props<
    P extends PayloadWithKind<any>
>
    =
    & Partial<
        & {
            min?: number
        }
        & HasPayload<P>
        & OmitHtmlAttributes<"onChange">
        & EventHandlersFromMap<{
            change: {
                mouseIsOver: boolean
            }
        }>
    >

export const SurfaceNode_PayloadInfo_Component = <
    P extends PayloadWithKind<any>
>({
    payload
    , min = 20
    , onChange
    , className
    , ...rest
}: SurfaceNode_PayloadInfo_Component_Props<P>) => {
    const [state, _set_state] = _use_state({
        mouseIsOver: false
    })
        , _set = (mouseIsOver: boolean) => {
            _set_state({ mouseIsOver })
            onChange?.({ mouseIsOver })
        }

        , elRef = useRef<HTMLElement | null | undefined>(undefined)


    _effect([min], () => {
        if (!elRef.current) {
            return
        }
        elRef.current.style.setProperty("--min", min + "px")
    })

    return (
        <div
            {...rest}
            ref={el => {
                elRef.current = el
            }}
            data-surface-node-payload-info
            onMouseOver={() => _set(true)}
            onMouseOut={() => _set(false)}
            className={_cn(
                // state.mouseIsOver ? "scale-20" : "scale-100"
                // `
                // inline
                // absolute
                // rounded-[10px]
                // hover:rounded-[unset]
                // bottom-2
                // right-2
                // scale-100
                // hover:scale-100
                // hover:bottom-0
                // hover:right-0
                // opacity-50
                // hover:opacity-100
                // duration-500
                // origin-bottom-left
                // overflow-hidden
                // w-[${min}px]
                // h-[${min}px]
                // hover:w-full
                // hover:h-full
                // transition-[width,height,bottom,right]
                // z-50
                // `
                className
            )}
            style={{
                ...STYLES.common
                , ...STYLES[state.mouseIsOver ? "true" : "false"]
                // width: state.mouseIsOver ? undefined : min
                // , height: state.mouseIsOver ? undefined : min
            }}
        >
            <ObjectView
                data={payload}
                className={`
                    ---translate-y-[-30px]
                `}
                header="payload-info"
                headerProps={{
                    //className: "py-0"
                    style: {
                        paddingTop: state.mouseIsOver ? undefined : 100
                    }
                }}
            />
        </div>
    )

}