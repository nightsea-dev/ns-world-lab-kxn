import { _cn } from "../../../utils"
import { Box, BoxProps, ControlButtons, ControlButtonsProps } from "../../ui"




// ======================================== props
export type InputViewLayoutProps =
    & BoxProps
    & {
        controlButtonsProps: ControlButtonsProps
    }



// ======================================== component
export const InputViewLayout = ({
    controlButtonsProps
    , children
    , ...rest
}: InputViewLayoutProps
) => {

    return (
        <Box
            {...rest}
            data-input-view-layout
            className={_cn(`
                h-full w-full flex flex-col gap-4 p-6 overflow-auto
                `
                , rest.className
            )}
        >

            <ControlButtons
                showInfoName="Info"
                justifyChildren="right"
                bordered={false}
                {...controlButtonsProps}
            />

            <div
                data-input-view-layout-children-container
            >
                {children}
            </div>
        </Box>
    )
}
