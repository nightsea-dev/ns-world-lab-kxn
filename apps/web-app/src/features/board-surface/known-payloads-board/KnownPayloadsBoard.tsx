import {
    _effect
    , _memo,
    _use_state,
    PayloadRenderer,
    DrawerInfo,
    BoardSurface,
} from '@ns-world-lab-kxn/web'
import {
    _capitalise,
    createIdeaWithAuthor,
    pickFromAsArray,
    pickFromAsTuple,
} from "@ns-world-lab-kxn/logic"
import { PickRequired } from '@ns-world-lab-kxn/types'
import {
    KNOWN_PAYLOAD_RENDERERS_BY_KIND
    , KnownPayload
    , KnownPayloadKind
} from './KnownPayload.renderers'
import {
    IFramePayloadLoader,
    ImagePayloadLoader,
    KNOWN_PAYLOAD_LOADER_DRAWER_INFOS_MAP
    , KnownPayloadLoaderProps
} from './KnownPayload.loaders'
import { useRef } from 'react'
import {
    IdeaPayloadRenderer
    , IFrameInputView, IFramePayloadRenderer
    , ImageInputView, ImagePayloadRenderer
} from '../../../components'

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
            BoardSurface.Props<KnownPayload>,
            | "data"
            | "onPayloadsAdded"
            | "onPayloadsRemoved"
            | "onChange"
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
            boardSurfaceRef?: BoardSurface.Ref<KnownPayload> | null
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

                const payloadKind = "idea" as KnownPayloadKind

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
            BoardSurface.Props<KnownPayload>,
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
        } as Pick<KnownPayloadLoaderProps<KnownPayloadKind>, "onCancel" | "onClear" | "onDone">





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
            <BoardSurface.Component<KnownPayload>
                {...rest}

                data={state.payloads}

                payloadInfosMap={{
                    idea: {
                        factory: ({ numberOfItems }) =>
                            Array.from({ length: numberOfItems })
                                .map(() => createIdeaWithAuthor())
                        , buttonLabel: "Add Idea"
                        , payloadRenderer: IdeaPayloadRenderer
                    }
                    , iframe: {
                        buttonLabel: "Add IFrame"
                        , inputView: ({
                            onCancel
                            , onDone
                        }) => <IFrameInputView
                                onCancel={onCancel}
                                onDone={({ data }) => {
                                    // transformation
                                    onDone({
                                        data: data.map(({
                                            id
                                            , name
                                            , url: src
                                        }) => ({
                                            kind: "iframe"
                                            , id
                                            , name
                                            , src
                                        }))
                                    })
                                }}
                            />
                        , payloadRenderer: IFramePayloadRenderer
                    }
                    , image: {
                        buttonLabel: "Add Image"
                        , inputView: ({
                            onCancel
                            , onDone
                        }) => <ImageInputView
                                onCancel={onCancel}
                                onDone={({
                                    data
                                }) => {
                                    // transformation
                                    onDone({
                                        data: data.map(
                                            loadedFileItem => ({
                                                kind: "image"
                                                , file: loadedFileItem
                                                , name: loadedFileItem.name
                                                , size: loadedFileItem.size

                                                , src: loadedFileItem.url
                                                , id: loadedFileItem.fileID
                                                , mimeType: loadedFileItem.type
                                                // , extent: loadedFileItem.
                                            }))
                                    })

                                }}
                            />
                        , payloadRenderer: ImagePayloadRenderer
                    }
                }}

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

