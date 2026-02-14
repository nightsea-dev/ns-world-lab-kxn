import {
    IFrameWithKind
} from '@ns-world-lab/types'
import { PayloadRenderer } from '../../../_types'
import { _use_state } from '../../../../../../../utils'

// ======================================== props
// export type IFramePayloadRendererProps =
//     & PayloadRenderer_Props<IFrameWithKind>
// & PickHtmlAttributes<"onMouseDown">

// ======================================== component
/**
 * [payload-renderer]
 */
export const IFramePayloadRenderer: PayloadRenderer.FC<IFrameWithKind> = ({
    payload
}) => {

    const [state, _set_state] = _use_state({
        showInfo: false
    })

    const {
        id
        , kind
        , name
        , src
    } = payload

    if (!src) {
        throw new Error(`[payload.src] is required.`)
    }

    return (
        <div
            className={`
                block 
                w-full 
                h-full 
                ---border-8 
                ---bg-green-500
                `}
        // onPointerDownCapture={()=>{
        //     debugger
        // }}
        >
            <iframe
                data-iframe-payload
                title={[name, src].join(" | ")}
                src={src}
                name={name}
                data-kind={kind}
                className={`
                block 
                w-full 
                h-full 
                ---border-2 
                ---bg-blue-500
                bg-white
                `}
            // onMouseDown={(ev) => {
            //     debugger
            //     onMouseDown?.(ev)
            // }}
            // onClick={() => {
            //     debugger
            // }}
            // onPointerDown={() => {
            //     debugger
            // }}
            />

        </div>
    )

}
