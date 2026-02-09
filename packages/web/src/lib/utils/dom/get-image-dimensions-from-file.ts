import { Size } from "@ns-world-lab-knx/types"


export const getImageDimensionsFromFile = async (
    file: File
): Promise<{
    url: string
    dimensions: Size
}> => new Promise((res, rej) => {

    const img = new Image()
        , url = URL.createObjectURL(file)

    img.onload = () => {
        res({
            dimensions: {
                width: img.naturalWidth,
                height: img.naturalHeight,
            }
            , url
        })
        URL.revokeObjectURL(url)
    }

    img.onerror = err => {
        URL.revokeObjectURL(url)
        rej(err)
    }

    img.src = url
})
