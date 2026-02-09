import { MouseEvent, Ref, RefCallback, RefObject, useId, useLayoutEffect } from "react";
import CloseIcon from '@rsuite/icons/Close';
import { _cn, PickHtmlAttributes } from "../../../utils";


// const CONST = {
//     position: 10
//     , size: 10
//     , inner: 20
// }

export type CloseButtonRef = RefCallback<HTMLElement | undefined | null>
export type HasCloseButtonRef = {
    closeButtonRef: CloseButtonRef
}

// ======================================== props
export type CloseButtonProps =
    & Partial<
        & {
            debugMode?: boolean
        }
        & HasCloseButtonRef
    >
    & PickHtmlAttributes<"onClick" | "className" | "style" | "onPointerDownCapture">


// ======================================== component
export const CloseButton = ({
    debugMode
    , className
    , closeButtonRef
    , onClick
    , ...rest
}: CloseButtonProps
) => {
    const id = useId()

        , _handleClick = (
            ev: MouseEvent<HTMLElement>
        ) => {
            ev.preventDefault()
            ev.stopPropagation()
            onClick?.(ev)
        }

    return (
        <div
            {...rest}
            id={id}
            data-close-button
            role="button"
            ref={closeButtonRef}
            className={_cn(
                `
                border 
                border-gray-200 
                text-black
                top-1 right-1 z-10
                inline-flex items-center justify-center
                h-6 w-6 rounded-md
                cursor-pointer!
                select-none
                hover:bg-gray-200 
                [&:hover_svg]:fill-gray-500
                `
                , className
            )}

            style={{
                border: "1px solid rgba(0,0,0,.05)"
            }}
            aria-label="Close"
            onClick={_handleClick}
        >
            <CloseIcon
                className={`
                    object-fill 
                    fill-gray-200 
                    hover:fill-gray-500
                    cursor-default
                    `}
            />
        </div>
    )

}
