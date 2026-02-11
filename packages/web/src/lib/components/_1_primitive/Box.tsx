import { HTMLAttributes, ReactNode, useId, useLayoutEffect, useRef } from "react"
import { _cn, _effect, _layoutEffect, _memo, OmitHtmlAttributes } from "../../utils"
import { PickRequiredRestPartial } from "@ns-world-lab-kxn/types"
import { BoxHeader, BoxHeaderProps } from "./BoxHeader"


// ======================================== props
export type BoxProps =
    & PickRequiredRestPartial<
        HTMLAttributes<HTMLDivElement>
        , "children"
    >
    & Partial<
        {
            header: ReactNode
            headerProps: BoxHeaderProps
            childrenContainerProps: OmitHtmlAttributes<"children">
            justifyChildren: "left" | "center" | "right" | boolean
            bordered: boolean
            // collapsible: boolean
            // isCollapsed: boolean
        }
    >

// ======================================== component
export const Box = ({
    bordered = true
    , children
    , childrenContainerProps
    , header
    , headerProps
    , justifyChildren
    , ...rest
}: BoxProps
) => {

    const id = useId()

        , { current: _refs } = useRef({} as {
            el?: HTMLElement | null
            header?: HTMLElement | null
            container?: HTMLElement | null
        })

        , { twJustify } = _memo([justifyChildren], () => {
            if (!justifyChildren) {
                return {}
            }
            if (justifyChildren === true) {
                justifyChildren = "center"
            }
            return {
                twJustify: `
                text-${justifyChildren} 
                items-${justifyChildren} 
                justify-${justifyChildren}
            `
            }

        })

    // _effect(() => {
    //     return
    //     if (!_refs.el || !_refs.header || !_refs.container) {
    //         return
    //     }
    //     const [el_h, h_h, c_h] = [_refs.el, _refs.header, _refs.container]
    //         .map(el => el.getBoundingClientRect().height)
    //         , max_h = el_h - h_h
    //     if (max_h > 0) {
    //         _refs.container.style.maxHeight = max_h + "px"
    //     }
    //     return () => {
    //         ; !_refs.container || (_refs.container.style.maxHeight = "")
    //     }
    // })

    return (
        <div
            {...rest}
            id={id}
            ref={(el => {
                _refs.el = el
            })}
            data-box
            data-justify-children={String(justifyChildren)}
            className={_cn(`
                ${bordered ? "border" : undefined}
                border-gray-200 
                p-0
                rounded-md
                cursor-default
                ---pt-1
                ---pb-2
                `
                , twJustify
                , rest.className
            )}
        >
            {header && (
                <BoxHeader
                    data-box-header
                    headerRef={el => {
                        _refs.header = el
                    }}
                    data={header}
                    className={_cn(`
                        py-1!
                        px-2!
                    `)}
                    bgColour="gray-100"
                />
            )}
            <div
                {...childrenContainerProps}
                data-box-children-container
                ref={el => {
                    _refs.container = el
                }}
                className={_cn(
                    `
                    p-2
                    `
                    , twJustify
                    , childrenContainerProps?.className
                )}
            >
                {children}
            </div>
        </div>
    )

}