import { Toggle } from 'rsuite'
import { TimerComponent, TimerProps } from './Timer.component'
import { padNumber as _p } from "@ns-world-lab-knx/logic"
import { _cn, _effect, _use_state, PickHtmlAttributes } from '../../../utils'

// ========================================
export type ClockWithShowToggleProps =
    & Partial<
        & TimerProps
        & {
            show: boolean
        }
        & PickHtmlAttributes<"className">
    >
// ========================================
export const ClockWithShowToggle = (
    {
        show: show_IN = true
        , time
        , refreshIntervalSeconds
        , className
        , onTick
        , ...rest
    }: ClockWithShowToggleProps
) => {

    const [state, _set_state] = _use_state({
        showTimer: false
    })

        , _toggleShowTimer = () => {
            _set_state({
                showTimer: !state.showTimer
            })
        }

    _effect([show_IN], () => {
        if (typeof (show_IN) !== "boolean") {
            return
        }
        _set_state({ showTimer: show_IN })
    })

    return (
        <div
            {...rest}
            className={_cn(
                "flex items-center bg-gray-100"
                , className
            )}
        >
            {/* <Button
                appearance='primary'
                className="mr-2"
                onClick={_toggleShowTimer}
            >
                {state.showTimer ? 'Hide Clock' : 'Show Clock'}
            </Button> */}
            <Toggle
                checked={state.showTimer}
                checkedChildren="Hide Clock"
                unCheckedChildren="Show Clock"
                onChange={_toggleShowTimer}
            />
            {/* <button
                className="px-4 py-2 rounded-[10px] cursor-pointe m-2"
                style={{
                    backgroundColor: '#00b7f3',
                    color: 'white',
                }}
                onClick={_toggleShowTimer}
            >
                {state.showTimer ? 'Hide Clock' : 'Show Clock'}
            </button> */}
            {state.showTimer
                && <TimerComponent
                    {...{
                        time
                        , refreshIntervalSeconds
                        , onTick
                    }}

                />}
        </div>
    )
}
