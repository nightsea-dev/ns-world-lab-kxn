import React, { type CSSProperties, type ReactNode, useRef } from "react"
// import { TagGroup, Tag } from "rsuite"
import { NoData } from "./NoData"
import { _memo, CssPosition, PickCssProperties, PickHtmlAttributes } from "../../utils"
import { HasData, HasDepth, HasHeader, PickAndPrefixKeys, PickAndSuffixKeys, PrefixKeys, PrimitiveValue } from "@ns-lab-klx/types"
import { _colours, entriesOf, EntriesOfOptions } from "@ns-lab-klx/logic"



// ========================================

// ========================================
const DEFAULT = {
    cssPosition: {
        top: 150
        , left: 50
    }
} as {
    cssPosition: CssPosition
}
// ========================================
const isStringArray = (v: unknown): v is string[] =>
    Array.isArray(v) && v.every(v => (typeof v) === "string")

export type TagGroupNSProps =
    & HasData<string[]>
    & Partial<{
        withRandomColour: boolean
    }>

export const TagGroupNS = ({
    data
    , withRandomColour
    , ...rest
}: TagGroupNSProps
) => {
    const _c = _memo([withRandomColour], () => withRandomColour ? _colours.getRandomColourRgbString.bind(_colours) : undefined)
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
                        backgroundColor: _c?.()
                    }}
                >{v}</div>
            ))}
        </div>
    )
}

// ========================================
export type ObjectViewValue =
    | object
    | {
        [k: string]: PrimitiveValue | ReactNode | ObjectViewValue
    }

// ========================================
export type ObjectViewProps<
    T extends ObjectViewValue
> =
    & Partial<
        & HasData<T>
        & HasHeader<ReactNode>
        // & HasTitle
        & {
            showStringArraysAsTags: boolean
            showOnlyArrayLength: boolean
            fixedAt: CssPosition
            relative: boolean
        }
        & PickAndSuffixKeys<"Keys", EntriesOfOptions, "sorted">
        & PickCssProperties<"maxWidth" | "maxHeight" | "top" | "left">
        & PickHtmlAttributes<"className" | "style" | "onDoubleClick">

        & PrefixKeys<"stringTags_", Pick<TagGroupNSProps, "withRandomColour">>
    >

type ObjectViewPropsWithDepth<
    T extends ObjectViewValue
> =
    & Partial<
        & ObjectViewProps<T>
        & HasDepth
    >


type _getValueProps<
    T extends ObjectViewValue
> =
    & {
        v: unknown
    }
    & Pick<ObjectViewPropsWithDepth<T>,
        | "depth"
        | "stringTags_withRandomColour"
        | "showStringArraysAsTags"
        | "showOnlyArrayLength"
        | "sortedKeys"
    >

const _isIterable = <
    T extends any
>(v: unknown): v is Array<T> | Set<T> => Array.isArray(v) || (v instanceof Set)

const _getValue = <
    T extends ObjectViewValue
>({
    v
    , depth = 0
    , showStringArraysAsTags
    , stringTags_withRandomColour
    , showOnlyArrayLength
    , sortedKeys
}: _getValueProps<T>
): ReactNode => {

    if (showOnlyArrayLength && _isIterable(v)) {

        const len = Array.isArray(v)
            ? v.length
            : v instanceof Set
                ? v.size
                : undefined

        if (len === undefined) {
            debugger
            const err = new Error(`Something's wrong. [len === undefined]`)
            console.error(err)
            throw err
        }

        return `${len} item${len === 1 ? "" : "s"}`

    }

    if (isStringArray(v)) {
        if (showStringArraysAsTags) {
            return (
                <TagGroupNS
                    data={v}
                    withRandomColour={stringTags_withRandomColour}
                />)
        }
    }


    return (v === undefined || v === null)
        ? "- - -"
        : React.isValidElement(v)
            ? v
            : typeof v === "object"
                ? <ObjectView
                    data={v}
                    {...{
                        depth: depth + 1
                        , showStringArraysAsTags
                        , stringTags_withRandomColour
                        , showOnlyArrayLength
                        , sortedKeys
                    }}
                />
                : String(v)


}
// ========================================
export const ObjectView = <
    T extends ObjectViewValue
>({
    data
    , header
    , relative = true
    , top
    , left
    , fixedAt = relative ? undefined : { top, left }
    , maxWidth = "100vw"
    , maxHeight = "100vh"
    , sortedKeys
    , showStringArraysAsTags
    , showOnlyArrayLength
    , stringTags_withRandomColour
    , ...rest
}: ObjectViewProps<T>
) => {

    if (!data) {
        return <NoData />
    }

    const {
        depth = 0
    } = rest as ObjectViewPropsWithDepth<T>

    if (!relative && !fixedAt && depth <= 0) {
        fixedAt = DEFAULT.cssPosition
    }

    const style2: React.CSSProperties | undefined
        = relative
            ? {
                position: "relative"
            }
            : fixedAt
                ? {
                    position: "fixed"
                    , ...fixedAt
                }
                : {
                    position: "relative"
                }


    return (
        <table
            {...rest}
            data-object-view
            style={{
                ...rest.style
                , ...style2
                , maxWidth
                , maxHeight
                , zIndex: 100
            }}
            className={`
                    border
                    relative
                    border-slate-200
                    rounded-md
                    overflow-hidden

                    bg-white
                    text-xs
                    text-slate-700
                    shadow-2xl
                    cursor-default

                    ${rest.className ?? ""}
      `}
        >
            {header && (
                <thead>
                    <tr>
                        <th
                            colSpan={2}
                            style={{
                                backgroundColor: "dodgerblue"
                                , color: "white"
                                , fontSize: 16
                            }}
                        >
                            {header}
                        </th>
                    </tr>
                </thead>
            )}

            <tbody>
                {entriesOf(data, { sorted: sortedKeys }).map(([k, v], i) => (
                    <tr key={k}
                        className={`hover:bg-gray-100 transition-colors duration-[.1s]
                        ${i % 2 === 0 ? "bg-slate-50/50" : ""}                       `

                        }>
                        <td className="align-top border-t border-slate-200">
                            <div className="px-2 py-1 font-medium break-all text-slate-600">
                                {k}:
                            </div>
                        </td>

                        <td className="align-top border-t border-slate-200">
                            <div className="px-2 py-1 break-all">
                                {_getValue({
                                    v
                                    , depth
                                    , showStringArraysAsTags
                                    , stringTags_withRandomColour
                                    , showOnlyArrayLength
                                    , sortedKeys
                                })}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
