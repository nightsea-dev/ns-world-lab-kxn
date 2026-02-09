import { FunctionComponent, ReactNode } from "react"
import {
    HasColor
    , HasContent
    , HasPayloadWithKind
    , PayloadWithKind
} from "@ns-lab-knx/types"
import {
    ObjectView
} from "../ui"
import { _cn, _memo, PickHtmlAttributes } from "../../utils"
import { getRandomColour } from "@ns-lab-knx/logic"

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

export const PAYLOAD_RENDERERS = {
    WithContentRenderer: <
        P extends PayloadWithKind<any>
    >({
        payload
        , payload: {
            color: backgroundColor
        }
        , style: style_IN
        , ...rest
    }:
        & PayloadRendererProps<
            P
            & HasContent<ReactNode>
            & Partial<
                HasColor
            >
        >
        & PickHtmlAttributes<"className" | "style">
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
                className={_cn(
                    "w-full h-full text-center items-center content-center"
                    , rest.className
                )}
                style={style}
            >
                {payload.content}
            </div>
        )
    }
    , ObjectViewRenderer: <
        P extends PayloadWithKind<any>
    >({
        payload
    }: PayloadRendererProps<P>
    ) => (
        <ObjectView
            data={payload}
        />
    )
}


