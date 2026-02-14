
export type HasCurrent<
    D extends any = unknown
> = {
    current: D
}

export type HasPartialCurrent<
    D extends any = unknown
> = Partial<HasCurrent<D>>



