import { HasData, HasHeader, HasId, PrefixKeys, PrefixKeysAndCapitalisedAfter } from "@ns-world-lab/types"
import { PageHeader, PageHeader_Props } from "../../_4_layout/header"
import { PageFooter } from "../footer"
import { _cn, _effect, PickHtmlAttributes } from "../../../utils"
import { ReactNode, useId } from "react"
import { PageMain_Props } from "../main"


// ======================================== props
export type MainPage_Props =
    & Partial<
        & HasId
        & PrefixKeysAndCapitalisedAfter<"header", PageHeader_Props>
        & HasHeader<ReactNode>

        & PickHtmlAttributes<"className" | "children">
        & PrefixKeys<"main_", Pick<PageMain_Props, "className">>
    >

// ======================================== component
export const MainPage: React.FC<MainPage_Props> = ({
    id: id_IN
    , headerTitle
    , headerUser
    , headerMidContent
    , header
    , main_className
    , className
    , children: main_children
}) => {

    const _id = useId()
        , id = id_IN ?? _id

    return (
        <div
            id={id}
            data-page={_id}
            className={_cn(
                // "flex flex-col h-screen"
                `h-dvh flex flex-col min-h-0`
                , className
            )}
        >
            <PageHeader
                title={headerTitle}
                user={headerUser}
                children={header}
                midContent={headerMidContent}
            />
            <main className={_cn(
                `
                    relative
                    flex-1 min-h-0 overflow-hidden
                    border border-blue-500
                    border-gray-200
                    p-3
                `
                // , `
                // flex-1 min-h-0 overflow-hidden
                // border border-blue-500
                //  border-gray-200
                //  p-3
                // `
                // border-[10px] border-green-500
                , main_className
            )}>
                {main_children}
                {/* <Board /> */}
            </main>
            <PageFooter />
        </div>
    )
}