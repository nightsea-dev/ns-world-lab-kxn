import { HTMLAttributes } from "react"
import { Input } from "rsuite"
import { _capitalise } from "@ns-world-lab/logic"
import { KeyOf } from "@ns-world-lab/types"
import { _memo } from "../../../utils"

// ======================================== types
type ValidInputValue =
    | string
    | number


// ======================================== props
type BaseProps<
    K extends string
    , V extends ValidInputValue
> =
    & {
        k: K
        v: V
        onChange: (
            partial: {
                [k in K]: V
            }
        ) => void
    }

export type FormValueInput_Props<
    K extends string
    , V extends ValidInputValue
> =
    & BaseProps<K, V>
    & Omit<
        HTMLAttributes<HTMLElement>
        , KeyOf<BaseProps<K, V>>
    >

// ======================================== component - FormInput
const FormValueInput = <
    K extends string
    , V extends ValidInputValue
>({
    k
    , v
    , onChange
    , ...rest
}: FormValueInput_Props<K, V>
) => {

    const label = _memo([k], () => _capitalise(k))
        , { fn, t } = _memo([], () => {
            return typeof (v) === "string" ? {
                t: "text"
                , fn: (v: string) => v
            } : {
                t: "number"
                , fn: (v: string) => Number(v)
            }

        })
        , _handleChange = (v: string) => {
            onChange?.({
                [k]: fn(v)
            } as any)
        }

    return (
        <div
            {...rest}
            data-text-number-form-input
        >
            <div
                className="text-[14px]"
            >
                {label}
            </div>
            <Input
                type={t}
                value={v}
                placeholder={label}
                onChange={_handleChange}
            // onKeyUp={_handleKeyUp}
            // style={{
            //     width: "75%"
            // }}
            />
        </div>
    )
}


export {
    type ValidInputValue as SimpleFormValidInputValue
    , FormValueInput as SimpleFormFormValueInput
}
