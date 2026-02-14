import { _cn, PickHtmlAttributes } from "../../../utils"

// ========================================
export type PageMain_Props =
    & PickHtmlAttributes<"children" | "className">


// ========================================
export const PageMain: React.FC<PageMain_Props> = ({
    children
    , className
    , ...rest
}) => {
    return (
        <main
            {...rest}
            data-main
            className={_cn(
                // "relatve border border-[dodgerblue]"
                //  "flex-1 p-4 h-full"
                "flex-1 overflow-hidden"
                , className
            )}
            style={{
                backgroundColor: "red"
                , border: "1px solid blue"
            }}
        >
            <div>
                MAIN
            </div>
            {children}
        </main>
    )
}

