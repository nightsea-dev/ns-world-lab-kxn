import { Children, ComponentProps, FunctionComponent, isValidElement, ReactElement, ReactNode } from "react";
import { EventHandlersFromMap } from "@ns-world-lab-kxn/types";

export type FilterElementsOfTypeInput<
    FC extends FunctionComponent
> =
    & {
        fcType: FC
    }
    & Partial<
        & {
            children: ReactNode//ButtonGroupRSProps["children"]
            throwError: boolean
        }
    >

export const _filterElementsOfType = <
    FC extends FunctionComponent
>({
    fcType
    , children
    , throwError = true
}: FilterElementsOfTypeInput<FC>
) => {
    type TElement = React.ReactElement<
        ComponentProps<typeof fcType>
        , typeof fcType
    >
    if (!children) {
        return {}
    }

    const arr = Children.toArray(children)
        .filter(isValidElement) as ReactElement[]

        , invalidElements = arr.filter(el => el.type !== fcType)

        , error = !invalidElements.length
            ? undefined
            : Object.assign(
                new Error(`Only accepts <${fcType.name} />.`)
                // new Error("ButtonGroupRS only accepts <ButtonRS /> as children.")
                , { invalidElements }
            )

    if (error) {
        console.error(error, { invalid: invalidElements })
    }

    if (throwError) {
        throw error
    }

    return {
        validElements: arr.filter(o => !invalidElements.includes(o)) as TElement[]
        , error
        , invalidElements
    }

}
