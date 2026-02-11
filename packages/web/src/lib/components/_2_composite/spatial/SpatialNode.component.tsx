import { Rnd } from "react-rnd"
import {
    EventHandlersFromMap,
    HasChildren,
    HasData,
    HasHeader,
    HasId,
    ID,
    KeyOf,
    SIZE_KEYS,
    Transformation,
    XOR,
} from "@ns-world-lab-kxn/types"
import {
    _cn, _effect, _getById, _layoutEffect, _memo, _use_state
    , HasBackgroundColor
    , PickHtmlAttributes
} from "../../../utils"
import {
    _t,
    HasSpatialNode_UI,
    SpatialNodeClass,
} from "@ns-world-lab-kxn/logic"
import {
    ComponentProps,
    MouseEvent,
    ReactNode,
    RefCallback,
    RefObject,
    useId,
    useLayoutEffect,
    useRef
} from "react"
import {
    useSpatialNode
    , UseSpatialNodeInput
} from "../../../hooks"
import { CloseButton, CloseButtonProps, ObjectViewWithToggle } from ".."

type H = HTMLElement | undefined

type _RndProps = ComponentProps<typeof Rnd>


/**
 * * only what interests us
 */
type _RndEventKey = KeyOf<
    Pick<
        _RndProps,
        | "onDragStart"
        | "onDrag"
        | "onDragStop"
        | "onResizeStop"
        | "onResize"
        | "onResizeStart"
    >>

/**
* * only what interests us
*/
type _RndEventHandlersMap = {
    [k in _RndEventKey]: NonNullable<_RndProps[k]>
}


// ======================================== helpers
const _moveToFront = ({
    id
    , el = _getById(id!)
}: XOR<
    HasId
    , {
        el: HTMLElement
    }
>
) => {
    if (!el
        || !el.parentElement
        || el.parentElement.lastElementChild === el
    ) {
        return
    }

    el.parentElement.append(el)

}

// ======================================== events
export type SpatialNodeComponentEvent
    =
    & HasSpatialNode_UI

export type SpatialNodeComponentEventsMap = {
    closeButtonClick: SpatialNodeComponentEvent
    change: SpatialNodeComponentEvent
}
export type SpatialNodeComponentEventHandlers =
    EventHandlersFromMap<
        SpatialNodeComponentEventsMap
    >

export type SpatialNodeRef =
    & HasSpatialNode_UI
    & {
        action: "mounted" | "dismounted"
    }


// ======================================== props
export type SpatialNodeComponentProps =
    & Partial<
        & Pick<
            UseSpatialNodeInput,
            | "initialSize"
            | "initialPosition"
            | "isObservable"
            | "spatialNode"
        >

        & HasHeader<ReactNode>
        & HasBackgroundColor
        & PickHtmlAttributes<"className" | "style">
        & PickHtmlAttributes<"children">
        & SpatialNodeComponentEventHandlers

        & {
            spatialNodeRef: RefCallback<SpatialNodeRef>
        }
    >

const DRAG_HANDLE_CLASS_NAME
    = "data-spatial-node-drag-handle" as const satisfies string


// ======================================== header
type SpatialNode_HeaderProps =
    & {
        ownerId: ID
    }
    & HasHeader<ReactNode>

const SpatialNode_Header = ({
    header
    , ownerId
    , ...rest
}: SpatialNode_HeaderProps) => {
    return (
        <div
            {...rest}
            data-spatial-node-header
            data-spatial-node-header-owner-id={ownerId}
            className={_cn(`
                ---min-w-0 
                ---truncate 
                ---bg-[dodgerblue] 
                relative flex items-center 
                bg-gray-500
                text-white 
                px-2 
                cursor-grab 
                active:cursor-grabbing 
                shrink-0
                `
                , DRAG_HANDLE_CLASS_NAME
            )}
        >
            {header || "Header (drag here)"}
        </div>
    )
}

// ======================================== body
type SpatialNode_BodyProps =
    & HasChildren<ReactNode>

const SpatialNode_Body = ({
    children
    , ...rest
}: SpatialNode_BodyProps
) => {
    return (
        <div
            {...rest}
            data-spatial-node-body
            className={_cn(`
                flex-1 min-h-0 w-full
                h-full w-full overflow-auto 
                ---border-2 ---border-amber-600
                border-none
                `
            )}
        >
            {children}
        </div>
    )
}











// ======================================== component

/**
 * * [Rnd] wrapper
 * * only [Spatial.Transformation]
 * * depends on:
 *      * useSpatialNode
 */
