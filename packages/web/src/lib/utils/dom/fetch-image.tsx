import { createID } from "@ns-world-lab/logic"
import { LoadedFileItemWithPartialError } from "../../types"


export type FetchImageInput = {
    url: string | URL
    name?: string
}

export const fetchImage = async ({
    url: input
    , name: name_IN
}: FetchImageInput
): Promise<LoadedFileItemWithPartialError> => {

    if (!input) {
        throw new Error("[url] is required.")
    }

    const src = input instanceof URL ? input.toString() : input
        , fileID = createID()

    try {

        const response = await fetch(src)

        if (!response.ok) {
            throw new Error(`Fetch failed: ${response.status}`)
        }

        const blob = await response.blob()
            , fileName =
                name_IN ?? src.split("/").pop()?.split("?")[0] ?? `image-${fileID}`

            , file = new File(
                [blob]
                , fileName
                , {
                    type: blob.type || "image/*",
                }) as LoadedFileItemWithPartialError

        file.url = URL.createObjectURL(file);
        file.fileID = fileID

        await new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Image decode failed"))
            img.src = file.url
        })

        return file
    } catch (err) {
        const fallback = new File([], `error-${fileID}`) as LoadedFileItemWithPartialError
        fallback.url = ""
        fallback.fileID = fileID
        fallback.error = err instanceof Error ? err : new Error("Unknown error")
        return fallback
    }
}