
export const Position_KEYS = ["x", "y"] as const
export type PositionKey = (typeof Position_KEYS)[number]

export type Position
    = Record<PositionKey, number>


export type HasPosition = {
    position: Position
}

export type HasPositions = {
    positions: Position[]
}
