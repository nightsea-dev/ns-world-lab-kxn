import { HTMLAttributes } from "react";
import { KeyOf } from "@ns-world-lab-kxn/types"



export type PickHtmlAttributes<
    Pk extends KeyOf<HTMLAttributes<T>> = KeyOf<HTMLAttributes<HTMLElement>>
    , T = HTMLElement
> = Pick<HTMLAttributes<T>, Pk>


export type OmitHtmlAttributes<
    Om extends KeyOf<HTMLAttributes<T>>
    , T = HTMLElement
> = Omit<HTMLAttributes<T>, Om>

export type PickAndOmitHtmlAttributes<
    PK extends KeyOf<HTMLAttributes<T>>
    , Om extends KeyOf<HTMLAttributes<T>>
    , T = HTMLElement
> =
    & Omit<PickHtmlAttributes<PK, T>, Om>



export type {
    PickHtmlAttributes as HasHtmlAttributes
    , OmitHtmlAttributes as HasHtmlAttributesOmitted
}


export type OmitHtmlAttributesFrom<
    T
> = Omit<T, KeyOf<HTMLAttributes<HTMLElement>>>
