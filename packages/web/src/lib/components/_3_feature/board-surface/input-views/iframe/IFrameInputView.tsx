
import { _effect, _isValidUrl, _use_state } from "../../../../../utils"
import { Box } from "../../../../_1_primitive"
import { ButtonGroupRS, ButtonRS } from "../../../../_2_composite"
import { InputView, InputView_Props, InputViewLayout, InputViewLayout_Props } from "../../../../_4_layout"
import { SimpleForm, SimpleFormProps } from "../../../simple-form"
import {
    createIFrameDataItem,
    IFRAME_DATA_ITEM_KEYS,
    IFrameDataItem
    , IFrameDataItemList
    , IFrameRowProps
} from "./IFrameDataItem"


type TData = IFrameDataItem



// ======================================== helpers
const _isValidData = <
    T extends Partial<TData>
>(o?: T) =>
    o
    && IFRAME_DATA_ITEM_KEYS.every(k => !!o[k] && o[k] !== undefined && o[k] !== null)
    && _isValidUrl(o.url)

    , _isEmptyDataItem = <
        T extends Partial<TData>
    >(o?: T) =>
        o
        && IFRAME_DATA_ITEM_KEYS.every(k => !(o?.[k] ?? "").trim().length)





// ======================================== events - IFrameInputView

// ======================================== props - IFrameInputView
export type IFrame_InputView_Props =
    & InputView_Props<TData>


// ======================================== types/consts
type CurrentData = Pick<TData, "name" | "url">
type State = {
    dataCollection: TData[]
    currentData: CurrentData
}
const EMPTY_CURRENT_DATA = (): CurrentData => ({
    name: ""
    , url: ""
})
    , RESET_STATE = (): Pick<State, "currentData" | "dataCollection"> => ({
        currentData: EMPTY_CURRENT_DATA()
        , dataCollection: []
    })


