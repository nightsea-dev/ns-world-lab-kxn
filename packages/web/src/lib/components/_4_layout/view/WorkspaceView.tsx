import { ReactNode } from "react"
import { _cn } from "../../../utils"



export const WorkspaceView = ({
    isActive
    , children
    , className
}: {
    isActive: boolean
    children: ReactNode
    className?: string
}) => (
    <div
        aria-hidden={!isActive}
        inert={(!isActive ? "" : undefined) as any}
        className={_cn(
            "absolute inset-0 min-h-0 will-change-transform transition-transform transition-opacity duration-200",
            isActive
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "translate-x-[120vw] opacity-0 pointer-events-none",
            className
        )}
    >
        {children}
    </div>
)
