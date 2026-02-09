
export type HasType<
    T extends any = unknown
> = {
    type: T
}

export type HasPartialType<
    T extends any = unknown
> = Partial<HasType<T>>



