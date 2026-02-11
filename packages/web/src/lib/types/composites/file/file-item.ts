import { HasFile, HasId, HasPartialUrl, HasUrl } from "@ns-world-lab/types"

// ======================================== capabilities
export type HasFileID = {
    fileID: string
}
export type HasPartialFileID =
    Partial<HasFileID>




// ======================================== contracts/FileItem
/**
 * [File]
 */
export type FileItem = File

// ========================================
export type FileItemWithUrl =
    & FileItem
    & HasUrl
export type FileItemWithUrlAndID =
    & FileItem
    & HasUrl
    & HasId
export type FileItemWithUrlAndFileID =
    & FileItem
    & HasUrl
    & HasFileID
export type FileItemWithUrlAndFileIDAndID =
    & FileItem
    & HasUrl
    & HasFileID
    & HasId
// ========================================

export type FileItemWithPartialUrl =
    & FileItem
    & HasPartialUrl


export type FileItemWithPartialUrlAndPartialFileID =
    & FileItem
    & HasPartialUrl
    & HasPartialFileID


// ========================================

export type AnyFileItemType =
    | FileItem
    | FileItemWithPartialUrlAndPartialFileID

export type HasFileWithUrlAndFileID
    = HasFile<FileItemWithPartialUrlAndPartialFileID>
