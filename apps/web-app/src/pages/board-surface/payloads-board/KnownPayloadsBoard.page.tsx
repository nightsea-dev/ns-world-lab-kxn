import {
    _effect
    , _memo,
    _use_state,
    PayloadRenderer,
    DrawerInfo,
    BoardSurface,
    PayloadLoader_Props,
} from '@ns-world-lab-kxn/web'
import {
    _capitalise,
    createIdeaWithAuthor,
    pickFromAsArray,
    pickFromAsTuple,
} from "@ns-world-lab-kxn/logic"
import { PickRequired } from '@ns-world-lab-kxn/types'
import { useRef } from 'react'
import { KNOWN_SURFACEBOARD_PAYLOAD_INFOS_MAP, KnownPayload_Type, KnownPayload_Kind } from './KnownPayloadInfo'

// ======================================== helpers


// ======================================== CONST


type M_State =
    | {
        name: "IDLE"
        lastestAction?: string
    }
    | {
        name: "SHOWING DRAWER"
        payloadKind: KnownPayload_Kind
    }


type State =
    & {
        payloads: KnownPayload_Type[]
        isFirstRender: boolean
        m_state: M_State
    }


// ======================================== props
export type KnownPayloadsBoard_Page_Props =
    & Partial<
        & Pick<
            BoardSurface.Props<KnownPayload_Type>,
            | "data"
            | "onPayloadsAdded"
            | "onPayloadsRemoved"
            | "onChange"
        >
    >
// ======================================== component
export const KnownPayloadsBoard_Page = ({
    data: data_IN
    , ...rest
}: KnownPayloadsBoard_Page_Props
) => {

    const [state, _set_state] = _use_state({
        payloads: []
        , isFirstRender: true
        , m_state: { name: "IDLE" }
    } as State)

        , {
            current: _refs
        } = useRef({} as {
            boardSurfaceRef?: BoardSurface.Ref<KnownPayload_Type> | null
        })


        // , { openInputView } = _memo([state.m_state.name], () => {

        //     const openInputView = state.m_state.name === "SHOWING DRAWER"

        //     console.log({
        //         "state.m_state.name": state.m_state.name
        //         , openInputView
        //     })

        //     // debugger

        //     return { openInputView }

        // })

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

            , onChange: ({
                eventKind
                , payloads
                , surfaceNodes
            }) => _set_state({ payloads })

            , onControlPanelNumberOfItemsEnterKey: ({
                numberOfItems
                , showInfo
                , cb
            }) => {

                const payloadKind = "idea" as KnownPayload_Kind

                cb({
                    payloadKind
                    , doContinue:
                        numberOfItems <= 1
                        || confirm(
                            `Sure to Add ${numberOfItems} ${_capitalise(payloadKind)}${numberOfItems === 1 ? "" : "s"}?`
                        )
                })

            }
        } as PickRequired<
            BoardSurface.Props<KnownPayload_Type>,
            | "onInputViewClose"
            | "onChange"
            | "onControlPanelNumberOfItemsEnterKey"
        >

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
        } as PayloadLoader_Props<KnownPayload_Type>

    // Pick<KnownPayloadLoaderProps<KnownPayloadKind>, "onCancel" | "onClear" | "onDone">




    // , { inputViewDrawerInfo } = _memo([
    //     state.m_state.name
    //     , ...pickFromAsArray(inputViewHanders)
    //     // , surfaceBoardHandlers.onInputViewClose
    //     // , surfaceBoardHandlers.onPayloadsAdded
    //     // , surfaceBoardHandlers.onPayloadsRemoved
    // ], () => {

    //     const { m_state } = state

    //     if (m_state.name !== "SHOWING DRAWER") {
    //         return {}
    //     }

    //     const {
    //         header
    //         , body: R
    //     } = KNOWN_PAYLOAD_LOADER_DRAWER_INFOS_MAP[
    //     m_state.payloadKind
    //     ]!

    //     if (typeof (R) !== "function") {
    //         throw new Error(`[R] must be a function`)
    //     }

    //     console.log("R", R.name)

    //     return {
    //         inputViewDrawerInfo: {
    //             header
    //             , body: (
    //                 <R
    //                     {...inputViewHanders}
    //                 // onCancel={_handle_BoardSurface_InputView_Close}
    //                 // onDone={_handle_BoardSurface_InputView_Done_addPayloads}
    //                 // onClear={_handle_BoardSurface_InputView_Clear}
    //                 />
    //             )
    //         } as DrawerInfo
    //     }
    // })

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
            <BoardSurface.Component<KnownPayload_Type>
                {...rest}

                data={state.payloads}

                payloadInfosMap={KNOWN_SURFACEBOARD_PAYLOAD_INFOS_MAP}

                boardSurfaceRef={ref => {
                    _refs.boardSurfaceRef = ref
                }}

                {...surfaceBoardHandlers}


            >
                {/* {({
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
                }} */}
            </BoardSurface.Component>
        </div>
    )

}

