import {
    HasId
    , Position
    , Transformation
    , GraphNodeWithTransformMutators
    , EventHandlersFromMap
    , KeyOf
    , Size
} from "@ns-lab-klx/types"
import {
    createID
    , createTransform
} from "../../factories"
import {
    action
    , makeObservable
    , observable
} from "mobx"


// ======================================== events
export type SpatialNodeEventsMap = {
    change: {
        k: KeyOf<Transformation>
        node: Transformation
    }
}
export type SpatialNodeEventHandlers =
    EventHandlersFromMap<SpatialNodeEventsMap>

// ======================================== input/props
export type SpatialNodeInput
    =
    & Partial<
        & HasId
        & Transformation
        & {
            isObservable: boolean
        }
        & SpatialNodeEventHandlers  //EventHandlersFromMap<SpatialNodeEventsMap>
    >



// ======================================== class
/**
 * * can be [observable]
 * * uses [mobx]
 */
export class SpatialNode
    // implements GraphNode {
    implements
    GraphNodeWithTransformMutators
    , Pick<SpatialNodeInput, "onChange"> {

    id: string
    private readonly _transformation: Transformation
    get transformation() {
        return { ...this._transformation }
    }
    updateTransformation({
        size
        , position
    }: Partial<Transformation>
    ) {

        ; !size || (this.size = size);
        ; !position || (this.position = position);

    }

    onChange: SpatialNodeInput["onChange"]

    constructor({
        id = createID()
        , position
        , size
        , isObservable
        , onChange
    } = {} as SpatialNodeInput
    ) {

        this.id = id
        this._transformation = createTransform({ size, position })
        this.onChange = onChange

        this._transformation.position

            ;
        if (isObservable) {
            makeObservable(
                this._transformation
                , {
                    position: observable,
                    // updatePosition: action,
                    // updateSize: action,
                })
            makeObservable(
                this
                , {
                    // position: observable,
                    updatePosition: action,
                    updateSize: action,
                })
        }
    }

    private _emit(
        k: KeyOf<Transformation>
    ) {
        this.onChange?.({
            k
            , node: {
                size: this.size
                , position: this.position
            }
        })
    }

    get position(): Position {
        return { ...this._transformation.position }
    }
    set position({ x, y }: Position) {
        this.updatePosition({ x, y })
    }

    get size() {
        return { ...this._transformation.size }
    }
    set size({ width, height }: Size) {
        this.updateSize({ width, height })
    }


    // so these methods are so that [mobx.action] can be used

    updatePosition(position: Position) {
        this._transformation.position = { ...position }
        this._emit("position")
    }

    updateSize(size: Size) {
        this._transformation.size = { ...size }
        this._emit("size")
    }

}



// ======================================== U lexicon/ exports
export type SpatialNodeData =
    Pick<SpatialNode, | "id" | "size" | "position">

export type SpatialNode_UI
    = Pick<
        SpatialNode,
        | "id"
        | "size"
        | "position"
        // keeping these to remain within the [KLX] base
        | "updatePosition"
        | "updateSize"

        | "updateTransformation"
        | "transformation"
    >

export type HasSpatialNode_UI =
    & {
        spatialNode: SpatialNode_UI
    }
