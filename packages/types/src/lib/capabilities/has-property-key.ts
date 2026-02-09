export type HasPropertyKey<
    K extends PropertyKey
> = { [k in K]: any }
