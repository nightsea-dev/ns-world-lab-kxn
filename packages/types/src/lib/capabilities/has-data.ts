
export type HasData<
    D extends any = unknown
> = {
    data: D
}

export type HasPartialData<
    D extends any = unknown
> = Partial<HasData<D>>



