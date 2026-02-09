



export const timestamp = (
    d = new Date()
) => d.toISOString().split(/[tz]/img)[1]

    , _t = (
        date_or_suffix = new Date() as Date | string
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
                : {
                    suffix: ` ${date_or_suffix} `
                }
        return `[${timestamp(d)}]${suffix}`
    }