import {
    HasPayloadWithKind
    , PayloadWithKind,
    XOR
} from "@ns-world-lab/types"
import { _isString } from "@ns-world-lab/logic"
import { _cn, _effect, _memo } from "../../../../../utils"

// ======================================== types

// ======================================== PayloadRenderer/props
type Props<
    TPayload extends PayloadWithKind<any>
> =
    & HasPayloadWithKind<TPayload>

// ======================================== PayloadRenderer/component-type
export type PayloadRenderer_FC<
    TPayload extends PayloadWithKind<any>
    , TProps extends Props<TPayload> = Props<TPayload>
> = React.FC<TProps>

// ======================================== PayloadRenderer/capability
export type HasPayloadRenderer<
    TPayload extends PayloadWithKind<any>
    , TProps extends Props<TPayload> = Props<TPayload>
> = {
    payloadRenderer: PayloadRenderer_FC<TPayload, TProps>
}
export type HasPartialPayloadRenderer<
    TPayload extends PayloadWithKind<any>
    , TProps extends Props<TPayload> = Props<TPayload>
> = Partial<HasPayloadRenderer<TPayload, TProps>>








export {
    type Props as PayloadRenderer_Props
}



export namespace PayloadRenderer {
    export type FC<
        TPayload extends PayloadWithKind<any>
        , TProps extends Props<TPayload> = Props<TPayload>
    > = PayloadRenderer_FC<TPayload, TProps>
}

