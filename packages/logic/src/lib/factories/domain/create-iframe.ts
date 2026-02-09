import { IFrameWithKind, Image, ImageWithKind, MIME_TYPE, PickRequiredRestPartial, Size } from "@ns-world-lab-knx/types"
import { createID, createSize } from "../primitives"
import { faker } from "@faker-js/faker"

export const createIFrame = (
    o: Partial<IFrameWithKind> = {}
): IFrameWithKind => ({
    kind: "iframe"
    , id: createID()
    , name: faker.commerce.product()
    , src: faker.internet.url()
    , ...o
})