import { HasPayloadWithKind, PayloadWithKind } from "@ns-world-lab/types"
import { HasSpatialNode_UI } from "@ns-world-lab/logic"


// ======================================== types - graph/surface lexicon

/**
 * * [SpatialNode_UI/HasTransformation] with [KindedPayload]
 * 
 * [type]
 */
export type SurfaceNode<
    TPayload extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<TPayload>
    & HasSpatialNode_UI


// ======================================== capabilities

export type HasSurfaceNode<
    TPayload extends PayloadWithKind<any>
> = {
    surfaceNode: SurfaceNode<TPayload>
}
export type HasSurfaceNodes<
    TPayload extends PayloadWithKind<any>
> = {
    surfaceNodes: SurfaceNode<TPayload>[]
}








// ======================================== types/map

export type SurfaceNodesMap<
    P extends PayloadWithKind<any>
> = Map<P["id"], SurfaceNode<P>>


// ======================================== capabilities/map

export type HasSurfaceNodesMap<
    P extends PayloadWithKind<any>
> = {
    surfaceNodesMap: SurfaceNodesMap<P>
}








