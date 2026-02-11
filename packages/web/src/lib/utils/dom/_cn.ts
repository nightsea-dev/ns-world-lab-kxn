// ========================================
type CnInput =
    | string
    | string[]
    | { className?: string }
    | undefined
    | null
    | false

// ========================================
export const _cn = (...args: CnInput[]): string => {

    const out: string[] = []

    for (const arg of args) {
        if (!arg) {
            continue
        }

        if (typeof arg === "string") {
            const s = arg.trim()
            if (s) {
                out.push(s)
            }
            continue
        }

        if (Array.isArray(arg)) {
            for (const v of arg) {
                if (typeof v === "string") {
                    const s = v.trim()
                    if (s) {
                        out.push(s)
                    }
                }
            }
            continue
        }

        if (typeof arg === "object") {
            const s = arg.className?.trim()
            if (s) {
                out.push(s)
            }
        }
    }

    return [...new Set(
        out.join(" ").split(" ")
            .map(v => v.trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
    )].join("\n")
    // return [...new Set(out)].sort((a, b) => a.localeCompare(b)).join(" ")
}
