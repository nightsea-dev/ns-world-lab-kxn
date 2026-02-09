import {
    EventHandlersFromMap, HasData
    , HasPartialEventHandler
    , HasPartialUrl,
    PartialEventHandlersFromMap
} from "@ns-lab-knx/types";
import { _memo, PickHtmlAttributes } from "../../../../utils";
import { FileItemWithPartialUrlAndPartialFileID, Renderer } from "../../../../types";
import { ObjectView } from "../../_basic";
import { pickFrom } from "@ns-lab-knx/logic";

// ======================================== types/props
export type FileWithUrlRendererProps =
    & HasData<FileItemWithPartialUrlAndPartialFileID>
    & PickHtmlAttributes<"className">

// ======================================== types/renderer
export type FileWithUrlRenderer =
    & Renderer<FileWithUrlRendererProps>

// ======================================== capabilities
export type HasFileWithUrlRenderer =
    & {
        fileRenderer: FileWithUrlRenderer
    }

// ======================================== component/default
export namespace FileWithUrlRenderer {

    export const DEFAULT: FileWithUrlRenderer = ({
        data: data
        , ...rest
    }) => {
        // const {
        //     name
        //     , size
        //     , type
        //     , url
        //     , fileID
        //     , webkitRelativePath
        //     , arrayBuffer
        //     , bytes
        //     , lastModified
        //     , slice
        //     , stream
        //     , text
        // } = data
        return (
            <ObjectView
                {...rest}
                data-default-file-renderer
                data={_memo([data], () => pickFrom(
                    data
                    , "name"
                    , "size"
                    , "type"
                    , "webkitRelativePath"
                    , "url"
                    , "fileID"
                ))}
                showEmptyProperties={false}
            />
        )
    }

}