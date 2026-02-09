import { Position, Size, Transformation, XOR } from "@ns-world-lab-knx/types";




// ======================================== types
export type JitterPositionsOptions =
    & Partial<
        {
            /**
             * distance from edges
             */
            padding: number
            /**
             * minimum spacing between points (approx)
             */
            gap: number
            /**
             * 0..1, adds randomness around grid cell centers
             */
            jitter: number
            /**
             * deterministic output
             */
            seed: number
        }
    >


export type JitterPositionsInputBase = {
    containerSize: Size
    options?: JitterPositionsOptions
}


export type JitterPositionsInput =
    & JitterPositionsInputBase
    & {
        positions: Position[]
    }

export type JitterTransformationsInput =
    & JitterPositionsInputBase
    & {
        transformations: Transformation[]
    }

// ======================================== func

/**
 * Scatter N points inside a container.
 * 
 * Returns N positions, bounded to container rect.
 *
 * Behavior: jittered grid (fast, stable). No guarantee of perfect non-overlap
 * unless your points represent top-left corners of same-size nodes and gap is sufficient.
 */
export const _jitterPositions = ({
    containerSize: { width: W0, height: H0 },
    positions,
    transformations,
    options: {
        padding = 16,
        gap = 16,
        jitter = 0.35,
        seed = 1
    } = {}
}: JitterPositionsInputBase
    & Omit<
        XOR<JitterPositionsInput, JitterTransformationsInput>,
        keyof JitterPositionsInputBase
    >
): {
    originalPositions: Position[]
    jiterredPositions: Position[]
} => {
    const W = Math.max(0, W0)
        , H = Math.max(0, H0)

        , originals: Position[] =
            positions
                ? positions.map(p => ({ x: p.x, y: p.y }))
                : transformations
                    ? transformations.map(t => ({ x: t.position.x, y: t.position.y }))
                    : []

        , N = originals.length

    if (N === 0 || W === 0 || H === 0) {
        return {
            originalPositions: originals,
            jiterredPositions: originals.map(p => ({ ...p }))
        };
    }

    // Deterministic PRNG (LCG)
    let s = seed >>> 0
    const rnd = () => {
        s = (1664525 * s + 1013904223) >>> 0;
        return s / 0xffffffff;
    }

        , usableW = Math.max(0, W - padding * 2)
        , usableH = Math.max(0, H - padding * 2)

    // Slot sizing differs:
    // - with transformations: slot based on max node size (+gap)
    // - with positions: slot inferred from N and container aspect (roughly square packing)
    let slotW = 0
        , slotH = 0

    if (transformations) {
        for (const t of transformations) {
            slotW = Math.max(slotW, t.size.width)
            slotH = Math.max(slotH, t.size.height)
        }
        slotW = Math.max(1, slotW) + gap
        slotH = Math.max(1, slotH) + gap
    } else {
        const colsGuess = Math.max(1, Math.ceil(Math.sqrt((N * usableW) / Math.max(1, usableH))))
            , rowsGuess = Math.max(1, Math.ceil(N / colsGuess))
        slotW = Math.max(1, usableW / colsGuess)
        slotH = Math.max(1, usableH / rowsGuess)
    }

    const cols = Math.max(1, Math.floor(usableW / Math.max(1, slotW)))
        , rows = Math.max(1, Math.ceil(N / cols))

        , maxRowsFit = Math.max(1, Math.floor(usableH / Math.max(1, slotH)))
        , rowScale = rows > maxRowsFit ? (maxRowsFit / rows) : 1

        , scattered: Position[] = new Array(N)

    for (let i = 0; i < N; i++) {
        const c = i % cols
            , r = Math.floor(i / cols)

            , baseX = padding + c * slotW
            , baseY = padding + r * slotH * rowScale

        if (!transformations) {
            // Positions represent points: place near cell center
            const maxJx = Math.max(0, slotW)
                , maxJy = Math.max(0, slotH * rowScale)

                , jx = (rnd() - 0.5) * jitter * maxJx
                , jy = (rnd() - 0.5) * jitter * maxJy

            let x = baseX + slotW / 2 + jx
            let y = baseY + (slotH * rowScale) / 2 + jy

            x = Math.min(W - padding, Math.max(padding, x))
            y = Math.min(H - padding, Math.max(padding, y))

            scattered[i] = { x, y }
            continue;
        }

        const t = transformations[i]
            , w = Math.max(0, t.size.width)
            , h = Math.max(0, t.size.height)

            , maxJx = Math.max(0, slotW - w)
            , maxJy = Math.max(0, slotH * rowScale - h)

            , jx = (rnd() - 0.5) * jitter * maxJx
            , jy = (rnd() - 0.5) * jitter * maxJy

        let x = baseX + jx
        let y = baseY + jy

        x = Math.min(W - padding - w, Math.max(padding, x))
        y = Math.min(H - padding - h, Math.max(padding, y))

        scattered[i] = { x, y }
    }

    return {
        originalPositions: originals
        , jiterredPositions: scattered
    };
};