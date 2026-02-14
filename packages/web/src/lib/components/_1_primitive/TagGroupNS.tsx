import { HasData } from "@ns-world-lab/types"
import { _memo } from "../../utils"
import { ReactNode } from "react"
import { _colours } from "@ns-world-lab/logic"

// ======================================== props
export type TagGroupNSProps<
    T extends ReactNode = ReactNode
> =
    & HasData<T[]>
    & Partial<{
        withRandomColour: boolean
    }>

// ======================================== component
export const TagGroupNS = <
    T extends ReactNode = ReactNode
>({
    data
    , withRandomColour
    , ...rest
}: TagGroupNSProps<T>
) => {
    const C = _memo([withRandomColour], () => withRandomColour ? _colours.getRandomColourRgbString.bind(_colours) : undefined)
    return (
        <div
            {...rest}
            className="block"
        >
            {data.map((v, i) => (
                <div
                    key={[v, i].join("|")}
                    // color={_c?.()}
                    className="inline"
                    style={{
                        backgroundColor: C?.()
                    }}
                >{v}</div>
            ))}
        </div>
    )
}