export const SpatialNodeComponent = ({
    initialSize
    , initialPosition
    , isObservable = true
    , spatialNode: spatialNode_IN

    , className
    , style

    // ---------- WithChildren
    , header
    , children

    , onChange
    , onCloseButtonClick
    // , onMount
    , spatialNodeRef

    , backgroundColor

    , ...rest

}: SpatialNodeComponentProps
) => {

    const id = useId()

        , { current: _refs } = useRef({} as {
            closeButton?: HTMLElement | null
        })

        , { spatialNode } = useSpatialNode(
            spatialNode_IN
                ? {
                    isObservable
                    , spatialNode: spatialNode_IN
                    , onChange
                }
                : {
                    initialSize
                    , initialPosition
                    , isObservable
                    , onChange
                })

        , _handle_CloseButtonClick: CloseButtonProps["onClick"]
            = (ev: MouseEvent<HTMLButtonElement>) => {
                onCloseButtonClick?.({ spatialNode })
            }


        ,
        /**
         * * only what interests us
         */
        rndHandlers = {
            onResize: (ev, direction, el, delta, position) => {

            }
            , onResizeStart: (ev, direction, el) => {
                _moveToFront({ id })
            }
            , onDrag: (ev, data) => {

                // console.log("onDrag", {
                //     ev, data
                // })

            }

            , onDragStart: (ev, {
                node: el
            }) => {
                _moveToFront({ id })
            }

            , onDragStop: (ev, data) => {
                spatialNode.position = data
                console.log("onDragStop", {
                    "node.position": spatialNode.position
                    , ev, data
                })
                // const el = ev.target as HTMLElement
                // el.style.zIndex = ""
            }

            , onResizeStop: (ev, direction, el, delta, position) => {

                const [width, height] = SIZE_KEYS
                    .map(k => spatialNode.size[k] + delta[k])
                    , transformation = {
                        size: { width, height }
                        , position: position
                    } as Transformation

                spatialNode
                    .updateTransformation(
                        transformation
                    )

            }
            , onCloseButtonClick: () => {
                debugger

            }
        } as _RndEventHandlersMap

    // _layoutEffect(() => {

    //     // debugger

    //     _refs.closeButton = document.querySelector(`[data-spatial-node-close-button="${id}"]`) as H

    //     const node_header = document.querySelector(`[data-spatial-node-header="${id}"]`) as H
    //     if (node_header) {
    //         const close_button = node_header.querySelector("[data-close-button]") as H
    //         console.log({
    //             node_header
    //             , close_button
    //         })
    //         // debugger
    //     }
    // })

    _effect([spatialNodeRef, spatialNode], () => {
        spatialNodeRef?.({
            spatialNode
            , action: "mounted"
        })
        return () => {
            spatialNodeRef?.({
                spatialNode
                , action: "dismounted"
            })
        }
    })


    return (
        <Rnd
            {...rest}
            id={id}
            data-spatial-node={id}
            size={spatialNode.size}
            position={spatialNode.position}
            {...rndHandlers}
            bounds="parent"
            className={_cn(`
                overflow-hidden
                border
                border-gray-300 
                ---rounded-sm
                p-0
                shadow-2xl
                `
                , className
                , (onCloseButtonClick ? `p-r-2` : undefined)
            )}
            minWidth={10}
            minHeight={10}
            style={{
                ...style
                , overflow: "hidden"
                , alignItems: "baseline"
                , backgroundColor
            }}
            dragHandleClassName={DRAG_HANDLE_CLASS_NAME}
        >
            <div
                data-spatial-node-content-container={id}
                className={_cn(`
                    flex h-full w-full flex-col
                    `
                )}
                onFocusCapture={(ev) => {
                    const target = ev.target as HTMLElement
                    if (target.closest(`[data-spatial-node-header="${id}"]`)) {
                        return
                    }
                    _moveToFront({ id })
                }}
            >
                {onCloseButtonClick
                    && (
                        <CloseButton
                            data-spatial-node-close-button={id}
                            onClick={_handle_CloseButtonClick}
                            className={`
                                absolute
                                `}
                            size={10}
                        />)
                }

                <SpatialNode_Header
                    ownerId={id}
                    header={header}
                />
                <SpatialNode_Body
                    children={children}
                />
            </div>


        </Rnd>
    )
}




    , DragabbleSpatialNode = SpatialNodeComponent



export namespace SpatialNode {
    export const Component = SpatialNodeComponent
    export const Header = SpatialNode_Header
    export const Body = SpatialNode_Body
    export const Class = SpatialNodeClass
    export type Props = SpatialNodeComponentProps
}


