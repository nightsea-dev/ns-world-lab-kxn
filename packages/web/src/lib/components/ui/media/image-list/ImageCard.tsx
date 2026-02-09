import { HasData, HasChildren, PartialEventHandlersWithKindFromMap, Size } from "@ns-world-lab-knx/types"
import { Input, InputProps } from "rsuite"
import { Box, NoData } from "../../_basic"
import { ImageInfo, ImageRenderer, ImageRendererProps } from "./ImageRenderer"
import { ReactNode } from "react"
import { _cn } from "../../../../utils"
import { _isNumber } from "@ns-world-lab-knx/logic"

// ======================================== events
export type ImageCardEvent = HasData<ImageInfo>

export type ImageCardEventsMap = {
    rename: ImageCardEvent
}

export type ImageCardDisplayMode = "card" | "row"

// ======================================== props
export type ImageCardProps =
    & ImageRendererProps
    & Partial<
        & {
            isReadonly: boolean
            displayMode: ImageCardDisplayMode
        }
        & Size
        & HasChildren<ReactNode>
    >
    & PartialEventHandlersWithKindFromMap<ImageCardEventsMap>

// ======================================== component
export const ImageCard: ImageRenderer<ImageCardProps> = ({
    data
    , children
    , width
    , height
    , displayMode = "card"
    , onRename
    , isReadonly = !onRename
    , ...rest
}) => {
    const fixed = _isNumber(width) ? width : 200
        , isRow = displayMode === "row"

        , _handleNameChange: InputProps["onChange"] = (value) => {
            const new_name = String(value ?? "").trim()
            if (!new_name.length || !onRename || data.name === new_name) return
            onRename({
                data: { ...data, name: new_name },
                eventKind: "rename",
            })
        }

    return !data ? (
        <NoData />
    ) : (
        <Box
            {...rest}
            key={data.src}
            data-image-card
            data-width={fixed}
            className={_cn(`
                border border-gray-200 rounded-md
                overflow-hidden
                p-2
                w-full
      `)}
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
            {/* LEFT (fixed in row; full in card) */}
            <div
                className={_cn(`
                    aspect-video
                    bg-gray-50 rounded
                    flex items-center justify-center
                    overflow-hidden
                    `)}
                style={isRow ? { width: fixed } : { width: "100%" }}
            >
                <img
                    src={data.src}
                    alt={data.name}
                    draggable={false}
                    className={_cn(`w-full h-full object-contain`)}
                />
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
