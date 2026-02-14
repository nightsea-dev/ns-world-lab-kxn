import { createID, createImageSource } from "@ns-world-lab/logic";
import { ImageInfo } from "../../types";
import { faker } from "@faker-js/faker";
import { PickRequired } from "@ns-world-lab/types";



export const createImageInfo = (): PickRequired<ImageInfo, "id" | "name" | "src"> => ({
    src: createImageSource()
    , id: createID()
    , name: faker.animal.petName()
})