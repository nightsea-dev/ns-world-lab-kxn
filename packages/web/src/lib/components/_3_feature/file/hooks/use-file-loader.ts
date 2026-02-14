import { toRemoveByKey } from "@ns-world-lab/logic"
import { LoadedFileItemWithPartialError } from "../../../../types"
import { _revokeUrls, _use_state } from "../../../../utils"

export type Props = {
    loadedFileItems: LoadedFileItemWithPartialError[]
    loadFn: () => LoadedFileItemWithPartialError
    reverseListAdding: boolean
    onChange: (
        ev:
            & {
                loadedFileItems: LoadedFileItemWithPartialError[]
            }
            & (
                | {
                    eventKind: "added fileItems"
                    addedFileItems: LoadedFileItemWithPartialError[]
                }
                | {
                    eventKind: "removed items"
                    removedFileItems: LoadedFileItemWithPartialError[]
                }
                | {
                    eventKind: "clear"
                }
            )
    ) => void
}


/**
 * @DO_NOT_USE WIP
 */
export const useFileLoader = ({
    loadedFileItems
    , reverseListAdding
    , onChange
}: Props) => {

    const [state, _set_state] = _use_state({
        loadedFileItems: [] as LoadedFileItemWithPartialError[]
    })

        , _emit_Change: Props["onChange"]
            = ev => onChange?.(ev)

        , _add_Files = ({
            files: fileItemsToAdd
        }: {
            files: LoadedFileItemWithPartialError[]
        }) => {

            if (!fileItemsToAdd.length) {
                return
            }

            const {
                loadedFileItems: current_loadedFileItems
            } = state


            let latestAction = `ADD FILE ITEMS | current_loadedFileItems: ${current_loadedFileItems.length}`

            if (fileItemsToAdd.length) {
                const next_loadedFileItems = [...current_loadedFileItems]
                next_loadedFileItems[
                    reverseListAdding
                        ? "unshift" : "push"
                ](...(
                    reverseListAdding
                        ? fileItemsToAdd.reverse()
                        : fileItemsToAdd
                ))
                latestAction = `ADDED FILE ITEMS | fileItemsToAdd: ${fileItemsToAdd.length}`
                _set_state({
                    loadedFileItems: next_loadedFileItems
                })
                _emit_Change({
                    eventKind: "added fileItems"
                    , loadedFileItems: next_loadedFileItems
                    , addedFileItems: fileItemsToAdd
                })
            } else {
                latestAction = "NO NEW FILES"
            }

            console.log(latestAction)


            return {
                /**
                 * * current_loadedFileItems
                 */
                loadedFileItems: current_loadedFileItems
                , addedFileItems: fileItemsToAdd
            }

        }


        , _remove_FileItems = (
            ...fileItemToRemove: (LoadedFileItemWithPartialError | LoadedFileItemWithPartialError[])[]
        ) => {

            const requestedFilesToRemove = fileItemToRemove.flat(1)

            if (!requestedFilesToRemove.length) {
                return {}
            }

            const { loadedFileItems: current_loadedFileItems } = state
                , {
                    toRemove: removedFileItems
                    , toKeep: next_loadedFileItems
                } = toRemoveByKey(
                    current_loadedFileItems
                    , requestedFilesToRemove
                    , "fileID"
                )

            if (removedFileItems.length) {
                _revokeUrls(removedFileItems)
                _emit_Change({
                    eventKind: "removed items"
                    , loadedFileItems: next_loadedFileItems
                    , removedFileItems
                })
            }

            // _set_state({
            //     m_state: {
            //         name: "IDLE"
            //         , latestAction: `[REMOVE FILE]  `
            //     }
            // })

            return {
                loadedFileItems: next_loadedFileItems
                , removedFileItems
            }
        }

        , _clear = () => {
            _remove_FileItems(...state.loadedFileItems)
            _set_state(p => {
                _emit_Change({
                    eventKind: "clear"
                    , loadedFileItems: p.loadedFileItems
                })
                return p
            })
        }

    return {
        _remove_FileItems
        , _clear
        , _add_Files
    }
}