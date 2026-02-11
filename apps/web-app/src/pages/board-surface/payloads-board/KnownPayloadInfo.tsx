import { SurfaceBoard_PayloadInfos_Map } from "@ns-world-lab/web";
import { IdeaPayloadRenderer, IFrame_InputView, IFrame_InputView_Props, IFramePayloadRenderer, Image_InputView, ImagePayloadRenderer } from "../../../components";
import { createIdeaWithAuthor } from "@ns-world-lab/logic";
import { ComponentProps } from "react";


// ======================================== renderers
export const KNOWN_PAYLOAD_RENDERERS_MAP = {
    IdeaPayloadRenderer
    , IFramePayloadRenderer
    , ImagePayloadRenderer
}
export type KNOWN_PAYLOAD_RENDERERS_MAP = typeof KNOWN_PAYLOAD_RENDERERS_MAP
export type KnownPayload_RendererKey = keyof KNOWN_PAYLOAD_RENDERERS_MAP
export type KnownPayload_Renderer = KNOWN_PAYLOAD_RENDERERS_MAP[KnownPayload_RendererKey]
export type KnownPayload_Type = ComponentProps<KnownPayload_Renderer>["payload"]

export type KnownPayload_Kind = KnownPayload_Type["kind"]
export type KnownPayloadOf<
    K extends KnownPayload_Kind
> = Extract<KnownPayload_Type, { kind: K }>


export type KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    [R in KnownPayload_Renderer as ComponentProps<R>["payload"]["kind"]]: R
}


// ======================================== renderers/impl
export const KNOWN_PAYLOAD_RENDERERS_BY_KIND = {
    idea: IdeaPayloadRenderer
    , iframe: IFramePayloadRenderer
    , image: ImagePayloadRenderer
} as KNOWN_PAYLOAD_RENDERERS_BY_KIND

// ======================================== input-views/impl
export const KNOWN_PAYLOAD_INPUT_VIEWS_BY_KIND = {
    iframe: IFrame_InputView
    , image: Image_InputView
} as const


// ======================================== payload-info/impl
export const KNOWN_SURFACEBOARD_PAYLOAD_INFOS_MAP = {
    idea: {
        factory: ({ numberOfItems }) =>
            Array.from({ length: numberOfItems })
                .map(() => createIdeaWithAuthor())
        , buttonLabel: "Add Idea"
        , payloadRenderer: IdeaPayloadRenderer
    }
    , iframe: {
        buttonLabel: "Add IFrame"
        , inputView: ({
            onCancel
            , onDone
        }) => <IFrame_InputView
                onCancel={onCancel}
                onDone={({ data }) => {
                    // transformation
                    onDone({
                        data: data.map(({
                            id
                            , name
                            , url: src
                        }) => ({
                            kind: "iframe"
                            , id
                            , name
                            , src
                        }))
                    })
                }}
            />
        , payloadRenderer: IFramePayloadRenderer
    }
    , image: {
        buttonLabel: "Add Image"
        , inputView: ({
            onCancel
            , onDone
        }) => <Image_InputView
                onCancel={onCancel}
                onDone={({
                    data
                }) => {
                    // transformation
                    onDone({
                        data: data.map(
                            loadedFileItem => ({
                                kind: "image"
                                , file: loadedFileItem
                                , name: loadedFileItem.name
                                , size: loadedFileItem.size

                                , src: loadedFileItem.url
                                , id: loadedFileItem.fileID
                                , mimeType: loadedFileItem.type
                                // , extent: loadedFileItem.
                            }))
                    })

                }}
            />
        , payloadRenderer: ImagePayloadRenderer
    }
} as SurfaceBoard_PayloadInfos_Map<KnownPayload_Type>
