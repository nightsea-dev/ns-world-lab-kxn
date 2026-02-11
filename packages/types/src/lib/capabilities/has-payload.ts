import { KindBase } from "./has-kind"

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


export type HasPayloadKind<
    K extends KindBase
> = {
    payloadKind: K
}
