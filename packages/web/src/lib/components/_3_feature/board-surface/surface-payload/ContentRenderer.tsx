import {
    HasContent
} from "@ns-world-lab-kxn/types"
import {
    FunctionComponent
    , ReactNode
} from "react"


// ======================================== types
export type ContentRendererProps =
    & HasContent<ReactNode>

export type ContentRenderer
    = FunctionComponent<
        ContentRendererProps
    >


// ======================================== component
export const ContentRenderer = ({
    content
}: ContentRendererProps
) => {
    return (
        <div
            data-graph-node-content-container
            className="flex flex-col justify-center items-center h-full w-full"
        >
            <div className="w-full text-center">
                {/* {node.payload} */}
                data-graph-node-content-container
                {content}
            </div>
        </div>
    )
}




export type HasSpatialNodeContentContainerRenderer
    = {
        contentContainerRenderer: ContentRenderer
    }