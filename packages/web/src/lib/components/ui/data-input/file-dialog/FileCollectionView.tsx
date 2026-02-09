import {
    EventHandlersFromMap, HasData
    , HasPartialEventHandler
    , HasPartialUrl,
    PartialEventHandlersFromMap
} from "@ns-lab-knx/types";
import { _cn, FileWithPartialUrlAndFileID, PickHtmlAttributes } from "../../../../utils";
import { Renderer } from "../../../../types";
import { CloseButton, CloseButtonRef, HasCloseButtonRef, NoData, ObjectView } from "../../_basic";
import { HTMLAttributes, MouseEvent, ReactNode, RefCallback, RefObject, useRef } from "react";
import { ButtonRS } from "../../rs";
import { FileWithUrlRenderer, HasFileWithUrlRenderer } from "./FileRenderer";



// ======================================== props
export type FileCollectionViewProps =
    & HasData<FileWithPartialUrlAndFileID[]>
    & Partial<
        & HasFileWithUrlRenderer
        & {
            placeholder: ReactNode
        }
    >

    & PartialEventHandlersFromMap<{
        itemCloseButtonClick: HasData<FileWithPartialUrlAndFileID>
        click: MouseEvent<HTMLElement>
        clearButtonClick: MouseEvent<HTMLElement>
    }>


// ======================================== component
export const FileCollectionView = (
    {
        data
        , placeholder
        , fileRenderer: R = FileWithUrlRenderer.DEFAULT
        , onClick
        , onClearButtonClick
        , onItemCloseButtonClick
        , ...rest
    }: FileCollectionViewProps
) => {

    const _handleClick: HTMLAttributes<any>["onClick"] = (
        ev
    ) => {
        if (!onClick
            || ev.target !== ev.currentTarget
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
            data-selected-files-render-container
            className="border border-gray-200 rounded-[10px] p-0 m-1"
        >
            <div
                data-file-collection-header
                className="p-2 bg-gray-100 relative flex items-center"
                onClick={_handleClick}
            >
                <div
                    data-header-text
                    className={`
                        whitespace-nowrap flex-none
                        border border-gray-200
                        py-1 px-3
                        rounded-[5px]
                        `}
                    onClick={_handleClick}
                >
                    Files: {data.length}
                </div>
                {placeholder && !!data.length && (
                    <div
                        data-placeholder-container
                        className={`
                            ml-auto flex items-center 
                            whitespace-nowrap
                            border border-gray-100
                            text-gray-400
                            p-2
                            `}
                        onClick={_handleClick}
                    >
                        {placeholder}
                    </div>
                )}
                {onClearButtonClick && (
                    <div
                        data-placeholder-container
                        className={`
                            ml-auto flex items-center whitespace-nowrap
                            `}
                        onClick={_handleClick}
                    >
                        <ButtonRS
                            disabled={!data.length}
                            onClick={onClearButtonClick}
                        >Clear</ButtonRS>
                    </div>
                )}

            </div>
            {!data.length
                ? <NoData
                    onClick={_handleClick}
                >
                    {placeholder}
                </NoData>
                : (
                    <div
                        data-file-items-collection-container
                    >
                        {data.map(data => (
                            <div
                                data-file-item-render-container
                                key={data.url ?? data.name}
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