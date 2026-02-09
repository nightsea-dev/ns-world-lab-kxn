export type HasFile<
    F extends File = File
> = {
    file: F
}

export type HasPartialFile<
    F extends File = File
> = Partial<HasFile<F>>