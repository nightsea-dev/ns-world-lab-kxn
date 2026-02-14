export type DataAttributeValue = string | number | boolean | null | undefined


export type HasDataAttributes
    = Partial<
        Record<`data-${string}`, DataAttributeValue>
    >