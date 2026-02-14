import { ReactNode } from "react"
import { HasPlaceholder } from "@ns-world-lab/types"
import { BoolKey } from "../../../types"
import { useDroppable, UseDroppable_Input } from "../../../hooks"


export const DropArea_DEFAULT = {
    placeholders: {
        true: "Drop files here, or click to choose"
        , false: "Click to choose"
    } as const satisfies Record<BoolKey, ReactNode>
}

export type HasIsDroppable = {
    isDroppable: boolean
}

type Layout_Props =
    & {
        isDragging: boolean
    }
    & HasIsDroppable
    & Partial<
        HasPlaceholder<ReactNode>
    >




export {
    type Layout_Props as DropArea_Props
}


export namespace DropAreaLayout {
    export type FC<P = {}> = React.FC<P & Layout_Props>
}







// ======================================== components


export const DropAreaLayout: DropAreaLayout.FC = ({
    isDragging
    , isDroppable
    , placeholder
}) => {
    return (
        <div
            data-drop-area-layout
            className={`
        relative
        m-4
        rounded-lg
        border-2
        border-dashed
        transition-all
        duration-150
        flex
        items-center
        justify-center
        text-sm
        select-none

        ${!isDroppable && "opacity-40 cursor-default hover:bg-gray-200"}
        ${isDroppable && !isDragging && "border-gray-300 hover:border-amber-400"}
        ${isDragging && "border-amber-500 bg-amber-50"}
      `}
            style={{ minHeight: 140 }}
        >
            <div className="flex flex-col items-center gap-2 text-gray-600">
                <div className="text-2xl opacity-70">⬆</div>
                <div className="font-medium">
                    {isDragging ? "Drop files here" : placeholder}
                </div>
                <div className="text-xs text-gray-400 px-[30px]">
                    {DropArea_DEFAULT.placeholders[String(isDroppable) as BoolKey]}
                    {/* Click or drag files to upload */}
                </div>
            </div>
        </div>
    )
}



export const DropArea: React.FC<
    & Omit<Layout_Props, "isDragging">
    & UseDroppable_Input
> = ({
    isDroppable
    , placeholder
    , disabled
    , onDragging: onDragging_IN
    , onDrop: onDrop_IN
}) => {

        const {
            isDragging
            , getHandlers
        } = useDroppable({
            disabled
            , onDragging: onDragging_IN
            , onDrop: onDrop_IN
        })

        return <DropAreaLayout
            isDragging={isDragging}
            isDroppable={isDroppable}
            placeholder={placeholder}
            {...getHandlers()}
        />

    }






