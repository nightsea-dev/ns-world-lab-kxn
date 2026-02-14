import { HasData, EventHandlersFromMapPartial } from "@ns-world-lab/types"
import { LoadedFileItemWithPartialError } from "../types"
import { fetchImage, FetchImageInput } from "../utils"


export type FetchImageResult = HasData<LoadedFileItemWithPartialError[]>

export const useImageLoader = ({
    onLoad
}: EventHandlersFromMapPartial<{
    load: FetchImageResult
}>
): {
    fetchFn(...args: (FetchImageInput | FetchImageInput[])[]): Promise<FetchImageResult>
} => {
    return {
        fetchFn: async (
            ...args
        ) => {
            const infos = [args].flat(1).filter(Boolean) as FetchImageInput[]
                , result: FetchImageResult = { data: await Promise.all(infos.map(fetchImage)) }

            !onLoad || setTimeout(() => onLoad(result))
            return result
        }
    }

}
