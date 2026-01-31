import { Rnd } from "react-rnd"
// import { reaction } from "mobx"
import {
    EventHandlersFromMap,
    KeyOf,
    PickRequiredRestPartial,
    Transformation,
    XOR,
} from "@ns-lab-klx/types"
import { _cn, _effect, _memo, PickCssProperties, PickHtmlAttributes } from "../../utils"
import {
    _t,
    HasSpatialNode_UI,
} from "@ns-lab-klx/logic"
import {
    ComponentProps
} from "react"
import { useSpatialNode, UseSpatialNodeInput } from "../../hooks/"
import { CloseButton, CloseButtonProps } from "../ui"

type _RndProps = ComponentProps<typeof Rnd>
/**
 * * only what interests us
 */
type _RndEventKey = KeyOf<Pick<
    _RndProps,
    | "onDragStart"
    | "onDrag"
    | "onDragStop"
    | "onResizeStop"
>>
/**
 * * only what interests us
 */
type _RndEventHandlersMap = {
    [k in _RndEventKey]: NonNullable<_RndProps[k]>
}



// ======================================== events
export type SpatialNodeComponentEventsMap = {
    closeButtonClick: HasSpatialNode_UI
    change: HasSpatialNode_UI
    , mount: HasSpatialNode_UI
}
export type SpatialNodeComponentEventHandlers =
    EventHandlersFromMap<
        SpatialNodeComponentEventsMap
    >
// ======================================== props
// type _WithContent =
//     & PickRequiredRestPartial<
//         & SpatialNodeContentContainerRendererProps
//         & HasSpatialNodeContentContainerRenderer
//         , "content"
//     >


// type _WithChildren = Required<
//     & PickHtmlAttributes<"children">
// >

type A = Pick<
    UseSpatialNodeInput,
    | "initialSize"
    | "initialPosition"
    | "isObservable"
>


export type SpatialNodeComponentProps =
    & PickHtmlAttributes<"children">
    & Partial<
        & Pick<
            UseSpatialNodeInput,
            | "initialSize"
            | "initialPosition"
            | "isObservable"
            | "spatialNode"
        >

        & PickHtmlAttributes<"className" | "style">
        & PickCssProperties<"backgroundColor">

        & SpatialNodeComponentEventHandlers
    >



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
    , backgroundColor

    // ---------- WithContent
    // , content
    // , contentContainerRenderer: R = DEFAULT_SpatialNodeContentContainer

    // ---------- WithChildren
    , children

    , onChange
    , onCloseButtonClick
    , onMount

    , ...rest
}: SpatialNodeComponentProps
) => {


    const { spatialNode } = useSpatialNode(
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
            = () => {
                onCloseButtonClick?.({ spatialNode })
            }

        ,
        /**
         * * only what interests us
         */
        _rndHandlers = {
            onDrag: (ev, data) => {

                console.log("onDrag", {
                    ev, data
                })

            }

            , onDragStart: (ev, data) => {

                console.log("onDragStart", {
                    ev, data
                })

            }

            , onDragStop: (ev, data) => {
                spatialNode.position = data
                console.log("onDragStop", {
                    "node.position": spatialNode.position
                    , ev, data
                })
            }

            , onResizeStop: (...args) => {

                const [e, dir, elementRef, delta, newPosition] = args

                    , transformation: Transformation = {
                        size: {
                            width: spatialNode.size.width + delta.width
                            , height: spatialNode.size.height + delta.height
                        }
                        , position: newPosition
                    }

                console.log(
                    _rndHandlers.onResizeStop.name
                    , {
                        transformation
                    })

                // to remain within the [KLX] given codeBase
                //  spatialNode.updateSize(transformation.size)
                // spatialNode.updatePosition(transformation.position)
                spatialNode.updateTransformation(transformation)

                // node.size = {
                //     width: node.size.width + delta.width
                //     , height: node.transformation.size.height + delta.height
                // }

                // node.position = newPosition

                // node.updateSize({
                //     width: node.size.width + delta.width
                //     , height: node.transformation.size.height + delta.height
                // })
                // node.updatePosition(newPosition)
                // node.updateSize(node.size.width + delta.width, node.transformation.size.height + delta.height)
                // node.updatePosition(newPosition.x, newPosition.y)

            }

        } as _RndEventHandlersMap

    _effect([onMount], () => {
        if (!onMount) {
            return
        }
        onMount({
            spatialNode
        })
    })

    return (
        <Rnd
            {...rest}
            data-graph-node-component
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
            style={{
                ...style
                , backgroundColor
                , overflow: "hidden"
                , alignItems: "baseline"
            }}
        // style={{ background: node.color }}
        >
            {onCloseButtonClick
                && (
                    <CloseButton
                        onClick={_handleCloseButtonClick}
                    />)
            }
            {children}
            {/* {children ? children : (
                <R
                    content={content}
                />
            )} */}
        </Rnd>
    )
}
