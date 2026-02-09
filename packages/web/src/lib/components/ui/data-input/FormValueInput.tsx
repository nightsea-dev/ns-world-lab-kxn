import { _capitalise } from "@ns-lab-knx/logic"
import { _cn, _memo, PickHtmlAttributes } from "../../../utils"
import { Input } from "rsuite"
import { KeyOf } from "@ns-lab-knx/types"
import { HTMLAttributes } from "react"


export type ValidFormValue =
    | string
    | number


// ======================================== types
type BaseFormValueInputProps<
    K extends string
    , V extends ValidFormValue
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
    , V extends ValidFormValue
> =
    & BaseFormValueInputProps<K, V>
    & Omit<
        HTMLAttributes<HTMLElement>
        , KeyOf<BaseFormValueInputProps<K, V>>
    >

// ======================================== component - FormInput
export const FormValueInput = <
    K extends string
    , V extends ValidFormValue
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
