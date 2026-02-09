

export const _isIterable = <
    T extends any
>(v: unknown): v is Array<T> | Set<T> => Array.isArray(v) || (v instanceof Set)

    , _isEmpty = <T extends undefined | null>(v: unknown): v is T =>
        v === undefined
        || v === null
        || (typeof (v) === "string" && v.trim().length <= 0)

    , _isPresent = <
        T extends any
    >(
        v: unknown | T
    ): v is T => !_isEmpty(v)

    , _isNumber = (v: unknown): v is number => typeof (v) === "number"
    , _isString = (v: unknown): v is string => typeof (v) === "string"


    , _isStringArray = (v: unknown): v is string[] =>
        Array.isArray(v) && v.every(v => (typeof v) === "string")
