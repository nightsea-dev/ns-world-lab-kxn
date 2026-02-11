import { HasColor, HasContent, PayloadWithKind } from "@ns-world-lab/types"
import { ReactNode, useRef, useState } from "react"
import { _isString, getRandomColour } from "@ns-world-lab/logic"
import { _cn, _effect, _memo, PickHtmlAttributes } from "../../../../../utils"
import { PayloadRenderer_Props } from "../_types"
import { ObjectView } from "../../../../_2_composite"



// ======================================== PayloadRenderers/components-impl
const ContentDisplay = <
    P extends HasContent<ReactNode>
>({
    data
}: {
    data: P
}) => {
    if (!_isString(data.content)) {
        return data.content
    }
    const [content, _set_content] = useState(data.content)
        , { current: _refs } = useRef({} as {
            el?: HTMLElement | null
        })

    data.content = content

    _effect([_refs.el], () => {
        if (!_refs.el) {
            return
        }
        const container = _refs.el.closest("[data-spatial-node-body]") as HTMLElement | undefined
        if (!container) {
            return
        }

        container.style.overflow = "hidden"
        return () => {
            container.style.overflow = ""
        }
    })

    return (
        <textarea
            ref={el => {
                _refs.el = el
            }}
            className="w-full h-full py-1 px-2 resize-none overflow-hidden bg-transparent"
            value={content}
            onChange={el => _set_content(el.currentTarget.value ?? "")}
        />
    )

}


// ========================================
export type PayloadWithContentRenderer_Props<
    P extends PayloadWithKind<any>
>
    = & PayloadRenderer_Props<
        & P
        & HasContent<ReactNode>
        & Partial<
            HasColor
        >
    >
    & PickHtmlAttributes<"className" | "style">

export const PayloadWithContentRenderer = <
    P extends PayloadWithKind<any>
>({
    payload
    , payload: {
        color: backgroundColor
    }
    , style: style_IN
    , ...rest
}: PayloadWithContentRenderer_Props<P>
) => {

    const {
        style
    } = _memo([style_IN, backgroundColor], () => {
        backgroundColor ??= getRandomColour().toRgbString()
        return {
            style: {
                ...style_IN
                , backgroundColor
            }
        }
    })
    return (
        <div
            {...rest}
            className={_cn(`
                w-full h-full 
                text-center 
                items-center 
                content-center
                overflow-hidden
                `
                , rest.className
            )}
            style={style}
        >
            <ContentDisplay
                data={payload}
            />
        </div>
    )
}

    // ========================================

    , ObjectViewPayloadRenderer = <
        P extends PayloadWithKind<any>
    >({
        payload
    }: PayloadRenderer_Props<P>
    ) => <ObjectView
            data-object-view-payload-renderer
            data={payload}
        />

