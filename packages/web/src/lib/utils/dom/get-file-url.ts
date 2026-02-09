import { HasFile, HasPartialUrl, HasUrl, KeyOf } from "@ns-lab-knx/types"
import {
    AnyFileItemType
    , FileItemWithPartialUrl
    , FileItemWithPartialUrlAndPartialFileID, FileItemWithUrlAndFileID, InputFileItemList
} from "../../types"








// ========================================



export const _getFileUrl = <
    F extends FileItemWithPartialUrl
>(
    file?: F
) => !file
        ? undefined
        : ((file as FileItemWithPartialUrl).url ?? URL.createObjectURL(file as File))

    , _getFileID = <
        F extends File
    >(
        file?: F
    ) => {
        if (!file) {
            return
        }
        const chain = [file.name, file.size, file.lastModified].filter(Boolean)
        if (!chain.length) {
            const err = Object.assign(
                new Error(`Unable to create [fileID]!`)
                , { file }
            )
            console.error(err)
            return
        }

        return chain.join("|")

    }

    ,
    /**
     * [_transform_AnyFileItemType_to_FileItemWithUrlAndFileID]
     */
    _normaliseFiles = <
        F extends AnyFileItemType
    >(
        inputFileItems: InputFileItemList<F>
    ): FileItemWithUrlAndFileID[] =>
        [...(inputFileItems ?? [])]
            .filter(Boolean)
            .map((o): FileItemWithUrlAndFileID => {
                return Object.assign(
                    o
                    , {
                        url: _getFileUrl(o)
                        , fileID: _getFileID(o)
                    }
                ) as FileItemWithUrlAndFileID
            })

    , _getFileKeySets = <
        F extends FileItemWithPartialUrlAndPartialFileID
        = FileItemWithPartialUrlAndPartialFileID
    >(
        arr: Iterable<F>
    ) => {
        const
            fileIDSet = new Set<FileItemWithUrlAndFileID["fileID"]>
            , urlSet = new Set<FileItemWithUrlAndFileID["url"]>
            ;
        ;[...arr].forEach(({ fileID, url }) => {
            ; !fileID || fileIDSet.add(fileID)
                ;
            ; !url || urlSet.add(url)
        })

        return {
            urlSet
            , fileIDSet
        }
    }

    ,
    /**
     * * will [_normaliseFiles]
     */
    _filterFiles = <
        F extends AnyFileItemType
    >(
        inputFileItemList: InputFileItemList<F>
        , excludeFiles = [] as Iterable<FileItemWithPartialUrlAndPartialFileID>
        , options = {} as Partial<{
            filterBy: KeyOf<FileItemWithPartialUrlAndPartialFileID>
        }>
    ) => {
        type F2 = FileItemWithPartialUrlAndPartialFileID

        const {
            filterBy = "fileID"
        } = options

            , normalisedFiles = _normaliseFiles(inputFileItemList)
            , { fileIDSet: excludedFileIDs, urlSet: excludedUrls } = _getFileKeySets(excludeFiles)
            , fn = filterBy === "fileID"
                ? (({ fileID }: F2) => (!!fileID && !excludedFileIDs.has(fileID)))
                : (({ url }: F2) => (!!url && !excludedUrls.has(url)))
            , filteredFiles = normalisedFiles.filter(fn)

        return {
            filteredFiles
            , normalisedFiles
        }
    }

    , _revokeUrls = (
        ...arr: (HasPartialUrl | HasPartialUrl[])[]
    ) => {
        arr.flat(1).forEach(({ url }) => {
            ; !url || URL.revokeObjectURL(url)
        })
    }



    , _stripExtFromFilename = (
        filename: string
    ) => filename.replace(/\.[^.]+$/, "")