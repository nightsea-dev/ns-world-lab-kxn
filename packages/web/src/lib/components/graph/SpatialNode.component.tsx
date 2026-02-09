import { Rnd } from "react-rnd"
import {
    EventHandlersFromMap,
    HasHeader,
    HasId,
    ID,
    KeyOf,
    SIZE_KEYS,
    Transformation,
    XOR,
} from "@ns-lab-knx/types"
import {
    _cn, _effect, _getById, _memo, _use_state
    , HasBackgroundColor
    , PickHtmlAttributes
} from "../../utils"
import {
    _t,
    HasSpatialNode_UI,
} from "@ns-lab-knx/logic"
import {
    ComponentProps,
    MouseEvent,
    ReactNode,
    useId,
    useLayoutEffect,
    useRef
} from "react"
import {
    useSpatialNode
    , UseSpatialNodeInput
} from "../../hooks/"
import { CloseButton, CloseButtonProps } from "../ui"

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
    !el || el.parentElement!.append(el)
}

// ======================================== events
export type SpatialNodeComponentEvent
    =
    & HasSpatialNode_UI
// & HasId
// & {
//     spatialNodeId: ID
// }

export type SpatialNodeComponentEventsMap = {
    closeButtonClick: SpatialNodeComponentEvent
    change: SpatialNodeComponentEvent
    mount: SpatialNodeComponentEvent
}
export type SpatialNodeComponentEventHandlers =
    EventHandlersFromMap<
        SpatialNodeComponentEventsMap
    >
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


    >


const DRAG_HANDLE_CLASS_NAME
    = "data-spatial-node-drag-handle" as const satisfies string
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
    , onMount

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

        , _handleCloseButtonClick: CloseButtonProps["onClick"]
            = (ev: MouseEvent<HTMLButtonElement>) => {
                debugger
                onCloseButtonClick?.({ spatialNode })
            }


        ,
        /**
         * * only what interests us
         */
        _rndHandlers = {
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
                // _moveToFront({ id })
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

                // _moveToFront({ el })

            }
            , onCloseButtonClick: () => {

            }
        } as _RndEventHandlersMap

    useLayoutEffect(() => {



        _refs.closeButton = document.querySelector(`[data-spatial-node-close-button="${id}"]`) as H

        const node_header = document.querySelector(`[data-spatial-node-header="${id}"]`) as H
        if (node_header) {
            const close_button = node_header.querySelector("[data-close-button]") as H
            console.log({
                node_header
                , close_button
            })
            // debugger
        }
    })

    _effect([onMount], () => {
        onMount?.({ spatialNode })
    })


    return (
        <Rnd
            {...rest}
            id={id}
            data-spatial-node
            size={spatialNode.size}
            position={spatialNode.position}
            {..._rndHandlers}
            bounds="parent"
            className={_cn(
                `border 
                border-gray-300 
                
                p-0
                ---shadow-[2px_10px_50px_0_rgba(0,0,0,.2)]
                shadow-2xl
                ---hover:shadow-2xl
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
                className={_cn(
                    "flex h-full w-full flex-col"
                )}
                onMouseDown={({
                    currentTarget: el
                }) => {

                    _moveToFront({ id })

                }}
            >
                <div
                    data-spatial-node-header={id}
                    className={_cn(
                        DRAG_HANDLE_CLASS_NAME
                        , `
                        ---min-w-0 
                        ---truncate 
                        relative flex items-center 
                        bg-[dodgerblue] text-white 
                        px-2 
                        cursor-grab 
                        active:cursor-grabbing 
                        shrink-0
                        `
                    )}
                >
                    {/* <div
                        data-spatial-node-header-text-container={id}
                        className="min-w-0 flex-1 truncate"
                    >
                    </div> */}
                    {header || "Header (drag here)"}

                    {onCloseButtonClick
                        && (
                            <CloseButton
                                data-spatial-node-close-button={id}
                                onClick={_handleCloseButtonClick}
                                className={`
                                    text-white absolute right-0 m-1
                                    z-[1000]
                                    `}
                                style={{
                                    position: "absolute"
                                    , zIndex: 1000
                                }}
                                onPointerDownCapture={ev => ev.stopPropagation()}
                            />)
                    }
                </div>

                <div
                    data-spatial-node-body
                    className={_cn(
                        "flex-1 min-h-0 w-full"
                        , `
                            h-full w-full overflow-auto 
                            border-2 border-amber-600
                            `
                    )}
                    onMouseDown={({
                        currentTarget: el
                    }) => {

                        // debugger

                        _moveToFront({ id })

                    }}
                >
                    {children}
                </div>
            </div>


        </Rnd>
    )
}




    , DragabbleNode = SpatialNodeComponent