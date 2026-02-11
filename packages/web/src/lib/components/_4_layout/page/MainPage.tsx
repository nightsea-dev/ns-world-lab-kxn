import { HasData, HasHeader, HasId, PrefixKeys, PrefixKeysAndCapitalisedAfter } from "@ns-world-lab-kxn/types"
import { PageHeader, PageHeaderProps } from "../../_4_layout/header"
import { PageFooter } from "../footer"
import { _cn, _effect, PickHtmlAttributes } from "../../../utils"
import { MainProps } from "../../_4_layout/main"
import { ReactNode, useId } from "react"


// ======================================== props
export type MainPageProps =
    & Partial<
        & HasId
        & PrefixKeysAndCapitalisedAfter<"header", PageHeaderProps>
        & HasHeader<ReactNode>

        & PickHtmlAttributes<"className" | "children">
        & PrefixKeys<"main_", Pick<MainProps, "className">>
    >

// ======================================== component
export const MainPage = ({
    id: id_IN
    , headerTitle
    , headerUser
    , headerMidContent
    , header
    , main_className
    , className
    , children: main_children
}: MainPageProps

) => {

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