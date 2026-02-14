import { Rnd, Props as RndProps } from "react-rnd"
import {
    EventHandlersFromMap,
    ExtractByPrefix,
    ExtractEventHandlersMap,
    ExtractEventHandlersMapPartial,
    HasChildren,
    HasData,
    HasHeader,
    HasId,
    ID,
    KeyOf,
    SIZE_KEYS,
    Transformation,
    XOR,
} from "@ns-world-lab/types"
import {
    _cn, _effect, _getById, _layoutEffect, _memo, _use_state
    , HasBackgroundColor
    , PickHtmlAttributes
} from "../../../utils"
import {
    _t,
    HasSpatialNode_UI,
    SpatialNodeClass,
} from "@ns-world-lab/logic"
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
import { CloseButton, CloseButtonProps } from "../controls"

type H = HTMLElement | undefined





/**
* * only what interests us
*/
type _RndEventHandlersMap = ExtractByPrefix<"on", RndProps>


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
type Event
    =
    & HasSpatialNode_UI

type EventsMap = {
    closeButtonClick: Event
    change: Event
}
type EventHandlers =
    EventHandlersFromMap<
        EventsMap
    >

type Ref =
    & HasSpatialNode_UI
    & {
        action: "mounted" | "dismounted"
    }


// ======================================== props
type Props =
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
        & EventHandlers

        & {
            spatialNodeRef: RefCallback<Ref>
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

const SpatialNode_Header: React.FC<SpatialNode_HeaderProps> = ({
    header
    , ownerId
    , ...rest
}) => {
    return _memo([header, ownerId], () =>
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

const SpatialNode_Body: React.FC<SpatialNode_BodyProps> = ({
    children
    , ...rest
}) => {
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
export const SpatialNode_Component: React.FC<Props> = ({
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

    , spatialNodeRef

    , backgroundColor

    , ...rest

}) => {

    const id = useId()

        , { current: _refs } = useRef({} as {
            closeButton?: HTMLElement | null
            rndRef?: Rnd | null
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
            onResizeStart: (ev, direction, el) => {
                _moveToFront({ id })
            }

            , onDragStart: (ev, { node }) => {
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

                    , transformation: Transformation = {
                        size: { width, height }
                        , position: position
                    }

                spatialNode.updateTransformation(
                    transformation
                )

            }
            , onCloseButtonClick: () => {
                debugger

            }
        } as _RndEventHandlersMap


    _effect([spatialNodeRef, spatialNode], () => {
        if (!spatialNodeRef) {
            return
        }
        spatialNodeRef({
            spatialNode
            , action: "mounted"
        })
        return () => {
            spatialNodeRef({
                spatialNode
                , action: "dismounted"
            })
        }
    })

    // const elRef = useRef<HTMLElement | null>(undefined)
    // _effect([elRef.current], () => {
    //     const el = elRef.current

    //     if (!el) {
    //         return
    //     }

    //     const iframes = [...el.querySelectorAll("iframe") ?? []].filter(Boolean) as HTMLElement[]

    //     if (!iframes.length) {
    //         return
    //     }


    //     const fn = () => {

    //         debugger
    //         _moveToFront({ id })
    //     }

    //     iframes.forEach(el => {
    //         el.addEventListener("mousedown", fn)
    //     })

    //     return () => {
    //         iframes.forEach(el => {
    //             el.removeEventListener("mousedown", fn)
    //         })
    //     }

    // })

    return (
        <Rnd
            {...rest}
            id={id}
            ref={el => {
                _refs.rndRef = el
            }}
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
        // onMouseDown={() => {
        //     debugger
        // }}
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
            // onPointerUp={() => {
            //     _moveToFront({ id })
            // }}
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




    , DragabbleSpatialNode = SpatialNode_Component













export {
    type Event as SpatialNode_Event

    , type EventsMap as SpatialNode_EventsMap

    , type EventHandlers as SpatialNode_EventHandlers

    , type Ref as SpatialNodeRef

    , type Props as SpatialNode_Props
}