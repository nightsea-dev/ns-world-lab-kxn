import { HasPropertyKey, HasKeyWithStringOrNumberValue, StringOrNumberValue } from "@ns-world-lab/types"


export const _getSetOfKeys = <
    K extends StringOrNumberValue = "id"
    , TData extends HasKeyWithStringOrNumberValue<K> = HasPropertyKey<K>
>({
    k = "id" as K
    , items
}: {
    k?: K
    , items: TData[]
}) => new Set<TData[K]>(
    items.map(({ [k]: v }) => v)
)

