import { ChangeEvent, HTMLAttributes, useRef } from "react"
import { EventHandlersFromMap } from "@ns-world-lab-kxn/types"
import { HasFileLoader_EventHandlers, InputFileItemList } from "../../../types"
import { _effect, _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID, _use_state } from "../../../utils"

type FileDialog_M_State =
    | {
        name: "IDLE"
        latestAction?: string | "SELECTED" | "CLOSED"
    }
    | {
        name: "OPENING"
    }


// ======================================== hook/types
export type UseFileDialogLifecycleInput =
    & Partial<
        HasFileLoader_EventHandlers
    >

export type UseFileDialogLifecycleOutput =
    & {
        lifecycle_state: {
            dialogMState: FileDialog_M_State;
        }
    }
    & Pick<HTMLAttributes<HTMLInputElement>, "onClick">
    & EventHandlersFromMap<{
        change: ChangeEvent<HTMLInputElement>
    }>



// ======================================== hook
export const useFileDialogLifecycle = ({
    onLoad
}: UseFileDialogLifecycleInput
): UseFileDialogLifecycleOutput => {
    const { current: _refs } = useRef({
        pending: false
        , selected: false
    })
        , [
            lifecycle_state
            , _set_state
        ] = _use_state({
            dialogMState: { name: "IDLE" } as FileDialog_M_State
            ,
            /**
             * * [lifecycle_state_selectedFiles]
             */
            // selectedFiles: [] as FileWithUrl[]
        })

        ,
        /**
         * * [lifecycle]
         */
        onClick: UseFileDialogLifecycleOutput["onClick"] = () => {
            _refs.pending = true
            _refs.selected = false
            _set_state({
                dialogMState: { name: "OPENING" }
            })
        }

        ,
        /**
         * * [lifecycle]
         */
        _processFiles = (
            inputFileItem: InputFileItemList
        ) => {

            const loadedFileItems = _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID(inputFileItem)
            let latestAction = ""
            if (loadedFileItems.length) {
                onLoad?.({ loadedFileItems })
                console.log(latestAction = `LOADED FILES: ${loadedFileItems.length}`)
            } else {
                console.log(latestAction = "NO NEW FILES")
            }
            _set_state({
                dialogMState: {
                    name: "IDLE"
                    , latestAction
                }
            })
        }

        ,
        /**
         * * [lifecycle]
         */
        onChange: UseFileDialogLifecycleOutput["onChange"]
            = ev => _processFiles(ev.target.files)


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
                dialogMState: {
                    name: "IDLE"
                    , latestAction: didSelect ? "SELECTED" : "CLOSED"
                }
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
        , onClick
        , onChange
    }
}



