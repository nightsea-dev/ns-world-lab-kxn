import {
    HasData
    , HasName
    , HasUrl,
    PartialEventHandlersFromMap
} from "@ns-world-lab-knx/types";
import { _cn, OmitHtmlAttributes, PickHtmlAttributes } from "../../../../utils";
import { CloseButton, NoData } from "../../_basic";
import { HTMLAttributes, MouseEvent, ReactNode, useId } from "react";
import { ButtonRS } from "../../rs";
import {
    FileWithUrlRenderer
    , HasFileWithUrlRenderer
    , FileWithUrlRendererDataItem
} from "./FileWithUrlRenderer";





// ======================================== props
export type FileCollectionViewProps<
    TDataItem extends FileWithUrlRendererDataItem = FileWithUrlRendererDataItem
> =
    & HasData<TDataItem[]>
    & Partial<
        & HasFileWithUrlRenderer
        & {
            placeholder: ReactNode
            headerProps: OmitHtmlAttributes<"children">
        }
        & PickHtmlAttributes<"className">
    >

    & PartialEventHandlersFromMap<{
        itemCloseButtonClick: HasData<TDataItem>
        click: MouseEvent<HTMLElement>
        clearButtonClick: MouseEvent<HTMLElement>
    }>




// ======================================== component
export const FileCollectionView = <
    TDataItem extends FileWithUrlRendererDataItem = FileWithUrlRendererDataItem
>({
    data
    , placeholder
    , headerProps
    , fileRenderer: R = FileWithUrlRenderer.DEFAULT
    , onClick
    , onClearButtonClick
    , onItemCloseButtonClick
    , ...rest
}: FileCollectionViewProps<TDataItem>
) => {

    const id = useId()
        , _handleClick: HTMLAttributes<any>["onClick"] = (
            ev
        ) => {
            const target = (ev.target as HTMLElement)
                , isFileItem = !!target.closest(`[data-file-collection-items-container="${id}"]`)
                , isClearButton = target.hasAttribute("data-clear-button")
            if (!onClick
                || isFileItem
                || isClearButton
            ) {
                return
            }
            ev.preventDefault()
            ev.stopPropagation()
            onClick(ev)
        }

    return (
        <div
            {...rest}
            data-file-collection-view={id}

            className={_cn(`
                border border-gray-200 rounded-[10px] p-0 m-1
                overflow-hidden
                cursor-default
                `
                , rest.className
            )}
            onPointerDown={_handleClick}
        >
            <div
                {...headerProps}
                data-file-collection-header={id}

                className={_cn(`
                    p-2 bg-gray-100 relative flex items-center
                    `
                    , headerProps?.className
                )}
            >
                <div
                    data-header-text

                    className={`
                        whitespace-nowrap flex-none
                        ---border 
                        ---border-gray-200
                        py-1 px-3
                        rounded-[5px]
                        `}
                >
                    Files: {data.length}
                </div>
                {placeholder && !!data.length && (
                    <div
                        data-file-collection-placeholder

                        className={`
                            ml-auto
                            flex items-center
                            min-w-0
                            flex-1
                            whitespace-normal
                            break-words
                            ---border 
                            ---border-gray-100
                            text-gray-400
                            p-2
                        `}
                    >
                        {placeholder}
                    </div>
                )}
                {onClearButtonClick && (
                    <div
                        data-buttons-container
                        className={`
                            ml-auto flex items-center whitespace-nowrap
                            `}
                    >
                        <ButtonRS
                            data-clear-button
                            disabled={!data.length}
                            onClick={onClearButtonClick}
                            appearance="default"
                        >Clear</ButtonRS>
                    </div>
                )}

            </div>
            {!data.length
                ? <NoData
                >
                    {placeholder}
                </NoData>
                : (
                    <div
                        data-file-collection-items-container={id}
                    >
                        {data.map(data => (
                            <div
                                key={data.url ?? data.name}
                                data-file-item-render-container
                                className={_cn(
                                    "m-1 flex"
                                )}
                            >
                                <R
                                    key={data.url ?? data.name}
                                    data={data}
                                />
                                <CloseButton
                                    data-file-item-close-button
                                    onClick={() => onItemCloseButtonClick?.({ data })}
                                />
                            </div>
                        ))}
                    </div>
                )}
        </div>
    )
}