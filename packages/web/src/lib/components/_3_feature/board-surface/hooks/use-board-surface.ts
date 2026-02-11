import { PayloadWithKind, PickRequired } from "@ns-world-lab-kxn/types"
import { BoardSurface_Props } from "../BoardSurface.types"

export type useBoardSurfaceInput<
    P extends PayloadWithKind<any>
> =
    & PickRequired<BoardSurface_Props<P>, "onChange">


export type useBoardSurfaceOutput<
    P extends PayloadWithKind<any>
> =
    & PickRequired<BoardSurface_Props<P>, "onChange">



export const useBoardSurface = <
    P extends PayloadWithKind<any>
>({
    onChange: onChange_IN
}: useBoardSurfaceInput<P>
): useBoardSurfaceOutput<P> => {
    const onChange_OUT: useBoardSurfaceInput<P>["onChange"]
        = (ev) => {
            // do something here

            onChange_IN(ev)
        }
    return {
        onChange: onChange_OUT
    }

}
