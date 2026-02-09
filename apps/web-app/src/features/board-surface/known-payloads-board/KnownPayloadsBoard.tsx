import {
    _effect
    , BoardSurfaceComponent
    , _memo,
    _use_state,
    PayloadRenderer,
    DrawerInfo,
    _getFileUrl,
    BoardSurface_Props,
    BoardSurface_EventsMap,
    BoardSurfaceRef,
} from '@ns-lab-knx/web'
import {
    createIdeaWithAuthor,
    pickFromAsArray,
    pickFromAsTuple,
} from "@ns-lab-knx/logic"
import { HasPayloads, PickRequired } from '@ns-lab-knx/types'
import {
    KNOWN_PAYLOAD_RENDERERS_BY_KIND
    , KnownPayload
    , KnownPayloadKind
} from './KnownPayloadRenderer'
import { KNOWN_PAYLOAD_LOADER_DRAWER_INFOS_MAP, KnownPayloadLoaderProps } from './KnownPayloadLoader'
import { useRef } from 'react'

// ======================================== helpers


// ======================================== CONST


type M_State =
    | {
        name: "IDLE"
        lastestAction?: string
    }
    | {
        name: "SHOWING DRAWER"
        // status: "showing IFRAME input" | "showing IMAGE input"
        payloadKind: KnownPayloadKind
    }

type M_StateName = M_State["name"]

type State =
    & {
        payloads: KnownPayload[]
        isFirstRender: boolean
        m_state: M_State
    }
// & Pick<BoardSurfaceProps<KnownPayload>, "showModalWithThisContent">


// ======================================== props
export type KnownPayloadsBoardProps =
    & Partial<
        & Pick<
            BoardSurface_Props<KnownPayload>,
            | "data"
            | "onPayloadsAdded"
            | "onPayloadsRemoved"
        >
    >
// ======================================== component

