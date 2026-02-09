// import { KeyOf, PartialEventHandlersFromMap } from "@ns-lab-knx/types"
// import { IFrameDataItem } from "./IFrameDataItem"
// import { _tw, Box, ButtonGroupEntryItem, ButtonGroupRS, ButtonRS } from "@ns-lab-knx/web"
// import { createID, createIFrame, entriesOf } from "@ns-lab-knx/logic"
// import { faker } from "@faker-js/faker"

// // ======================================== const
// // const FAKE_FACTORIES = {
// //     name: faker.commerce.product
// //     , url: faker.internet.url
// // } as {
// //         [k in KeyOf<IFrameDataItem>]: () => IFrameDataItem[k]
// //     }
// //     , CSS = {
// //         button_span: _tw`font-bold px-1 text-[16px] cursor-default`
// //     }
// // export const _createIFrameDataItem = (
// //     partial = {} as Partial<
// //         Pick<
// //             IFrameDataItem
// //             , "name" | "url"
// //         >
// //     >
// // ) => ({
// //     id: createID()
// //     , name: FAKE_FACTORIES.name()
// //     , url: FAKE_FACTORIES.url()
// //     , ...partial
// // } as IFrameDataItem)

// // ======================================== types
// export type FakeIFrameDataFactoryProps =
//     PartialEventHandlersFromMap<{
//         change: Partial<IFrameDataItem>
//     }>

// // ======================================== component - FakeButtons
// export const FakeIFrameDataFactory = ({
//     onChange
// }: FakeIFrameDataFactoryProps
// ) => (
//     <Box
//         header="Generate Fake Data"
//         className={`
//             min-w-0 whitespace-nowrap
//             mb-2
//             flex
//             `}
//         justifyChildren
//     >
//         <ButtonGroupRS
//             className={`
//                 border 
//                 rounded-md 
//                 border-gray-200
//                 flex flex-nowrap
//                 overflow-x-auto
//                 whitespace-nowrap
//                 cursor-default
//             `}

//             buttons={
//                 entriesOf(FAKE_FACTORIES)
//                     .map(([k, fn]) => {
//                         return [
//                             k
//                             , {
//                                 className: CSS.button_span
//                                 , onClick: () => onChange?.({
//                                     [k]: fn()
//                                 })
//                             }
//                         ] as ButtonGroupEntryItem
//                     })
//             }
//         >
//             <ButtonRS
//                 data-create-iframe-data-item
//                 onClick={() => {
//                     onChange?.(
//                         createIFrame()
//                     )
//                 }}
//             >
//                 IFrameDataItem
//             </ButtonRS>
//         </ButtonGroupRS>
//     </Box>
// )