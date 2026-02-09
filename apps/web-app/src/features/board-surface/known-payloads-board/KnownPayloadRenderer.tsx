import { ComponentProps } from "react"
import { IdeaPayloadRenderer, IFramePayloadRenderer, ImagePayloadRenderer } from "../../../components"

export const KNOWN_PAYLOAD_RENDERERS_MAP = {
    IdeaPayloadRenderer
    , IFramePayloadRenderer
    , ImagePayloadRenderer
}
export type KNOWN_PAYLOAD_RENDERERS_MAP = typeof KNOWN_PAYLOAD_RENDERERS_MAP
export type KnownPayloadRendererKey = keyof KNOWN_PAYLOAD_RENDERERS_MAP
export type KnownPayloadRenderer = KNOWN_PAYLOAD_RENDERERS_MAP[KnownPayloadRendererKey]
export type KnownPayload = ComponentProps<KnownPayloadRenderer>["payload"]

export type KnownPayloadKind = KnownPayload["kind"]
export type KnownPayloadOf<
    K extends KnownPayloadKind
> = Extract<KnownPayload, { kind: K }>

export type KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    [R in KnownPayloadRenderer as ComponentProps<R>["payload"]["kind"]]: R
}

export const KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    idea: IdeaPayloadRenderer
    , iframe: IFramePayloadRenderer
    , image: ImagePayloadRenderer
} as KNOWN_PAYLOAD_RENDERERS_BY_KIND
