import { KeyOf, ValueOf } from "../../../ts"

// ========================================
export type EXTENSION_TO_MIME = {
    // images
    jpg: "image/jpeg"
    jpeg: "image/jpeg"
    png: "image/png"
    gif: "image/gif"
    webp: "image/webp"
    svg: "image/svg+xml"
    bmp: "image/bmp"

    // data
    pdf: "application/pdf"
    json: "application/json"
    csv: "text/csv"
    txt: "text/plain"

    // video
    mp4: "video/mp4"
    webm: "video/webm"
}

export type MIME_EXT = KeyOf<EXTENSION_TO_MIME>
export type MIME_TYPE = ValueOf<EXTENSION_TO_MIME>

// ========================================
export type IMAGE_MIME = Extract<
    MIME_TYPE,
    `image/${string}`
>
export type EXT_TO_IMAGE_MIME = {
    [K in MIME_EXT as EXTENSION_TO_MIME[K] extends IMAGE_MIME
    ? K : never
    ]: EXTENSION_TO_MIME[K]
}
export type IMAGE_EXT = KeyOf<EXT_TO_IMAGE_MIME>



// ======================================== 
export type MEDIA_MIME = Extract<
    MIME_TYPE,
    | `image/${string}`
    | `video/${string}`
>
export type EXT_TO_MEDIA_MIME = {
    [K in MIME_EXT as EXTENSION_TO_MIME[K] extends MEDIA_MIME
    ? K : never
    ]: EXTENSION_TO_MIME[K]
}
export type MEDIA_EXT = KeyOf<EXT_TO_MEDIA_MIME>

// ======================================== consts
export const EXT_TO_IMAGE_MIME = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    bmp: "image/bmp",
} as const satisfies EXT_TO_IMAGE_MIME

    , EXT_TO_MEDIA_MIME = {
        ...EXT_TO_IMAGE_MIME
        , mp4: "video/mp4"
        , webm: "video/webm"
    } as const satisfies EXT_TO_MEDIA_MIME

    , EXTENSION_TO_MIME = {
        ...EXT_TO_MEDIA_MIME
        , pdf: "application/pdf"
        , json: "application/json"
        , csv: "text/csv"
        , txt: "text/plain"
    } as const satisfies EXTENSION_TO_MIME

// ======================================== capabilities
export type HasMimeType = {
    mimeType: MIME_TYPE | string
}
