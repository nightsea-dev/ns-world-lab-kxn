import { HTMLAttributes, ImgHTMLAttributes } from "react";
import { _cn, _effect, _use_state, PickHtmlAttributes } from "../../../../utils";
import { HasData, HasExtent, Size } from "@ns-world-lab-kxn/types";
import { ImageInfo } from "../../../../types";


export type ImageNSProps
    =
    & HasData<
        ImageInfo
    >
    & PickHtmlAttributes<
        "className"
    >
    & Pick<
        ImgHTMLAttributes<HTMLImageElement>
        , "width" | "height"
    >


export const ImageNS = ({
    data
    , ...rest
}: ImageNSProps
) => {

    return (
        <div
            {...rest}
            className={_cn(`
                    w-full
                    aspect-video 
                    bg-gray-50 rounded 
                    flex items-center 
                    justify-center 
                    overflow-hidden
                    `
                , rest.className
            )}>
            <img
                src={data.src}
                alt={data.name}
                className={`
                            ---max-h-[200px] 
                            ---max-w-[250px] 
                            object-contain
                            `}
                draggable={false}

            />
        </div>
    )
}
