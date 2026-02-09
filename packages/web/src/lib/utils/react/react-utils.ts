// for now
import {
    DependencyList, EffectCallback, useEffect, useMemo
    , useState
    , useCallback,
    useLayoutEffect
} from "react"

// ========================================

/**
 * ---
 * **useState** for single [singleState]
 */
export const _use_state = <
    TState extends object
>(
    initialState = {} as TState
) => {

    type StateKey = Extract<keyof TState, string>

    type PartialState<
        K extends StateKey
    > =
        | {
            [k in K]: TState[k]
        }
        | TState

    type ReducerFn = (p: TState) => TState

    type SetStateFn =
        | (<K extends StateKey>(partial: PartialState<K>) => void)
        | ((reducerFn: ReducerFn) => void)

    const [state, _set_state_0] = useState(initialState)
        , setStateFn = useCallback(<
            K extends StateKey
        >(
            ...[arg_0]:
                | [
                    partial: PartialState<K>
                ]
                | [
                    reducerFn: ReducerFn
                ]
        ) => {
            const isReducerFn = typeof (arg_0) === "function"

                , reducerFn: ReducerFn = p => ({
                    ...p
                    , ...(isReducerFn ? arg_0(p) : arg_0)
                })

            _set_state_0(reducerFn)

        }, [_set_state_0])

        , _set_state_async = _cb([_set_state_0], async <
            K extends StateKey
        >(
            partial = {} as PartialState<K>
        ) => {
            return new Promise<TState>(
                res => {
                    _set_state_0(p => {
                        p = {
                            ...p
                            , ...partial
                        }
                        setTimeout(() => res(p))
                        return p
                    })
                })
        })

    return [
        state
        , setStateFn
        , _set_state_async
    ] as [
            state: TState
            , setStateFn: typeof setStateFn
            , _set_state_async: typeof _set_state_async
        ]

}

// ========================================

/**
 * ---
 * same as **useEffect**
 */
export const _effect = (
    ...args:
        | [
            effect: EffectCallback
        ]
        | [
            effect: EffectCallback
            , deps?: DependencyList
        ]
        | [
            deps: DependencyList
            , effect: EffectCallback
        ]
) => {
    const [
        effect
        , deps
    ] = (
        typeof (args[0]) === "function"
            ? args
            : [args[1], args[0]]
    ) as [
            effect: EffectCallback
            , deps?: DependencyList
        ]
    return useEffect(effect, deps)
}

    ,
    /**
     * ---
     * same as **useEffect**
     */
    _watch = _effect



    , _layoutEffect = (
        ...args:
            | [
                effect: EffectCallback
            ]
            | [
                effect: EffectCallback
                , deps?: DependencyList
            ]
            | [
                deps: DependencyList
                , effect: EffectCallback
            ]
    ) => {
        const [
            effect
            , deps
        ] = (
            typeof (args[0]) === "function"
                ? args
                : [args[1], args[0]]
        ) as [
                effect: EffectCallback
                , deps?: DependencyList
            ]
        return useLayoutEffect(effect, deps)
    }


// ========================================
/**
 * ---
 * same as **useMemo**
 * * defaults:
 *      * deps = []
 */
export const _memo = <
    T
>(
    ...args:
        | [
            factory: () => T
        ]
        | [
            factory: () => T
            , deps: DependencyList
        ]
        | [
            deps: DependencyList
            , factory: () => T
        ]
) => {
    const [
        factory
        , deps = []
    ] = (
        typeof (args[0]) === "function"
            ? args
            : [args[1], args[0]]
    ) as [
            factory: () => T
            , deps: DependencyList
        ]
    return useMemo(factory, deps)
}


// ========================================
/**
 * ---
 * same as **useCallback**
 * * defaults:
 *      * deps = []
 *
 */
export const _cb = <
    T extends Function
>(
    ...args:
        | [
            callback: T
        ]
        | [
            callback: T
            , deps: DependencyList
        ]
        | [
            deps: DependencyList
            , callback: T
        ]
) => {
    const [
        cb
        , deps = []
    ] = (
        typeof (args[0]) === "function"
            ? args
            : [args[1], args[0]]
    ) as [
            callback: T
            , deps: DependencyList
        ]
    return useCallback(cb, deps)
}