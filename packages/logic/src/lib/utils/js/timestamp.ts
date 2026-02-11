import { _isString } from "./js-native"


type HasName = { name: string }

export const timestamp = (
    d = new Date()
) => d.toISOString().split(/[tz]/img)[1]

    , _t = (
        date_or_suffix = new Date() as Date | string | HasName | undefined
    ) => {
        const {
            d
            , suffix
        }: {
            d?: Date
            suffix?: string
        } = date_or_suffix instanceof Date
                ? {
                    d: date_or_suffix
                }
                : _isString(((date_or_suffix ?? {}) as HasName).name)
                    ? {
                        suffix: ` ${(date_or_suffix as HasName).name} `
                    }
                    : {
                        suffix: ` ${date_or_suffix} `
                    }
        return `[${timestamp(d)}]${suffix}`
    }