import { HasData, HasChildren, PartialEventHandlersWithKindFromMap, Size } from "@ns-world-lab/types"
import { Input, InputProps } from "rsuite"
import { Box, NoData } from "../../../_1_primitive"
import { ImgHTMLAttributes, ReactNode, useReducer } from "react"
import { _cn, _use_state } from "../../../../utils"
import { _isNumber } from "@ns-world-lab/logic"
import { useImageExtent, UseImageExtentInput } from "../../../../hooks"
import { ImageErrorPlaceholder } from "./ImageError"
import { ImageInfo, ImageRenderer, ImageRendererProps } from "../../../../types"

// ======================================== events
export type ImageCard_Event
    = HasData<ImageInfo>

export type ImageCard_EventsMap = {
    rename: ImageCard_Event
}

export type ImageCardDisplayMode = "card" | "row"

// ======================================== props
export type ImageCard_Props =
    & ImageRendererProps
    & Partial<
        & {
            isReadonly: boolean
            displayMode: ImageCardDisplayMode
        }
        & Size
        & HasChildren<ReactNode>
    >
    & PartialEventHandlersWithKindFromMap<ImageCard_EventsMap>

// ======================================== component
export const ImageCard: ImageRenderer<ImageCard_Props> = ({
    data
    , children
    , width
    , height
    , displayMode = "card"
    , onRename
    , isReadonly = !onRename
    , onError
    , ...rest
}) => {

    const [state, _set_state] = _use_state({} as {
        error?: Error
    })
        , error = data.error ?? state.error

        , fixed = _isNumber(width) ? width : 200
        , isRow = displayMode === "row"

        , extent = !data.extent ? undefined : [data.extent.width, data.extent.height].join("x")

        , _handleNameChange: InputProps["onChange"] = (value) => {
            const new_name = String(value ?? "").trim()
            if (!new_name.length || !onRename || data.name === new_name) return
            onRename({
                data: { ...data, name: new_name },
                eventKind: "rename",
            })
        }
        , _handle_Error: UseImageExtentInput["onError"]
            = (ev) => {
                const {
                    data//: imageInfo
                    , error
                } = ev
                // debugger
                _set_state({ error })
                    ;
                ; !onError || setTimeout(() => onError(ev))

            }
        , imageExtentHandlers = useImageExtent({
            data: data
            , onError: _handle_Error
        })

    return !data ? (
        <NoData />
    ) : (
        <Box
            {...rest}
            key={data.src}
            data-image-card
            data-width={fixed}
            data-has-error={!!state.error}
            title={extent}
            className={_cn(`
                border border-gray-200 rounded-md
                overflow-hidden
                p-2
                w-full
      `
                , error ? "border-dashed border-2 border-red-500" : undefined
            )}
            childrenContainerProps={{
                className: _cn(
                    isRow
                        ? "grid gap-1 items-center"
                        : "flex flex-col gap-1"
                ),
                style: isRow
                    ? { gridTemplateColumns: `${fixed}px minmax(0, 1fr)` }
                    : undefined,
            }}
        >

            <div
                className={_cn(`
                    aspect-video
                    bg-gray-50 rounded
                    flex items-center justify-center
                    overflow-hidden
                    `

                )}
                style={isRow ? { width: fixed } : { width: "100%" }}
            >
                {error
                    ? <ImageErrorPlaceholder
                        data={data}
                        error={error}
                    />
                    : <img
                        src={data.src}
                        alt={data.name}
                        draggable={false}
                        className={_cn(`w-full h-full object-contain`)}
                        {...imageExtentHandlers}
                    />
                }
            </div>

            {isRow ? (
                <div className={_cn(`min-w-0`)}>
                    {isReadonly ? (
                        <div
                            className={_cn(`
                                border border-gray-200 rounded-[5px]
                                px-1 py-0.5
                                text-left
                                break-words
                                min-w-0
                            `)}
                        >
                            {data.name}
                        </div>
                    ) : (
                        <Input
                            type="text"
                            value={data.name}
                            onChange={_handleNameChange}
                            placeholder="Name"
                            className={_cn(`min-w-0`)}
                        />
                    )}

                    {children}
                </div>
            ) : (
                <>
                    {isReadonly ? (
                        <div
                            className={_cn(`
                                border border-gray-200 rounded-[5px]
                                px-1 py-0.5
                                text-center
                                break-words
              `)}
                        >
                            {data.name}
                        </div>
                    ) : (
                        <Input
                            type="text"
                            value={data.name}
                            onChange={_handleNameChange}
                            placeholder="Name"
                        />
                    )}

                    {children}
                </>
            )}
        </Box>
    )
}
