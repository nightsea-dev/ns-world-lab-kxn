import { Size } from '@ns-world-lab/types'


const IMG_SOURCES = [
    'https://picsum.photos/800/600',
    'https://placehold.co/800x600',
]


const createSeed = (): string => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID()
    }
    return Math.random().toString(36).slice(2)
}




export const createImageSource = ({
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


