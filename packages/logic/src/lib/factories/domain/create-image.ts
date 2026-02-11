import { Image, ImageWithKind, MIME_TYPE, PickRequiredRestPartial, Size } from "@ns-world-lab-kxn/types"
import { createID, createSize } from "../primitives"
import { faker } from "@faker-js/faker"
import { createImageSource } from "../../utils"


export const createImageWithKind = ({
    id = createID()
    , mimeType = "image/jpeg" as MIME_TYPE
    , ...rest
}: PickRequiredRestPartial<
    Omit<ImageWithKind, "kind">
    , "src" | "name" //| "file"
>
) => ({
    id
    , kind: "image"
    , ...rest
} as ImageWithKind)


    , createFakeImageWithKind = ({
        id = createID()
        , mimeType = "image/jpeg" as MIME_TYPE
        , name = faker.animal.petName()
        , size
        , extent
        , src = createImageSource(extent = {
            width: 400
            , height: 300
            , ...extent
        })
        , file
    }: Partial<Omit<ImageWithKind, "kind">>
    ) => createImageWithKind({
        id
        , mimeType
        , name
        , size
        , src
        , extent
        , file
    })