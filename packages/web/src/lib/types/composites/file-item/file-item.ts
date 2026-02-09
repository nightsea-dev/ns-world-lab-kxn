import { HasFile, HasPartialUrl, HasUrl } from "@ns-lab-knx/types"

// ======================================== capabilities
export type HasFileID = {
    fileID: string
}
export type HasPartialFileID =
    Partial<HasFileID>

// export type HasPartialFileID =
//     Partial<HasFileID>

// export type HasUrlAndFileID =
//     & HasUrl
//     & HasFileID

// export type FileItemWithUrlAndFileID =
//     & FileItem
//     & HasUrlAndFileID

// export type HasPartialUrlAndFileID =
//     & Partial<HasUrlAndFileID>



// ======================================== contracts/FileItem
/**
 * [File]
 */
export type FileItem = File

// ========================================
export type FileItemWithUrl =
    & FileItem
    & HasUrl
export type FileItemWithUrlAndFileID =
    & FileItem
    & HasUrl
    & HasFileID
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
