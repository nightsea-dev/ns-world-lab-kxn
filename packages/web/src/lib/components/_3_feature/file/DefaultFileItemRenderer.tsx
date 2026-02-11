import { pickFrom } from "@ns-world-lab-kxn/logic";
import { ObjectView } from "../../_2_composite";
import { FileItemRenderer } from "../../../types";
import { _memo } from "../../../utils";


// ======================================== component/default
export const Default_FileItemRenderer: FileItemRenderer = ({
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

