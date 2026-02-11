import { EventHandlersFromMap, HasChildren, HasData, HasEventHandler, HasId, HasName, HasUrl, IFrameWithKind, KeyOf } from "@ns-world-lab-kxn/types"
import {
    _cn, _effect, _isValidUrl
    , _memo, _tw, _use_state
    , Box, ButtonRS, CloseButton, HasClassName, HasPartialClassName, ListNS, ListNSProps, NoData
} from "@ns-world-lab-kxn/web"
import { createID, createImageSource, createRandomReachableUrl, getRandomUrl } from "@ns-world-lab-kxn/logic"
import { faker } from "@faker-js/faker"
import { BoxProps, List } from "rsuite"

// ======================================== types
// using [IFrameWithKind] will bind it to [domain] lexicon
export type IFrameDataItem =
    // & Pick<IFrameWithKind, "kind">
    & HasId
    & HasName
    & HasUrl<string>


export type IFrameDataItemKey
    = KeyOf<
        Pick<IFrameDataItem, "name" | "url">
    >
export const IFRAME_DATA_ITEM_KEYS
    = ["name", "url"] as IFrameDataItemKey[]


export type HasIFrameDataItem
    = HasData<IFrameDataItem>

// ======================================== props - IFrameDataItem

export type IFrameRowProps =
    & HasIFrameDataItem
    & HasPartialClassName
    & {
        idx: number
    }
    & Partial<HasEventHandler<"remove", HasIFrameDataItem>>

// ======================================== component - IFrameDataItem
export const IFrameDataItemRow = ({
    data
    , idx
    , onRemove
    , ...rest
}: IFrameRowProps
) => (
    <Box
        {...rest}
        data-iframe-data-item-row

        childrenContainerProps={{
            className: _cn(`
            flex 
            items-center
            justify-between
            gap-3
            px-3 
            py-2
            hover:bg-gray-100
            duration-200
            transition-all
        `
                , rest.className
            )
        }}
    >
        <div className="text-xs text-gray-400 w-6 text-right">
            {idx + 1}
        </div>

        <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
                {data.name || "—"}
            </div>
            <div className="text-xs text-gray-500 truncate">
                {data.url}
            </div>
        </div>

        {/* {onRemove
            && <ButtonRS
                onClick={() => onRemove({ data })}
            >Remove</ButtonRS>} */}

        {onRemove
            && <CloseButton
                onClick={() => onRemove({ data })}
            />}

    </Box>
)

// ======================================== component - IFrameDataItemGroup
export type IFrameDataItemListProps =
    & Omit<ListNSProps<IFrameDataItem>, "renderer">

export const IFrameDataItemList = ({
    data
    , onRemove
    , onClear
    , ...rest
}: IFrameDataItemListProps
) => <ListNS
        {...rest}
        data={data}
        headerLabel={<div>IFrameDataItems [{data.length}]</div>}
        renderer={props => <IFrameDataItemRow
            {...props}
            className={_cn(
                `border-none`
            )}
        />}
        className="p-0"
        childrenContainerProps={{
            className: "p-0"
        }}
        onRemove={onRemove}
        onClear={onClear}
    />




// ============================================
export const createIFrameDataItem = (
    o: Partial<IFrameDataItem> = {}
): IFrameDataItem => ({
    id: createID()
    , name: faker.commerce.product()
    , url: getRandomUrl()
})

