import { KeyOf } from "../ts"

export type HasPropertyKey<
    K extends PropertyKey
> = { [k in K]: any }




// ========================================
export type StringOrNumberValue = string | number

export type HasKeyWithStringOrNumberValue<
    K extends StringOrNumberValue = "id"
> = {
        [k in K]: StringOrNumberValue
    }


export type EnsuredDataHasKeyWithStringOrNumberValue<
    TData extends HasKeyWithStringOrNumberValue<StringOrNumberValue>
    , K extends KeyOf<TData> | StringOrNumberValue = "id"
> = TData extends HasKeyWithStringOrNumberValue<K> ? TData : never