export const KnownPayloadsBoard = ({
    data: data_IN
    , ...rest
}: KnownPayloadsBoardProps
) => {

    const [state, _set_state] = _use_state({
        payloads: []
        , isFirstRender: true
        , m_state: { name: "IDLE" }
    } as State)

        , {
            current: _refs
        } = useRef({} as {
            boardSurfaceRef?: BoardSurfaceRef<KnownPayload> | null
        })


        , { openInputView } = _memo([state.m_state.name], () => {

            const openInputView = state.m_state.name === "SHOWING DRAWER"

            console.log({
                "state.m_state.name": state.m_state.name
                , openInputView
            })

            // debugger

            return { openInputView }

        })

        , _setTo_IDLE = (
            lastestAction: string
        ) => {

            _set_state({
                m_state: {
                    name: "IDLE"
                    , lastestAction
                }
            })
        }

        , surfaceBoardHandlers = {
            onInputViewClose() {
                _setTo_IDLE("surfaceBoardHandlers.onInputViewClose")
            }
            , onPayloadsAdded({
                payloads
            }) {
                _set_state({ payloads })
            }
            , onPayloadsRemoved({ payloads }) {
                _set_state({ payloads })
            }
        } as PickRequired<BoardSurface_Props<KnownPayload>, "onInputViewClose" | "onPayloadsAdded" | "onPayloadsRemoved">

        , inputViewHanders = {
            onCancel() {
                _setTo_IDLE("inputViewHanders.onCancel")
            }
            , onClear() {
                _set_state(p => ({
                    ...p
                    , payloads: []
                }))
            }
            , onDone({
                payloads: new_payloads
            }) {

                const {
                    payloads: current_payloads
                } = state

                    , payloads = [
                        ...current_payloads
                        , ...new_payloads
                    ]

                _set_state({ payloads })

                _setTo_IDLE("inputViewHanders.onDone")

            }
        } as Pick<KnownPayloadLoaderProps<KnownPayloadKind>, "onCancel" | "onClear" | "onDone">


        , _handleButtonClick = (
            payloadKind: KnownPayloadKind
        ) => {

            if (state.m_state.name !== "IDLE") {
                return
            }

            switch (payloadKind) {
                case "idea": {

                    const {
                        payloads: current_payloads
                    } = state
                        , next_payloads = [...current_payloads]
                        , {
                            // current: {
                            numberOfItems = 1
                            // } = {}
                        } = _refs.boardSurfaceRef ?? {}
                    next_payloads.push(
                        ...(
                            Array.from({
                                length: Math.max(1, numberOfItems)
                            })
                                .map(() => createIdeaWithAuthor())
                        ))
                    _set_state({
                        payloads: next_payloads
                    })
                    break
                }
                case "iframe": {
                    _set_state({
                        m_state: {
                            name: "SHOWING DRAWER"
                            , payloadKind
                        }
                    })
                    break
                }
                case "image": {
                    _set_state({
                        m_state: {
                            name: "SHOWING DRAWER"
                            , payloadKind
                        }
                    })
                    break;
                }
            }

        }



        , { inputViewDrawerInfo } = _memo([
            state.m_state.name
            , ...pickFromAsArray(inputViewHanders)
            // , surfaceBoardHandlers.onInputViewClose
            // , surfaceBoardHandlers.onPayloadsAdded
            // , surfaceBoardHandlers.onPayloadsRemoved
        ], () => {

            const { m_state } = state

            if (m_state.name !== "SHOWING DRAWER") {
                return {}
            }

            const {
                header
                , body: R
            } = KNOWN_PAYLOAD_LOADER_DRAWER_INFOS_MAP[
            m_state.payloadKind
            ]!

            if (typeof (R) !== "function") {
                throw new Error(`[R] must be a function`)
            }

            console.log("R", R.name)

            return {
                inputViewDrawerInfo: {
                    header
                    , body: (
                        <R
                            {...inputViewHanders}
                        // onCancel={_handle_BoardSurface_InputView_Close}
                        // onDone={_handle_BoardSurface_InputView_Done_addPayloads}
                        // onClear={_handle_BoardSurface_InputView_Clear}
                        />
                    )
                } as DrawerInfo
            }
        })

    _effect([data_IN], () => {
        if (!data_IN || data_IN === state.payloads) {
            return
        }
        _set_state({
            payloads: data_IN
        })
    })

    _effect([], () => {

        if (!state.isFirstRender || state.payloads.length) {
            return
        }

        _set_state({
            payloads: [createIdeaWithAuthor()]  // as per [KNX] codebase
            , isFirstRender: false
        })

    })


    return (
        <div
            className={`
                h-full w-full relative 
                ---border-4                 
                ---border-amber-600 m-0
                `}
            data-known-payload-board
        >
            <BoardSurfaceComponent<KnownPayload>
                {...rest}

                data={state.payloads}

                additionalButtonsMap={{
                    "Add Idea": {
                        onClick: () => _handleButtonClick("idea")
                        // , disabled: state.m_state.name !== "IDLE"
                    }
                    , "Add IFrame": {
                        onClick: () => _handleButtonClick("iframe")
                        // , disabled: state.m_state.name !== "IDLE"
                    }
                    , "Add Image": {
                        onClick: () => _handleButtonClick("image")
                        // , disabled: state.m_state.name !== "IDLE"
                    }
                }}

                boardSurfaceRef={ref => {
                    _refs.boardSurfaceRef = ref
                }}

                inputViewInfo={{
                    content: inputViewDrawerInfo
                    , isOpen: openInputView
                }}

                {...surfaceBoardHandlers}
            >
                {({
                    payload
                    , payload: {
                        kind
                    }
                }) => {
                    if (!kind) {
                        const error = Object.assign(
                            new Error("[kind] is Required")
                            , { payload }
                        )
                        console.error(error)
                        throw error
                    }
                    const R = KNOWN_PAYLOAD_RENDERERS_BY_KIND[kind] as PayloadRenderer<KnownPayload>
                    return <R
                        payload={payload}
                    />
                }}
            </BoardSurfaceComponent>
        </div>
    )

}

