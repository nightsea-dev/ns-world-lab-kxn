import { FunctionComponent, ReactNode, useRef, useState } from "react"
import {
    HasColor
    , HasContent
    , HasPayloadWithKind
    , PayloadWithKind
} from "@ns-world-lab-knx/types"
import {
    ObjectView
} from "../../ui"
import { _cn, _effect, _memo, PickHtmlAttributes } from "../../../utils"
import { _isString, getRandomColour } from "@ns-world-lab-knx/logic"

// ======================================== types

export type CreatePayloadFn<
    P extends PayloadWithKind<any>
> = () => P

export type HasCreatePayloadFn<
    P extends PayloadWithKind<any>
> = {
    createPayloadFn: CreatePayloadFn<P>
}

export type CreatePayloadFnMap<
    P extends PayloadWithKind<any>
> = {
        [kind in P["kind"]]: CreatePayloadFn<P>
    }

export type HasCreatePayloadFnMap<
    P extends PayloadWithKind<any>
> = {
    createPayloadFnMap: CreatePayloadFnMap<P>
}


// ======================================== PayloadRenderer
export type PayloadRendererProps<
    P extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<P>

export type PayloadRenderer<
    P extends PayloadWithKind<any>
> = FunctionComponent<
    PayloadRendererProps<P>
>

export type HasPayloadRenderer<
    P extends PayloadWithKind<any>
> = {
    payloadRenderer?: PayloadRenderer<P>
}

// ======================================== PayloadRenderers
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


export type PayloadWithContentRendererProps<
    P extends PayloadWithKind<any>
>
    = & PayloadRendererProps<
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
}: PayloadWithContentRendererProps<P>
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

    , ObjectViewPayloadRenderer = <
        P extends PayloadWithKind<any>
    >({
        payload
    }: PayloadRendererProps<P>
    ) => (
        <ObjectView
            data={payload}
        />
    )