// ======================================== component
export const IFrame_InputView: InputView.FC<IFrame_InputView_Props> = ({
    onDone: onDone_IN
    , onCancel: onCancel_IN
}) => {

    const [state, _set_state] = _use_state({
        dataCollection: [] as TData[]
        , currentData: EMPTY_CURRENT_DATA()
    } as State)

        , _handle_Remove_IFrameDataItem: IFrameRowProps["onRemove"]
            = ({ data }) => {

                const { dataCollection } = state

                    , [item] = dataCollection.splice(
                        dataCollection.findIndex(o => o.id === data.id)
                        , 1
                    )

                if (!item) {
                    return
                }

                _set_state({
                    dataCollection: [...dataCollection]
                })

            }

        , _handle_AddData = () =>
            _set_state(p => {

                const {
                    currentData
                    , dataCollection: current_dataCollection
                } = p

                let nextState = p

                if (_isValidData(currentData)) {
                    const { name, url } = currentData
                        , next_dataCollection = [...current_dataCollection]

                    next_dataCollection.push({
                        name
                        , url
                        , id: [name, url].join("|")
                    })
                    nextState = {
                        ...p
                        , dataCollection: next_dataCollection
                        , currentData: EMPTY_CURRENT_DATA()
                    }
                }

                return nextState

            })

        , _handle_Clear_currentData
            = () => _set_state({
                currentData: EMPTY_CURRENT_DATA()
            })

        , _handle_Clear_IFrameDataItemCollection
            = () => _set_state({ dataCollection: [] })


        , _clear_State = () => _set_state(RESET_STATE())


        , controlButtonHandlers: Pick<InputViewLayout_Props["controlButtonsProps"], "onDone" | "onClear"> = {
            onClear: () => _clear_State
            , onDone: () => onDone_IN({ data: state.dataCollection })
        }



        , _handle_SimpleForm_Change: SimpleFormProps<CurrentData>["onChange"] = ({
            currentData
            , previousData
        }) => _set_state({
            currentData: {
                ...state.currentData
                , ...currentData
            }
        })

        , _handleGenerateFake = async () => {

            const {
                id
                , name
                , url
            } = createIFrameDataItem()

            _set_state({
                currentData: {
                    name
                    , url
                }
            })
        }

        , _handleGenerateAndAddFake = () => {
            _handleGenerateFake()
            _handle_AddData()
        }

    _effect([], () => {
        return () => {

            controlButtonHandlers.onClear?.()
        }
    })

    return (
        <>
            <InputViewLayout
                controlButtonsProps={{
                    isDisabled: {
                        done: !state.dataCollection.length
                        , clear: !state.dataCollection.length
                    }
                    , ...controlButtonHandlers
                    , onCancel: onCancel_IN
                    , infoData: state as any
                }}
            >
                <Box>

                    <SimpleForm
                        data={state.currentData}
                        hideButtons={true}
                        onChange={_handle_SimpleForm_Change}
                    />

                    <ButtonGroupRS
                        wrapperType="Box"
                        bordered={false}
                        className={`
                        ---p-1
                        p-0
                `}
                        justifyChildren="right"
                        buttonProps={{
                            appearance: "default"
                            , size: "md"
                            , className: "px-5 py-0"
                        }}
                        buttons={{
                            clear: {
                                onClick: _handle_Clear_currentData
                                , disabled: _isEmptyDataItem(state.currentData)
                            }
                            , add: {
                                onClick: _handle_AddData
                                , disabled: !_isValidData(state.currentData)
                                , appearance: "primary"
                            }
                        }}
                    />
                </Box>

                <ButtonGroupRS
                    wrapperType="Box"
                    header="factories"
                    className="flex my-2"
                >
                    <ButtonRS
                        data-create-iframe-data-item
                        appearance="default"
                        onClick={_handleGenerateFake}
                    >
                        Generate
                    </ButtonRS>
                    <ButtonRS
                        data-create-iframe-data-item
                        appearance="default"
                        onClick={_handleGenerateAndAddFake}
                    >
                        Generate & Add
                    </ButtonRS>
                </ButtonGroupRS>

                <IFrameDataItemList
                    data={state.dataCollection}
                    onRemove={_handle_Remove_IFrameDataItem}
                    onClear={_handle_Clear_IFrameDataItemCollection}
                />
            </InputViewLayout>

            {/* <Box
                data-iframe-input-view
                className={`
                h-full w-full flex flex-col gap-4 p-6 overflow-auto
                `}
            >

                <ControlButtons
                    justifyChildren="right"
                    bordered={false}
                    showInfoName="Info"
                    isDisabled={{
                        done: !state.dataCollection.length
                        , clear: !state.dataCollection.length
                    }}
                    onDone={_handleControlDone}
                    onCancel={onCancel}
                    onClear={_handleControlClear}
                    infoData={state}
                />

                <div>
                    <Box>

                        <TextNumberForm
                            data={state.currentData}
                            hideButtons={true}
                            onChange={_handleChange}
                        />

                        <ButtonGroupRS
                            wrapperType="Box"
                            bordered={false}
                            className={`
                        ---p-1
                        p-0
                `}
                            justifyChildren="right"
                            buttonProps={{
                                appearance: "default"
                                , size: "md"
                                , className: "px-5 py-0"
                            }}
                            buttons={{
                                clear: {
                                    onClick: _handleClear_currentData
                                    , disabled: _isEmpty(state.currentData)
                                }
                                , add: {
                                    onClick: _handleAddData
                                    , disabled: !_isValidData(state.currentData)
                                    , appearance: "primary"
                                }
                            }}
                        />
                    </Box>

                    <ButtonGroupRS
                        wrapperType="Box"
                        header="factories"
                        className="flex my-2"
                    >
                        <ButtonRS
                            data-create-iframe-data-item
                            appearance="default"
                            onClick={_handleGenerateFake}
                        >
                            Generate
                        </ButtonRS>
                        <ButtonRS
                            data-create-iframe-data-item
                            appearance="default"
                            onClick={_handleGenerateAndAddFake}
                        >
                            Generate & Add
                        </ButtonRS>
                    </ButtonGroupRS>

                    <IFrameDataItemList
                        data={state.dataCollection}
                        onRemove={_handleRemove}
                        onClear={_handleClear_collection}
                    />
                </div>
            </Box> */}
        </>
    )
}
