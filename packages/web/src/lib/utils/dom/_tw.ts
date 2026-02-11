export type Tw = string & { _brand: "tailwind" }

export const _tw = (
    strings: TemplateStringsArray,
    ...expr: Array<string | undefined | null | false>
): Tw =>
    strings
        .map((s, i) => `${s}${expr[i] ?? ""}`)
        .join("")
        .trim() as Tw
