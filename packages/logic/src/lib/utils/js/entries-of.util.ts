import { EntryItemOf } from "@ns-lab-knx/types"

export type EntriesOfOptions =
    & {
        sorted?: boolean | "localeCompare"
    }

export const entriesOf = <T extends object>(
    o: T
    , {
        sorted
    } = {} as EntriesOfOptions
): EntryItemOf<T>[] => {
    const entries = Object.entries(o) as EntryItemOf<T>[]
    return !sorted
        ? entries
        : sorted === "localeCompare"
            ? entries.sort((a, b) => a[0].localeCompare(b[0]))
            : entries.sort((a, b) => a[0] < b[0] ? -1 : 1)
}