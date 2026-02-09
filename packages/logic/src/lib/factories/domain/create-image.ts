import { Image, ImageWithKind, MIME_TYPE, PickRequiredRestPartial, Size } from "@ns-world-lab-knx/types"
import { createID, createSize } from "../primitives"
import { faker } from "@faker-js/faker"

export const createSeed = (): string => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }
    return Math.random().toString(36).slice(2)
}

    , createImageSource = ({
        width = 400
        , height = 300
        , seed = createSeed()
    } = {} as Partial<
        & Size
        & {
            seed: string
        }
    >
    ): string => {
        return `https://picsum.photos/seed/${seed}/${width}/${height}`
    }

    , createImageWithKind = ({
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
        , dimensions
        , src = createImageSource(dimensions = {
            width: 400
            , height: 300
            , ...dimensions
        })
        , file
    }: Partial<Omit<ImageWithKind, "kind">>
    ) => createImageWithKind({
        id
        , mimeType
        , name
        , size
        , src
        , dimensions
        , file
    })