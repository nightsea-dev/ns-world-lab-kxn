import { EventHandlersFromMap, FirstParam, HasData, HasKind, KeyOf, PayloadWithKind } from "@ns-world-lab-kxn/types";
import { InputView_Props } from "@ns-world-lab-kxn/web";
import { IFrame_InputView, Image_InputView } from "../../../components";
import { ComponentProps, FunctionComponent } from "react";
import { KnownPayloadKind, KnownPayloadOf } from "./KnownPayload.renderers";


export const KNOWN_INPUT_VIEWS = {
    Image_InputView
    , IFrame_InputView
}

export type KNOWN_INPUT_VIEWS = typeof KNOWN_INPUT_VIEWS
export type KnownInputViewKey = KeyOf<KNOWN_INPUT_VIEWS>
export type KnownInputViewType = KNOWN_INPUT_VIEWS[KnownInputViewKey]
export type KnownInputViewProps = ComponentProps<KnownInputViewType>


export type KnownInputViewDataItemMap = {
    [k in KeyOf<KNOWN_INPUT_VIEWS>
    as k extends `${infer _kind}_InputView`
    ? Lowercase<_kind> extends KnownPayloadKind ? Lowercase<_kind> : never
    : never
    ]
    : FirstParam<ComponentProps<KNOWN_INPUT_VIEWS[k]>["onDone"]>["data"][number]
}



export const KNOWN_PAYLOAD_INPUT_VIEWS_BY_KIND = {
    iframe: IFrame_InputView
    , image: Image_InputView
} as const


// import {
//     IFrameWithKind,
//     ImageWithKind
// } from "@ns-world-lab-kxn/types";
// import {
//     createID
// } from "@ns-world-lab-kxn/logic";
import {
    //      DrawerInfo
    //     , Renderer
    //     , _getMimeType
    //     , LoadedFileItem
    PayloadLoader_Props
} from "@ns-world-lab-kxn/web";
// import {
//     KnownPayloadKind
//     , KnownPayloadOf
// } from "./KnownPayload.renderers";
// import { IFrameDataItem, IFrameInputView, IFrameInputViewProps, ImageInputView, ImageInputViewProps } from "../../../components";



// // ======================================== transformations/helpers
// const _transform_IFrameDataItem_to_IFrameWithKind = ({
//     id = createID()
//     , name
//     , url: src
// }: IFrameDataItem
// ) => {
//     return ({
//         id
//         , kind: "iframe"
//         , name
//         , src
//     } as IFrameWithKind)
// }
//     , _transform_LoadedFileItem_to_ImageWithKind = async (
//         loadedFileItem: LoadedFileItem
//     ): Promise<ImageWithKind> => {
//         const {
//             arrayBuffer
//             , bytes
//             , fileID: id
//             , lastModified
//             , name
//             , size
//             , type
//             , url: src
//             , webkitRelativePath
//         } = loadedFileItem

//         // , {
//         //     extent
//         // } = await getImageExtentFromFile(loadedFileItem)

//         return {
//             file: loadedFileItem
//             , id
//             , kind: "image"
//             , mimeType: _getMimeType(loadedFileItem)!
//             , name
//             , size
//             , src
//         }
//     }




// // ======================================== types/KnownPayload
export type KnownPayloadLoader_Props<
    K extends KnownPayloadKind
> = PayloadLoader_Props<
    KnownPayloadOf<K>
>

// export type KnownPayloadLoader<
//     K extends KnownPayloadKind
// > = Renderer<
//     KnownPayloadLoaderProps<K>
// >


// // ======================================== renderers/iframe/component
// export const IFramePayloadLoader
//     : KnownPayloadLoader<"iframe">
//     = ({
//         onCancel
//         , onDone
//         , onClear
//     }) => {

//         const _handleIFrameInput
//             : IFrameInputViewProps["onDone"]
//             = ({ data }) => {

//                 if (!data.length) {
//                     return
//                 }

//                 const payloads = data
//                     .map(_transform_IFrameDataItem_to_IFrameWithKind)
//                     .filter(Boolean)

//                 onDone({ payloads })

//             }
//         return (
//             <IFrameInputView
//                 onDone={_handleIFrameInput}
//                 onCancel={onCancel}
//             />
//         )
//     }

// // ======================================== renderers/image/component
// export const ImagePayloadLoader
//     : KnownPayloadLoader<"image">
//     = ({
//         onCancel
//         , onDone
//         , onClear
//     }) => {

//         const _handleImageInput
//             : ImageInputViewProps["onDone"]
//             = async ({ data }) => {

//                 if (!data.length || !onDone) {
//                     return
//                 }

//                 const payloads
//                     = await Promise.all(data.map(_transform_LoadedFileItem_to_ImageWithKind)
//                         .filter(Boolean))

//                 onDone({ payloads })

//             }

//         return (
//             <ImageInputView
//                 onCancel={onCancel}
//                 onDone={_handleImageInput}
//             />

//         )

//     }






// // type KnownPayloadDrawerInfosMap
// //     = Partial<{
// //         [k in KnownPayloadKind]: DrawerInfo<
// //             KnownPayloadLoaderProps<
// //                 k
// //             >
// //         >
// //     }>

// export const KNOWN_PAYLOAD_LOADER_DRAWER_INFOS_MAP = {
//     image: {
//         body: ImagePayloadLoader
//         , header: (
//             <div
//                 className='text-2xl'
//             >Add Images</div>)
//     }
//     , iframe: {
//         body: IFramePayloadLoader
//         , header: (
//             <div
//                 className='text-2xl'
//             >Add IFrame</div>)
//     }

// } as KnownPayloadDrawerInfosMap

