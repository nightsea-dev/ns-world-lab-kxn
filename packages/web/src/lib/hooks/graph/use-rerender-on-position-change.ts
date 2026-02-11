import {
    HasPosition,
    Position,
    Position_KEYS
} from "@ns-world-lab/types"

import {
    areEqualPositions,
    createPosition  // <= questionable
} from '@ns-world-lab/logic'  // <= questionable
import { _effect, _memo, _use_state } from '../../utils'
// import { reaction } from "mobx"

// type Node = HasPosition
// type HasNode = {
//     node: GraphNode
// }

export type UseRerenderOnPositionChangeProps
    = & Partial<
        & HasPosition
    >
// {
//     const {

//     } = {} as UseRerenderOnPositionChangeProps
// }




export const useRerenderOnPositionChange = ({
    position: position_IN
}: UseRerenderOnPositionChangeProps
) => {
    const [state, _set_state] = _use_state({
        currentPosition: createPosition(position_IN)
    })

    _effect([position_IN], () => {

        if (!position_IN) {
            return
        }

        if (!areEqualPositions(
            state.currentPosition
            , position_IN
        )) {
            _set_state({
                currentPosition: position_IN
            })
        }

        // why is need required ?
        // return reaction(
        //     (...args) => {
        //         const {
        //             position: { x, y }
        //             // , size: {
        //             //     width
        //             //     , height
        //             // }
        //         } = node

        //         return ({ x, y })
        //     }
        //     , (prev, { x, y }) => {
        //         node.updatePosition(x, y)
        //         _update()
        //     }
        // )

        // const disposers: (() => void)[] = []

        // disposers.push(
        //     reaction(
        //         (...args) => ({ x: node.position.x, y: node.position.y }),
        //         (prev, { x, y }) => {
        //             node.updatePosition(x, y)
        //             _update()
        //         }
        //     )
        // )

        // return () => {
        //     disposers.forEach(dispose => dispose())
        // }

    })

    return state

}
