import { ExtractEventHandlersMap, ExtractEventsMap, IdeaWithKindAndAuthor, KeyOf, User } from "@ns-world-lab/types"
import { _t, createIdeaWithAuthor, createUser, keysOf } from "@ns-world-lab/logic"
import { IdeasBoard_Page, KnownPayloadsBoard_Page } from "./board-surface"
import { UserAdmin_Page } from "./user-admin"
import { ComponentProps, ReactNode } from "react"

export const PAGES_MAP = {
    IdeasBoard: IdeasBoard_Page
    , KnownPayloadsBoard: KnownPayloadsBoard_Page
    , UserAdmin: UserAdmin_Page
}

    , PAGE_KEYS = keysOf(PAGES_MAP, { sorted: true })

export type PAGES_MAP = typeof PAGES_MAP
export type PageKey = KeyOf<PAGES_MAP>
export type PagePropsOf<K extends PageKey> = ComponentProps<PAGES_MAP[K]>
export type PageEventsMapOf<K extends PageKey> = ExtractEventHandlersMap<PagePropsOf<K>>


export const PAGE_LABELS = {
    IdeasBoard: "Idead Board"
    , KnownPayloadsBoard: "Payloads Board"
    , UserAdmin: "User Admin"
} as Record<PageKey, string>