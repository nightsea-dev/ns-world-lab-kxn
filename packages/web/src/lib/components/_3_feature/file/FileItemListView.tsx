import {
    HasData
    , HasName
    , HasPartialError, HasUrl,
    PartialEventHandlersFromMap
} from "@ns-world-lab-kxn/types";
import { HTMLAttributes, HtmlHTMLAttributes, MouseEvent, ReactNode, useId, useReducer } from "react";
import { _cn, _memo, _use_state, OmitHtmlAttributes, PickHtmlAttributes } from "../../../utils";
import { FileItemRenderer, FileItemRenderer_DataItem, FileItemRenderer_Props, HasFileItemRenderer } from "../../../types";
import { ButtonRS, CloseButton } from "../../_2_composite";
import { NoData } from "../../_1_primitive";
import { Default_FileItemRenderer } from "./DefaultFileItemRenderer";



type FileItem_ListView_DataItem
    =
    & FileItemRenderer_DataItem
    & HasPartialError

// ======================================== props
export type FileItem_ListView_Props<
    TDataItem extends FileItem_ListView_DataItem = FileItem_ListView_DataItem
> =
    & HasData<TDataItem[]>
    & Partial<
        & HasFileItemRenderer<TDataItem>
        & {
            placeholder: ReactNode
            headerProps: OmitHtmlAttributes<"children">
        }
        & PickHtmlAttributes<"className">
        & {
            onItemError: FileItemRenderer_Props["onError"]
        }
    >

    & PartialEventHandlersFromMap<
        & {
            itemCloseButtonClick: HasData<TDataItem>
            clearButtonClick: MouseEvent<HTMLElement>
            click: MouseEvent<HTMLElement>
        }
    >




// ======================================== component
export const FileItem_ListView = <
    TDataItem extends FileItem_ListView_DataItem = FileItem_ListView_DataItem
>({
    data: data_IN
    , placeholder
    , headerProps
    , fileItemRenderer: R = Default_FileItemRenderer as NonNullable<FileItem_ListView_Props<TDataItem>["fileItemRenderer"]>
    , onClick
    , onClearButtonClick
    , onItemCloseButtonClick
    , onItemError
    , ...rest
}: FileItem_ListView_Props<TDataItem>
) => {

    const id = useId()

        , [, _update_component] = useReducer(x => x + 1, 0)

        , filesWithError = data_IN.filter(o => o.error)

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

        , _handle_ItemError: FileItemRenderer_Props["onError"]
            = (ev) => {
                ;
                ; (ev.data as TDataItem).error = ev.error
                _update_component()
                onItemError?.(ev)
            }


    return (
        <div
            {...rest}
            id={id}
            data-file-collection-view={id}

            className={_cn(`
                border border-gray-200 rounded-[10px] p-0 m-1
                overflow-hidden
                cursor-default
                `
                , rest.className
            )}
            //onPointerDown={_handleClick}
            onClick={_handleClick}
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
                    <div>
                        Files: {data_IN.length}
                    </div>
                    {!filesWithError.length ? undefined
                        : <div>
                            WithError: {filesWithError.length} of {data_IN.length}<br />
                            {/* filesWithError_2: {filesWithError_2.length} */}
                        </div>
                    }

                </div>
                {placeholder && !!data_IN.length && (
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
                            disabled={!data_IN.length}
                            onClick={onClearButtonClick}
                            appearance="default"
                        >Clear</ButtonRS>
                    </div>
                )}

            </div>
            {!data_IN.length
                ? <NoData
                >
                    {placeholder}
                </NoData>
                : (
                    <div
                        data-file-collection-items-container={id}
                    >
                        {data_IN.map(data => (
                            <div
                                key={data.fileID ?? data.url ?? data.name}
                                data-file-item-render-container
                                data-file-item-file-id={data.fileID}
                                className={_cn(
                                    "m-1 flex"
                                )}
                            >
                                <R
                                    key={data.url ?? data.name}
                                    data={data}
                                    onError={_handle_ItemError}
                                    data-item-has-errors={!!data.error}
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