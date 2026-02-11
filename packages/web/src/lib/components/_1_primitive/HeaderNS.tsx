import { _cn, PickHtmlAttributes } from "../../utils"

export type HeaderNSProps =
    & PickHtmlAttributes<"children" | "className">

export const HeaderNS = (
    props: HeaderNSProps
) => <div
        {...props}
        className={_cn(
            "text-2xl font-bold text-gray-800"
        )}
    />