import { EXTENSION_TO_MIME, MIME_EXT } from "@ns-lab-knx/types"

export const _getMimeType = (
    file?: File
) => {
    if (!file) {
        return
    }
    if (file.type) {
        return file.type
    }

    const ext = file.name.split(".").pop()?.toLowerCase() as MIME_EXT | undefined
    return ext ? EXTENSION_TO_MIME[ext] : undefined
}