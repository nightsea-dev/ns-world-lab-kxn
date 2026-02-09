import { HasData, HasPartialData, EventHandlersFromMap, EventHandlersWithKindFromMap, HasName, HasSource, HasId, HasPartialName, PartialEventHandlersFromMap, HasChildren, PartialEventHandlersWithKindFromMap } from "@ns-lab-knx/types"
import { Input, InputProps } from "rsuite"
import { NoData } from "../../_basic"
import { ImageInfo, ImageRenderer, ImageRendererProps } from "./ImageRenderer"
import { ReactNode } from "react"



// ======================================== events
export type ImageRowEvent =
    & HasData<ImageInfo>

export type ImageRowEventsMap = {
    rename: ImageRowEvent
}


// ======================================== props
export type ImageRowProps =
    & ImageRendererProps
    & Partial<
        & {
            isReadonly: boolean
        }
        & HasChildren<ReactNode>
    >
    & PartialEventHandlersWithKindFromMap<
        ImageRowEventsMap
    >

// ======================================== component
export const ImageRow: ImageRenderer<ImageRowProps> = ({
    data
    , children
    , onRename
    , isReadonly = !onRename
}//: ImageRowProps
) => {

    const _handleNameChange: InputProps["onChange"] = (
        value
    ) => {
        const new_name = String(value ?? "").trim()
        if (!new_name.length
            || !onRename
            || data.name === new_name
        ) {
            return
        }
        onRename({
            data: {
                ...data
                , name: new_name
            }
            , eventKind: "rename"
        })
    }

    return (
        !data
            ? <NoData />
            : <div
                key={data.src}
                className={`
                    border border-gray-200 rounded 
                    p-2 
                    flex flex-col gap-2
                    max-w-[400px]
                    overflow-hidden
                    `}
            >
                <div className={`
                    w-full
                    aspect-video 
                    bg-gray-50 rounded 
                    flex items-center 
                    justify-center 
                    overflow-hidden
                    `}>
                    <img
                        src={data.src}
                        alt={data.name}
                        className={`
                            ---max-h-[200px] 
                            ---max-w-[250px] 
                            object-contain
                            `}
                        draggable={false}
                    />
                </div>

                {isReadonly
                    ? <div
                        className="border border-gray-200 rounded-[5px] px-1 py-0.5 text-center"
                    >
                        {data.name}
                    </div>
                    : <Input
                        type="text"
                        value={data.name}
                        onChange={_handleNameChange}
                        placeholder="Name"
                    />
                }

                {children}

            </div>
    )
}

