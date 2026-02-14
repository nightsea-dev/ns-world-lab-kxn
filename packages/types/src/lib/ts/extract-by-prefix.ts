

export type ExtractByPrefix<
    Px extends string
    , T extends object
> = {
        [K in keyof T as K extends string
        ? (K extends `${Px}${string}` ? K : never)
        : never
        ]: T[K]
    }