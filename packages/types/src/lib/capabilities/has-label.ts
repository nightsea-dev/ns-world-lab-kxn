
export type HasLabel<
    L extends any = unknown
> = {
    label: L
}

export type HasPartialLabel<
    L extends any = unknown
> = Partial<HasLabel<L>>





