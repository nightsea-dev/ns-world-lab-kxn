import { FunctionComponent, isValidElement, ReactNode } from "react"
import { Drawer, DrawerProps } from "rsuite"
import { _cn, _memo } from "../../../utils"
import { NoData } from "../_basic"
import { HasBody, HasHeader, XOR } from "@ns-lab-knx/types"



// ======================================== types
export type DrawerInfo<
    P extends object | unknown = unknown
> =
    & HasHeader<ReactNode>
    & HasBody<
        XOR<
            ReactNode
            , FunctionComponent<P>
        >
    >

// ======================================== props
export type DrawerRSProps =
    & DrawerProps
    & Partial<
        & DrawerInfo
        & {
            showNoData: boolean
        }
    >

// ======================================== component
export const DrawerRS = ({
    showNoData
    , className
    , header
    , children
    , body: body_IN = children
    , ...rest
}: DrawerRSProps
) => {
    const { B } = _memo([body_IN], () => {

        if (isValidElement(body_IN)) {
            return {
                B: () => body_IN
            }
        }
        if (typeof (body_IN) === "function") {
            return {
                B: body_IN
            }
        }
        return {
            // B: () => <></>
        }
    })

    return (
        <Drawer
            backdrop="static"
            placement='left'
            centered
            {...rest}
            // open={state.isDisabled}
            className={_cn(
                `items-center pointer-events-none`
                , className
            )}
            closeButton
        // onClose={_handleModalClose}

        // keyboard={false}
        // size="full"
        // className="pointer-events-none"
        >
            <Drawer.Header>{header}</Drawer.Header>
            {/* <Modal.Header>
                            <Modal.Title>.</Modal.Title>
                        </Modal.Header> */}
            <Drawer.Body>{
                B ? <B />
                    : (showNoData ? <NoData /> : undefined)
            }
            </Drawer.Body>

        </Drawer>
    )
}