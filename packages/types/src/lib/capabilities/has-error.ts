

export type HasError<
    E extends string | Event | Error = Error
> = {
    error: E
}

export type HasPartialError<
    E extends string | Event | Error = Error
> = Partial<HasError<E>>