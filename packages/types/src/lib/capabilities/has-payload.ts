import { SuffixedKey, SuffixedString } from "../ts";

export type HasPayload<
    P extends any = unknown
> = {
    payload: P
}

export type HasPayloads<
    P extends any = unknown
> = {
    payloads: P[]
}