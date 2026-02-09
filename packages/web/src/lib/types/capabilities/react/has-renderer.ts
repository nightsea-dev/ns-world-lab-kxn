import { FunctionComponent } from "react"


export type Renderer<
    P extends object
> = FunctionComponent<P>

export type HasRenderer<
    P extends object
> = {
    renderer: Renderer<P>
}