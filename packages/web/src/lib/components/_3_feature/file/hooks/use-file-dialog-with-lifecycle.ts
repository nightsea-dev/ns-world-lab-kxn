import { ChangeEvent, HTMLAttributes, Ref, useRef } from "react"
import { EventHandlersFromMap, ExtractEventHandlersMap, ExtractEventHandlersMapPartial, HasData } from "@ns-world-lab/types"
import { FileItemWithUrlAndFileIDAndID, HasFileLoader_EventHandlers, InputFileItemList } from "../../../../types"
import { _effect, _memo, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID, _use_state } from "../../../../utils"
import { EventHandlersFromMapPartial } from "../../../../../../../types/src/lib/composites/events/event-handlers-from-map"

type FileDialogLifeCycleStateState =
    | {
        name: "IDLE"
        latestAction?: string | "SELECTED" | "CLOSED"
    }
    | {
        name: "OPENING"
    }


// ======================================== hook/types

type InputHandlers =
    & EventHandlersFromMap<{
        click: {}
        change: ChangeEvent<HTMLInputElement>
        // load: HasData<FileItemWithUrlAndFileIDAndID[]>
    }>


type Input =
    & {
        inputRef: React.RefObject<HTMLInputElement | null>
        disabled?: boolean
    }
    & EventHandlersFromMapPartial<{
        load: HasData<FileItemWithUrlAndFileIDAndID[]>
    }>
// & Partial<
//     & HasFileLoader_EventHandlers
// >

type Output =
    & {
        lifecycle_state: FileDialogLifeCycleStateState
        inputHandlers: InputHandlers
    }


// ======================================== hook
export const useFileDialogWithLifecycle = ({
    inputRef: inputRef_IN
    , disabled
    , onLoad: onLoad_IN
}: Input
): Output => {
    const { current: _refs } = useRef({
        pending: false
        , selected: false
    })
        , [
            lifecycle_state
            , _set_state
        ] = _use_state<FileDialogLifeCycleStateState>({ name: "IDLE" })

        , {
            inputHandlers
        }: Pick<Output, "inputHandlers">
            = _memo([inputRef_IN, disabled], () => {
                const _openDialogFn = () => {
                    if (disabled) {
                        return
                    }
                    _refs.pending = true
                    _refs.selected = false
                    inputRef_IN.current?.click()
                }
                return {
                    inputHandlers: {
                        onClick: () => {
                            _refs.pending = true
                            _refs.selected = false
                            _set_state({ name: "OPENING" })
                            _openDialogFn()
                        }
                        , onChange: ev => {
                            const loadedFileItems = _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID(ev.target.files)
                            _refs.pending = false
                            _refs.selected = !!loadedFileItems.length
                            ev.target.value = ""
                            // ; !inputRef_IN.current || (inputRef_IN.current.value = "")

                            let latestAction = ""
                            if (loadedFileItems.length) {
                                onLoad_IN?.({ data: loadedFileItems })
                                console.log(latestAction = `LOADED FILES: ${loadedFileItems.length}`)
                            } else {
                                console.log(latestAction = "NO NEW FILES")
                            }
                            _set_state({
                                name: "IDLE"
                                , latestAction
                            })
                        }
                    }
                }
            })




    _effect(() => {
        const onWindowFocus = () => {
            if (!_refs.pending) {
                return
            }

            const didSelect = _refs.selected
            _refs.pending
                = _refs.selected
                = false

            _set_state({
                name: "IDLE"
                , latestAction: didSelect ? "SELECTED" : "CLOSED"
            })
        }

        window.addEventListener("focus", onWindowFocus, true)
        return () => {
            window.removeEventListener("focus", onWindowFocus, true)
            // revokeUrlsFn()
        }
    })

    return {
        lifecycle_state
        , inputHandlers
    }
}





export {
    type Input as UseFileDialogLifecycle_Input
    , type Output as UseFileDialogLifecycle_Output
    , type InputHandlers as UseFileDialogLifecycle_InputHandlers
}

