import { HasUuid } from "../../../primitives"

export type User =
    & HasUuid
    & {
        // uuid: string
        name: string
        email: string
        job: string
    }



export type HasUser<
    U extends User = User
> = {
    user: U
}
export type HasUsers<
    U extends User = User
> = {
    users: U[]
}

export type HasAuthor<
    U extends User = User
> = {
    author: U
}
