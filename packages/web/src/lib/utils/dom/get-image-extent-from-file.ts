import {
    HasExtent, HasError,
    XOR
} from "@ns-world-lab-kxn/types"


type GetImageExtentFromFileOutput
    = XOR<
        HasExtent
        , HasError<string | Event>
    >

export const getImageExtentFromFile = async (
    file: File
): Promise<
    GetImageExtentFromFileOutput
> => new Promise((res, rej) => {
    const img = new Image()
        , url = URL.createObjectURL(file)

    img.onload = () => {
        res({
            extent: {
                width: img.naturalWidth,
                height: img.naturalHeight,
            }
        })
        URL.revokeObjectURL(url)
    }

    img.onerror = error => {
        debugger
        URL.revokeObjectURL(url)
        res({ error })
        // rej(err)
    }

    img.src = url

})
