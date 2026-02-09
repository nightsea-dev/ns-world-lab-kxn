import {
    IFrameWithKind
} from '@ns-world-lab-knx/types'
import {
    _cn,
    _layoutEffect,
    _use_state,
    ObjectView,
    PayloadRendererProps,
    ShowInfoToggle,
} from '@ns-world-lab-knx/web'
import { useRef } from 'react'

// ======================================== props
export type IFramePayloadRendererProps =
    & PayloadRendererProps<IFrameWithKind>

// ======================================== component
/**
 * [payload-renderer]
 */
export const IFramePayloadRenderer = ({
    payload
}: IFramePayloadRendererProps
) => {

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
                block w-full h-full border-8 bg-green-500
                `}
        >

            <iframe
                data-iframe-payload
                title={[name, src].join(" | ")}
                src={src}
                name={name}
                data-kind={kind}
                className={`
                block w-full h-full border-2 bg-blue-500
                `}
            />
            <div
                className={`
                ---absolute
                top-[-10px]
                left-[10px]
                z-50
                `}
                style={{
                    transform:"translate(0, -30px)"
                }}
            >
                <ShowInfoToggle
                    checked={state.showInfo}
                    onClickCapture={ev => {
                        debugger

                    }}
                    onClick={ev => {
                        debugger
                    }}
                    onChange={({
                        showInfo
                    }) => {
                        debugger

                        _set_state({
                            showInfo
                        })
                    }}
                />
                {state.showInfo && <ObjectView
                    data={payload}
                />}
            </div>        </div>
    )

}
