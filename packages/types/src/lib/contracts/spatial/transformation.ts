
// contract

import { HasPosition, HasSize, Position, Size } from "../../primitives"

/**
 * ---
 * SpatialTransformation
 * --
 */
export type Transformation =
    & HasSize
    & HasPosition



// capability
export type HasTransformation = {
    transformation: Transformation
}

export type HasTransformations = {
    transformations: Transformation[]
}


// capability/behaviour
export type HasTransformationMutators
    =
    & {
        updatePosition(position: Position): void
        updateSize(size: Size): void
        // updatePosition(x: number, y: number): void
        // updateSize(width: number, height: number): void
    }



// composite
export type TransformationWithMutators
    =
    & Transformation
    & HasTransformationMutators
