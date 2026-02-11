import { HasFile, HasPartialUrl, HasUrl, KeyOf } from "@ns-world-lab/types"
import { AnyFileItemType, FileItemWithPartialUrl, FileItemWithPartialUrlAndPartialFileID
    , FileItemWithUrlAndFileID, FileItemWithUrlAndFileIDAndID, InputFileItemList } from "../../types"







// ========================================



export const _getUrl_fromFile = <
    F extends FileItemWithPartialUrl
>(
    file?: F
) => !file
        ? undefined
        : ((file as FileItemWithPartialUrl).url ?? URL.createObjectURL(file as File))

    , _getFileID_fromFile = <
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

    , _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID = <
        F extends AnyFileItemType
    >(
        inputFileItems: InputFileItemList<F>
    ): FileItemWithUrlAndFileIDAndID[] =>
        [...(inputFileItems ?? [])]
            .filter(Boolean)
            .map((file): FileItemWithUrlAndFileIDAndID => {
                const fileID = _getFileID_fromFile(file)
                return Object.assign(
                    file
                    , {
                        url: _getUrl_fromFile(file)
                        , fileID
                        , id: fileID
                    }
                ) as FileItemWithUrlAndFileIDAndID
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
        FT extends AnyFileItemType
        , I extends InputFileItemList<FT>
    >(
        inputFileItemList: I
        , excludeFiles = [] as Iterable<FileItemWithPartialUrlAndPartialFileID>
        , options = {} as Partial<{
            filterBy: KeyOf<FileItemWithPartialUrlAndPartialFileID>
        }>
    ) => {
        type F2 = FileItemWithPartialUrlAndPartialFileID

        const {
            filterBy = "fileID"
        } = options

            , normalisedFiles = _transform_AnyFileItemType_to_FileItemWithUrlAndFileIDAndID(inputFileItemList)
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