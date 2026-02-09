import { _cn, PickHtmlAttributes } from "../../../utils"

// ========================================
export type MainProps =
    & PickHtmlAttributes<"children" | "className">


// ========================================
export const Main = ({
    children
    , className
    , ...rest
}: MainProps
) => {
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

