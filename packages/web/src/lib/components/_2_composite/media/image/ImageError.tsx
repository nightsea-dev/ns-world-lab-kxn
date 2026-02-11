import { HasChildren, HasData, HasError, HasUrl } from "@ns-world-lab/types"
import { HasImageInfo, ImageInfo } from "../../../../types"
import { ReactNode } from "react"



const ERROR_SVG = (
    <svg
        viewBox="0 0 24 24"
        className="h-8 w-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
    >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 15l4-4 4 4 6-6 4 4" />
    </svg>
)

const BG_SVG = (
    <svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
    >
        <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
)


const BgErrorImage = ({
    children
    , url = "/images/placeholders/abstract-gradient.jpg"
}:
    & HasChildren<ReactNode>
    & HasUrl
) => {

    return (
        <>
            <div
                className="
                    absolute inset-0
                    bg-cover bg-center
                    opacity-40
                    "
                style={{
                    backgroundImage:
                        `url(${url}})`
                }}
            />

            {/* Soft overlay for legibility */}
            <div className="absolute inset-0 bg-white/50" />

            {/* Foreground content */}
            <div
                className="
                    relative
                    z-10
                    flex
                    h-full
                    flex-col
                    items-center
                    justify-center
                    text-center
                    text-gray-700
                    text-xs
                    px-3
                    select-none
        "
            >
                {children}
            </div>
        </>

    )

}




export type ImageErrorProps
    =
    & HasData<ImageInfo>
    & HasError


export const ImageErrorPlaceholder = ({
    data: imageInfo
    , error
    , ...rest
}: ImageErrorProps) => {
    return (
        <div
            {...rest}
            role="img"
            aria-label="Image failed to load"
            className="
                flex
                items-center
                justify-center
                bg-gray-50
                border
                border-dashed
                border-gray-300
                rounded-md
                w-full
                h-full
                text-gray-600
                text-xs
                select-none
            "
        >
            <div className="flex flex-col items-center gap-1 px-2 text-center max-w-full">
                {ERROR_SVG}
                <div className="font-medium">
                    Image unavailable
                </div>

                {imageInfo.name && (
                    <div className="opacity-70 truncate max-w-full">
                        {imageInfo.name}
                    </div>
                )}

                <div className="mt-1 text-[11px] opacity-60">
                    {error.name}: {error.message}
                </div>
            </div>
        </div>
    )
}
