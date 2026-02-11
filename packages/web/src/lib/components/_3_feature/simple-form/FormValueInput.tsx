import { HTMLAttributes } from "react"
import { Input } from "rsuite"
import { _capitalise } from "@ns-world-lab/logic"
import { KeyOf } from "@ns-world-lab/types"
import { _memo } from "../../../utils"

// ======================================== types
export type ValidInputValue =
    | string
    | number


// ======================================== props
type BaseFormValueInputProps<
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

export type FormValueInputProps<
    K extends string
    , V extends ValidInputValue
> =
    & BaseFormValueInputProps<K, V>
    & Omit<
        HTMLAttributes<HTMLElement>
        , KeyOf<BaseFormValueInputProps<K, V>>
    >

// ======================================== component - FormInput
export const FormValueInput = <
    K extends string
    , V extends ValidInputValue
>({
    k
    , v
    , onChange
    , ...rest
}: FormValueInputProps<K, V>
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
