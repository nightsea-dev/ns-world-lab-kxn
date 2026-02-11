import { useReducer } from "react"
import {
    EventHandlersFromMap
    , PickAndPrefixKeysAndCapitalise
    , XOR
} from "@ns-world-lab-kxn/types"
import {
    _t
    , SpatialNodeClass
    , SpatialNodeInput
    , HasSpatialNode_UI
} from "@ns-world-lab-kxn/logic"
import { _effect, _memo } from "../../utils"

// ========================================
export type UseSpatialNodeEventsMap = {
    change: HasSpatialNode_UI
}

// ========================================
type A =
    & PickAndPrefixKeysAndCapitalise<"initial", SpatialNodeInput, | "size" | "position">

export type UseSpatialNodeInput =
    & Partial<
        & XOR<
            A
            , HasSpatialNode_UI
        >
        & Pick<
            SpatialNodeInput,
            | "isObservable"
        >
        & EventHandlersFromMap<
            UseSpatialNodeEventsMap
        >
    >


// ========================================
export const useSpatialNode = (
    {
        initialSize
        , initialPosition
        , isObservable

        , spatialNode: spatialNode_IN

        , onChange

    }: UseSpatialNodeInput
): HasSpatialNode_UI => {

    const { spatialNode } = _memo([spatialNode_IN], () => {
        if (spatialNode_IN instanceof SpatialNodeClass) {
            return {
                spatialNode: spatialNode_IN
            }
        }
        return {
            spatialNode: new SpatialNodeClass({
                size: initialSize
                , position: initialPosition
                , isObservable
            })
        }
    })

        , [_, _updateComponent] = useReducer(x => x + 1, 0)

    // could be replaced outside
    spatialNode.onChange = ev => {

        console.log(useSpatialNode.name, {
            "node.onChange": ev
            , spatialNode
        })

        _updateComponent()

        // debugger
        onChange?.({ spatialNode })

    }

    return {
        spatialNode
    }

}