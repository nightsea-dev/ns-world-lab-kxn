export type HasUrl<
    U extends string | URL = string
> = {
    url: U
}

export type HasPartialUrl<
    U extends string | URL = string
> = Partial<HasUrl<U>>