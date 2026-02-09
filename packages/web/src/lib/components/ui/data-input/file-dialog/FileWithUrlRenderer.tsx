import {
    HasData
} from "@ns-world-lab-knx/types";
import { _memo, PickHtmlAttributes } from "../../../../utils";
import { FileItemWithUrlAndFileID, Renderer } from "../../../../types";
import { ObjectView } from "../../_basic";
import { pickFrom } from "@ns-world-lab-knx/logic";

// ======================================== types
export type FileWithUrlRendererDataItem
    = FileItemWithUrlAndFileID
// ======================================== types/props
export type FileWithUrlRendererProps =
    & HasData<FileItemWithUrlAndFileID>
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
        data
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