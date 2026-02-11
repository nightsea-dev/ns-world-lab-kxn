import { FunctionComponent, ReactNode, useRef, useState } from "react"
import {
    HasColor
    , HasContent
    , HasPayloadWithKind
    , PayloadWithKind
} from "@ns-world-lab-kxn/types"
import { _isString, getRandomColour } from "@ns-world-lab-kxn/logic"
import { _cn, _effect, _memo, PickHtmlAttributes } from "../../../../../utils"

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


// ======================================== PayloadRenderer/props
export type PayloadRenderer_Props<
    P extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<P>

// ======================================== PayloadRenderer/component-type
export type PayloadRenderer<
    P extends PayloadWithKind<any>
> = FunctionComponent<
    PayloadRenderer_Props<P>
>

// ======================================== PayloadRenderer/capability
export type HasPayloadRenderer<
    P extends PayloadWithKind<any>
> = {
    payloadRenderer: PayloadRenderer<P>
}
export type HasPartialPayloadRenderer<
    P extends PayloadWithKind<any>
> = Partial<HasPayloadRenderer<P>>









