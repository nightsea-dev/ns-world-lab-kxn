export const SIZE_KEYS = ["width", "height"] as const
export type SizeKey = (typeof SIZE_KEYS)[number]

export type Size =
    {
        [k in SizeKey]: number
    }



export type HasSize = {
    size: Size
}


export type HasDimentions = {
    dimensions?: Size
}
