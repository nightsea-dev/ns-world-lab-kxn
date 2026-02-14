import { _cn, PickHtmlAttributes } from "../../utils"

export type HeaderNSProps =
    & PickHtmlAttributes<"children" | "className">

export const HeaderNS: React.FC<HeaderNSProps> = (
    props
) => <div
        {...props}
        className={_cn(
            "text-2xl font-bold text-gray-800"
        )}
    />