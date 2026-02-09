import React, { type CSSProperties, FunctionComponent, isValidElement, type ReactNode, useRef } from "react"
import { NoData } from "./NoData"
import { HasData, HasDepth, HasHeader, PickAndPrefixKeys, PickAndSuffixKeys, PrefixKeys, PrimitiveValue } from "@ns-world-lab-knx/types"
import {
    _colours, _isEmpty, _isIterable, entriesOf, EntriesOfOptions
    , _isStringArray
} from "@ns-world-lab-knx/logic"
import { _memo, CssPosition, PickCssProperties, PickHtmlAttributes } from "../../../utils"
import { Renderer } from "../../../types"
import { TagGroupNS, TagGroupNSProps } from "./TagGroupNS"
import { HeaderNS } from "./HeaderNS"




// ========================================

// ======================================== const
const DEFAULT = {
    cssPosition: {
        top: 150
        , left: 50
    }
} as {
    cssPosition: CssPosition
}
// ========================================


// ======================================== types
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
        & {
            showStringArraysAsTags: boolean
            showOnlyArrayLength: boolean
            showEmptyProperties: boolean
            fixedAt: CssPosition
            relative: boolean
            absolute: boolean
            grayHeader: boolean
        }
        & PickAndSuffixKeys<"Keys", EntriesOfOptions, "sorted">
        & PickCssProperties<"maxWidth" | "maxHeight"
            | "top" | "left" | "right" | "bottom"
        >
        & PickHtmlAttributes<"className" | "style" | "onDoubleClick">

        & PrefixKeys<"stringTags_", Pick<TagGroupNSProps<string>, "withRandomColour">>
    >

type ObjectViewPropsWithDepth<
    T extends ObjectViewValue
> =
    & Partial<
        & ObjectViewProps<T>
        & HasDepth
    >


// ======================================== props - ObjectViewValue
type ObjectViewValueProps<
    T extends ObjectViewValue
> =
    & {
        v: unknown
        objectRenderer: Renderer<
            & Omit<ObjectViewValueProps<T>, "v">
            & HasData<ObjectViewValue>
        >
    }
    & Pick<ObjectViewPropsWithDepth<T>,
        | "depth"
        | "stringTags_withRandomColour"
        | "showStringArraysAsTags"
        | "showEmptyProperties"
        | "showOnlyArrayLength"
        | "sortedKeys"
    >

// ======================================== component - ObjectViewValue
const ObjectViewValue = <
    T extends ObjectViewValue
>({
    v
    , depth = 0
    , showStringArraysAsTags
    , stringTags_withRandomColour
    , showOnlyArrayLength
    , showEmptyProperties
    , sortedKeys
    , objectRenderer: ObjectRenderer
}: ObjectViewValueProps<T>
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

    if (_isStringArray(v)) {
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
        : isValidElement(v)
            ? v
            : typeof v === "object"
                ? <ObjectRenderer
                    data={v}
                    objectRenderer={ObjectRenderer}
                    {...{
                        depth: depth + 1
                        , showStringArraysAsTags
                        , stringTags_withRandomColour
                        , showOnlyArrayLength
                        , showEmptyProperties
                        , sortedKeys
                    }}
                />
                : String(v)

}

// ========================================
export const ObjectView = <
    T extends ObjectViewValue
>({
    data: data
    , header
    , grayHeader
    , absolute
    , relative = !absolute //true
    , top
    , right
    , bottom
    , left
    , fixedAt = relative ? undefined : {
        top
        , right
        , bottom
        , left
    }
    , maxWidth = "100vw"
    , maxHeight = "100vh"
    , sortedKeys
    , showStringArraysAsTags
    , showOnlyArrayLength
    , showEmptyProperties = true
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
            cellPadding={0}
            cellSpacing={0}
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
                    border-slate-600
                    rounded-md
                    overflow-hidden

                    bg-white
                    text-xs
                    text-slate-700
                    shadow-2xl
                    cursor-default
                    p-0
                    ${rest.className ?? ""}
        `}
        >
            {header && (
                <thead>
                    <tr>
                        <th
                            colSpan={2}
                        >
                            <HeaderNS
                                data={header}
                                bgColour={
                                    grayHeader
                                        ? "gray-200"
                                        : undefined}
                            />
                        </th>
                    </tr>
                </thead>
            )}

            <tbody>
                {entriesOf(data, { sorted: sortedKeys }).
                    map(([k, v], i) => {

                        if (!showEmptyProperties && _isEmpty(v)) {
                            return undefined
                        }

                        return (
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
                                        <ObjectViewValue {...{
                                            v
                                            , depth
                                            , showStringArraysAsTags
                                            , stringTags_withRandomColour
                                            , showOnlyArrayLength
                                            , showEmptyProperties
                                            , sortedKeys
                                            , objectRenderer: ObjectView
                                        }} />
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
            </tbody>
        </table>

    )
}
