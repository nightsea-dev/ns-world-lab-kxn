import { _cn, PickHtmlAttributes } from "../../utils";


export const NoData = (
    {
        children
        , className
        , ...rest
    }: PickHtmlAttributes<"className" | "onClick" | "children">
) => (
    <div
        {...rest}
        className={_cn(
            `
            text-xs text-slate-500 
            border
            border-gray-200
            text-center
            p-4
            `
            , className
        )}
    >
        <div>
            [ NO DATA ]
        </div>
        {children && (
            <div
                data-no-data-children-container
            >
                {children}
            </div>
        )}
    </div>)