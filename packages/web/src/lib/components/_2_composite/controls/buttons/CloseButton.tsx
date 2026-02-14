import { MouseEvent, Ref, RefCallback, RefObject, useId, useLayoutEffect } from "react";
import CloseIcon from '@rsuite/icons/Close';
import { _cn, PickHtmlAttributes } from "../../../../utils";


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
            debugMode: boolean
            size: number
        }
        & HasCloseButtonRef
    >
    & PickHtmlAttributes<"onClick" | "className" | "style" | "onPointerDownCapture">


// ======================================== component
export const CloseButton: React.FC<CloseButtonProps> = ({
    debugMode
    , className
    , closeButtonRef
    , size = 16
    , onClick
    , ...rest
}) => {
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
                top-0 right-0
                cursor-default!
                z-[100]
                inline-flex items-center justify-center
                h-[${size}] 
                w-[${size}]
                ---rounded-md
                p-1
                select-none
                hover:bg-gray-200 
                [&:hover_svg]:fill-gray-500
                transition-all duration-[.2s]
                `
                , className
            )}

            style={{
                border: "1px solid rgba(0,0,0,.05)"
            }}
            aria-label="Close"
            onClick={_handleClick}
            onPointerDownCapture={ev => ev.stopPropagation()}
        >
            <CloseIcon
                className={`
                    object-fill 
                    fill-gray-200 
                    hover:fill-gray-500
                    cursor-default
                    `}
                size={size}
            />
        </div>
    )

}
