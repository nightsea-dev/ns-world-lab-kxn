import { useState, useEffect } from 'react'
import { EventHandlersFromMap } from '@ns-world-lab-kxn/types'
import { padNumber as _p } from "@ns-world-lab-kxn/logic"
import { _cn, _effect, _use_state, PickHtmlAttributes } from '../../utils'



export type TimerState = {
    startTime: number
    lapsed: number
}
export type TimerEventsMap = {
    tick: TimerState
}


export type TimerProps =
    & Partial<
        & {
            refreshIntervalSeconds: number
            time: Date
        }
        & EventHandlersFromMap<TimerEventsMap>
    >
    & PickHtmlAttributes<"className">

// ========================================
export const TimerComponent = ({
    refreshIntervalSeconds
    , time: time_IN
    , onTick
    , ...rest
}: TimerProps
) => {

    const [state, _set_state] = _use_state({
        startTime: Date.now()
        , lapsed: 0
    })

        , currentTime = new Date(
            state.startTime + state.lapsed
        )

    _effect([refreshIntervalSeconds], () => {
        refreshIntervalSeconds = Math.max(.2, Math.min(60, refreshIntervalSeconds ?? 1))
        const id = setInterval(() => {
            _set_state({
                lapsed: Date.now() - state.startTime
            })
        }, refreshIntervalSeconds * 1000)
        return () => {
            clearInterval(id)
        }
    })

    _effect([time_IN], () => {
        _set_state({
            startTime: (time_IN ?? new Date()).valueOf()
            , lapsed: 0
        })
    })

    _effect([state.startTime, state.lapsed, onTick], () => {
        onTick?.({ ...state })
    })


    return (
        <div
            {...rest}
            className={_cn(
                "px-2"
                , rest.className
            )}
        >
            {_p(currentTime.getHours())}:{_p(currentTime.getMinutes())}:{_p(currentTime.getSeconds())}
        </div>
    )
}
