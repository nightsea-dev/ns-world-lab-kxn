import { ButtonGroup, ButtonProps, ButtonGroupProps, Button } from "rsuite"
import { _capitalise, entriesOf } from "@ns-world-lab/logic"
import { EntryItem, KeyOf, PickRequiredRestPartial, XOR, XOR_3 } from "@ns-world-lab/types"
import React, {
    Children, ComponentProps, ComponentType, FunctionComponent
    , HTMLAttributes, isValidElement, ReactElement, ReactNode
} from "react"
import { _cn, _filterElementsOfType, _memo } from "../../../../utils"
import { Box, BoxProps } from "../../../_1_primitive"

// ======================================== types
export type ButtonIsDisabledFn<
    K extends string
> = (k: K) => boolean


export type ButtonIsDisabledFnMap<
    K extends string
> = Partial<
    Record<K, ButtonIsDisabledFn<K>>
>

/**
 * * [value] = ButtonIsDisabledFn<K> | boolean
 * * [input_map]
 */
export type ButtonIsDisabledInputMap<
    K extends string
> = Partial<
    Record<K, ButtonIsDisabledFn<K> | boolean>
>



// ======================================== component - ButtonRS
export type ButtonRSProps = ButtonProps
export const ButtonRS = (
    props: ButtonProps
) => (
    <Button
        appearance="subtle"
        size="sm"
        {...props}
        className={_cn(
            `
            cursor-default
            `
            , props.className
        )}
        style={{
            cursor: "default"
            , ...props.style
        }}
    />)

export type ButtonRS_Element =
    React.ReactElement<
        ComponentProps<typeof ButtonRS>
        , typeof ButtonRS
    >


// ======================================== types - ButtonGroupRS
export type ButtonGroupMapValue
    = ButtonProps["onClick"] | ButtonProps

export type ButtonGroupEntryItem
    = EntryItem<string, ButtonGroupMapValue>

export type ButtonGroupEntries
    = ButtonGroupEntryItem[]

export type ButtonsMap<
    K extends string = string
> = {
        [k in K]: ButtonGroupMapValue
    }

export type ButtonGroupInput =
    | ButtonsMap
    | ButtonGroupEntries

type ButtonRSChildren = ButtonRS_Element | ButtonRS_Element[] | null | false


type Props_Base = {
    /**
     * * Common [ButtonProps]
     */
    buttonProps: ButtonProps
    showOnlyIfOnClickHandlerExists: boolean
    capitalise: boolean
}

// ==================== props/Props_ButtonGroup
type Props_ButtonGroup_Base =
    & {
        wrapperType?: "ButtonGroup"
    }
    & XOR<
        {
            buttons: ButtonGroupInput
            children?: ButtonRSChildren
        }
        , {
            children: ButtonRSChildren
        }
    >

type Props_ButtonGroup =
    & Props_ButtonGroup_Base
    & Omit<ButtonGroupProps, KeyOf<Props_ButtonGroup_Base>>

// ==================== props/Props_Box
type Props_Box_Base =
    & {
        wrapperType: "Box"
    }
    & XOR<
        {
            buttons: ButtonGroupInput
        }
        , {
            children: ButtonRSChildren
        }
    >

type Props_Box =
    & Props_Box_Base
    & Omit<BoxProps, KeyOf<Props_Box_Base>>



// ========================================  props
export type ButtonGroupRSProps =
    & Partial<
        Props_Base
    >
    & Omit<
        XOR<
            Props_ButtonGroup,
            Props_Box
        >
        , KeyOf<Props_Base>
    >


const { } = {
    wrapperType: "Box"
} as ButtonGroupRSProps


// ======================================== component - ButtonGroupRS
export const ButtonGroupRS = ({
    buttons: buttonsInput
    , buttonProps: common_buttonProps
    , children: children_IN
    , showOnlyIfOnClickHandlerExists
    , size
    , capitalise = true
    , wrapperType = "ButtonGroup"
    , ...rest
}: ButtonGroupRSProps
) => {

    const {
        validElements: children
    } = _filterElementsOfType({
        fcType: ButtonRS
        , children: children_IN
        , throwError: false
    })
        , { entries } = _memo([
            size
            , buttonsInput
            , showOnlyIfOnClickHandlerExists
            , capitalise
        ], () => {

            return !buttonsInput
                ? {}
                : {
                    entries: (
                        Array.isArray(buttonsInput)
                            ? buttonsInput
                            : entriesOf(buttonsInput)
                    ).map(([k, v], i) => {

                        const buttonProps = (
                            typeof (v) === "function"
                                ? {
                                    onClick: v
                                }
                                : v
                        ) as ButtonProps

                            ; !size || (buttonProps.size = size)

                        if (showOnlyIfOnClickHandlerExists
                            && !buttonProps.onClick
                        ) {
                            debugger
                            return
                        }

                        return [
                            capitalise ? _capitalise(k) : k
                            , buttonProps
                        ] as EntryItem<string, ButtonProps>
                    }).filter(Boolean) as EntryItem<string, ButtonProps>[]
                }

        })

        , W = (wrapperType === "Box" ? Box : ButtonGroup) as (
            (p: ButtonGroupProps) => ReactNode
        )


    return (
        <W
            {...rest}
            className={_cn(`
                rounded-md
                ---flex
                ---flex-nowrap
                `
                , rest.className
            )}
            data-button-group-rs
            style={{
                display: wrapperType === "ButtonGroup" ? "flex" : undefined
                , ...rest.style
            }}
        >
            {entries?.map(([k, p], i) => {
                return (
                    <ButtonRS
                        {...common_buttonProps}
                        key={k}
                        children={k}
                        {...p}
                        data-button-group-rs-button-item
                        className={_cn(
                            `cursor-default`
                            , common_buttonProps?.className
                            , p.className
                        )}
                    />
                )
            })}
            {children}
        </W>
    )
}



// ======================================== ButtonCollectionRS/props
type BaseButtonCollectionRSProps =
    & PickRequiredRestPartial<
        Pick<
            ButtonGroupRSProps,
            | "buttonProps"
            | "buttons"
        >
        , "buttons"
    >
export type ButtonCollectionRSProps =
    & Omit<
        & BaseButtonCollectionRSProps
        & Omit<BoxProps, KeyOf<BaseButtonCollectionRSProps>>
        , "children"
    >


// ======================================== ButtonCollectionRS/component
export const ButtonCollectionRS = (
    props: ButtonCollectionRSProps
) => {

    return (
        <ButtonGroupRS
            {...props}
            wrapperType="Box"
        />
    )

}