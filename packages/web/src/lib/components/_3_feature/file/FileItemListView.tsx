import {
    ExtractEventHandlersMapPartial
    , HasData
    , EventHandlersFromMapPartial
} from "@ns-world-lab/types";
import { MouseEvent, ReactNode, useId, useReducer } from "react";
import { _cn, _memo, _use_state, OmitHtmlAttributes, PickHtmlAttributes } from "../../../utils";
import { FileItemRenderer_Props, HasFileItemRenderer, LoadedFileItemWithPartialError } from "../../../types";
import { ButtonRS, CloseButton } from "../../_2_composite";
import { NoData } from "../../_1_primitive";
import { Default_FileItemRenderer } from "./DefaultFileItemRenderer";


type Data = LoadedFileItemWithPartialError


type EventsMap = {
    itemCloseButtonClick: HasData<Data>
    clearButtonClick: MouseEvent<HTMLElement>
}


// ======================================== props
type Props =
    // Base
    & HasData<Data[]>
    & Partial<
        & HasFileItemRenderer<Data>
        & {
            noDataPlaceholder: ReactNode

            header: ReactNode
            headerProps: OmitHtmlAttributes<"children">
        }
        & PickHtmlAttributes<"className">
        & {
            onItemError: FileItemRenderer_Props["onError"]
        }
    >

    // Handlers
    & EventHandlersFromMapPartial<EventsMap>



// ======================================== component
export const FileItemListView: React.FC<Props> = ({
    data: data_IN
    , header: tableHeader
    , noDataPlaceholder
    , headerProps
    , fileItemRenderer: R = Default_FileItemRenderer as NonNullable<Props["fileItemRenderer"]>

    // , onClick
    , onClearButtonClick
    , onItemCloseButtonClick
    , onItemError
    , ...rest
}) => {

    const id = useId()

        , [, _update_component] = useReducer(x => x + 1, 0)

        , filesWithError = data_IN.filter(o => o.error)

        , fileItemHandlers: ExtractEventHandlersMapPartial<FileItemRenderer_Props>
            = _memo([onItemError], () => ({
                onError: (ev) => {
                    ; (ev.data as Data).error = ev.error
                    _update_component()
                    onItemError?.(ev)
                }
            }))


    return (
        <div
            {...rest}
            id={id}
            data-file-item-list={id}

            className={_cn(`
                border border-gray-200 rounded-[10px] p-0 m-1
                overflow-hidden
                cursor-default
                `
                , rest.className
            )}
        //onPointerDown={_handleClick}
        // onClick={_handleClick}
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
                {tableHeader && !!data_IN.length && (
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
                        {tableHeader}
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
                    {noDataPlaceholder}
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
                                    data-item-has-errors={!!data.error}
                                    {...fileItemHandlers}
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



export {
    type Props as FileItemListView_Props
    , type EventsMap as FileItemListView_EventsMap
}
