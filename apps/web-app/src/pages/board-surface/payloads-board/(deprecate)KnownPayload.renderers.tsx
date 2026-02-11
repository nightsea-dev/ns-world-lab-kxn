import { ComponentProps, FunctionComponent } from "react"
import { IdeaPayloadRenderer, IFramePayloadRenderer, ImagePayloadRenderer } from "../../../components"
import { InputView_Props, SurfaceBoard_PayloadInfos_Map } from "@ns-world-lab-kxn/web"


export const KNOWN_PAYLOAD_RENDERERS_MAP = {
    IdeaPayloadRenderer
    , IFramePayloadRenderer
    , ImagePayloadRenderer
}
export type KNOWN_PAYLOAD_RENDERERS_MAP = typeof KNOWN_PAYLOAD_RENDERERS_MAP
export type KnownPayload_RendererKey = keyof KNOWN_PAYLOAD_RENDERERS_MAP
export type KnownPayload_Renderer = KNOWN_PAYLOAD_RENDERERS_MAP[KnownPayload_RendererKey]
export type KnownPayload_Type = ComponentProps<KnownPayload_Renderer>["payload"]

export type KnownPayloadKind = KnownPayload_Type["kind"]
export type KnownPayloadOf<
    K extends KnownPayloadKind
> = Extract<KnownPayload_Type, { kind: K }>


export type KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    [R in KnownPayload_Renderer as ComponentProps<R>["payload"]["kind"]]: R
}


// ========================================
export const KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    idea: IdeaPayloadRenderer
    , iframe: IFramePayloadRenderer
    , image: ImagePayloadRenderer
} as KNOWN_PAYLOAD_RENDERERS_BY_KIND



    