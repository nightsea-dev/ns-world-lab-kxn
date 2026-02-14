import { EnsuredDataHasKeyWithStringOrNumberValue, HasCurrent, HasData, HasKeyWithStringOrNumberValue, KeyOf, StringOrNumberValue } from "@ns-world-lab/types"
import { _cb, _effect, _memo, _use_state } from "../utils"
import { _getSetOfKeys, _t } from "@ns-world-lab/logic"
import { useRef } from "react"

type State<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> = HasCurrent<EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[]>

type GetStateAsyncFn<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> = () => Promise<State<TData, K>>

type ActionFn<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> = (ev: HasData<(EnsuredDataHasKeyWithStringOrNumberValue<TData, K> | EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[])>) => void

type ActionHandlersMap<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> = {
    add: ActionFn<TData, K>
    remove: ActionFn<TData, K>
    set: ActionFn<TData, K>
    clear: () => void
    getStateAsync: GetStateAsyncFn<TData, K>
}

type ActionKey = KeyOf<ActionHandlersMap<any, any>>

type ActionChangeEvent<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> =
    & {
        current: EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[]
    }
    & (
        | {
            action: Extract<ActionKey, "clear">
        }
        | {
            action: Extract<ActionKey, "set">
            data: EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[]
        }
        | {
            action: Extract<ActionKey, "add">
            added: EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[]
        }
        | {
            action: Extract<ActionKey, "remove">
            removed: EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[]
        }
    )

type ActionChangeEventHandler<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> = (ev: ActionChangeEvent<TData, K>) => void



type Input<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> =
    & {
        /**
         * [key:K] cannot change
         */
        key: K
        initialData?: EnsuredDataHasKeyWithStringOrNumberValue<TData, K>[]
        reversedListAdding?: boolean
        onChange?: ActionChangeEventHandler<TData, K>
    }


type Output<
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
> = {
    state: State<TData, K>
    /**
     * [memoised]
     */
    actionHandlers: ActionHandlersMap<TData, K>

    handleActionEvent: ActionChangeEventHandler<TData, K>

    getStateAsync: GetStateAsyncFn<TData, K>
}

// ========================================
export const useCollectionWithKey = <
    TData extends HasKeyWithStringOrNumberValue<K>
    , K extends KeyOf<TData>
>({
    key: k
    , initialData
    , reversedListAdding = false
    , onChange: onChange_IN
}: Input<TData, K>
): Output<TData, K> => {

    type _State = State<TData, K>
    type _Data = EnsuredDataHasKeyWithStringOrNumberValue<TData, K>
    type _ChangeEvent = ActionChangeEvent<TData, K>
    type _ActionMap = ActionHandlersMap<TData, K>
    type _Output = Output<TData, K>

    const [state, _set_state] = _use_state<_State>({
        current: initialData ?? []
    })
        , stateRef = useRef(state)
        , getStateAsync = _cb<
            Output<TData, K>["getStateAsync"]
        >(async () => Promise.resolve(stateRef.current))

        , actionHandlers = _memo<
            _Output["actionHandlers"]
        >([
            onChange_IN
            , reversedListAdding
        ], () => {
            console.log({ reversedListAdding })

            const _emit = (
                ev: _ChangeEvent
            ) => {
                ; !onChange_IN || setTimeout(() => onChange_IN(ev))
            }

            return {
                getStateAsync
                , add: ({ data: data_IN }) => _set_state(p => {
                    const items = [data_IN].flat(1) as _Data[]
                        , current_ids = _getSetOfKeys({ k, items: p.current })
                        , added = items.filter(o => !current_ids.has(o[k]))

                    if (!added.length) {
                        return p
                    }
                    p = { ...p }
                    const current = p.current = [...p.current]
                    if (reversedListAdding) {
                        current.unshift(...[...added].reverse())
                    } else {
                        current.push(...added)
                    }
                    _emit({
                        action: "add"
                        , added
                        , ...p
                    })
                    return p
                })

                , remove: ({ data: toRemove_IN }) => {
                    const toRemove = [toRemove_IN].flat(1) as _Data[]
                        , idsToRemove = _getSetOfKeys({ k, items: toRemove })
                    if (!idsToRemove.size) {
                        return
                    }
                    _set_state(p => {
                        // debugger
                        const removed = [] as _Data[]
                            , remainder = [] as _Data[]
                        p.current.forEach(o =>
                            (idsToRemove.has(o[k as K]) ? removed : remainder).push(o)
                        )
                        if (!removed.length) {
                            return p
                        }
                        p = { ...p, current: remainder }
                        _emit({
                            action: "remove"
                            , removed
                            , ...p
                        })
                        return p
                    })
                }

                , set: ({ data: data_IN }) => _set_state(p => {
                    const items = [data_IN].flat(1) as _Data[]
                    p = { ...p }
                    p.current = [...items]
                    _emit({
                        action: "set"
                        , ...p
                        , data: items
                    })

                    return p
                })
                , clear: () => _set_state(p => {
                    if (!p.current.length) {
                        return p
                    }
                    p = { current: [] }
                    _emit({
                        action: "clear"
                        , ...p
                    })
                    return p
                })
            }
        })

        , handleActionEvent = _cb<
            ActionChangeEventHandler<TData, K>
        >([actionHandlers], (ev) => {
            const {
                action
                , current: _
            } = ev

            switch (action) {
                case "add": {
                    return actionHandlers.add({ data: ev.added })
                }
                case "remove": {
                    return actionHandlers.remove({ data: ev.removed })
                }
                case "set": {
                    return actionHandlers.set({ data: ev.data })
                }
                case "clear": {
                    return actionHandlers.clear()
                }
            }

        })



    _effect([state], () => {
        stateRef.current = state
    })

    return {
        state
        , actionHandlers
        , handleActionEvent
        , getStateAsync
    }
}




export {
    type ActionChangeEvent as UseCollectionWithKey_ActionChangeEvent
    , type ActionChangeEventHandler as UseCollectionWithKey_ActionChangeEventHandler

    , type ActionFn as UseCollectionWithKey_ActionFn
    , type ActionHandlersMap as UseCollectionWithKey_ActionHandlersMap
    , type ActionKey as UseCollectionWithKey_ActionKey

    , type Input as UseCollectionWithKey_Input
    , type Output as UseCollectionWithKey_Output
}


