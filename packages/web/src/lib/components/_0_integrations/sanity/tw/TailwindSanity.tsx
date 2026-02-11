import { useState } from "react"
import { BUTTON_TW_APPEARANCES, ButtonTw, ButtonTwAppearance } from "../../../_1_primitive"




export const TailwindSanity_01 = () => {
    return (
        <div
            className="bg-emerald-600 text-white p-2"
        >
            Tailwind shared config works
        </div>

    )

}


    , TailwindSanity_02 = () => {



        const [appearance, _set_appearance] = useState(undefined as undefined | ButtonTwAppearance)
            , _handleClick = (
                appearance?: ButtonTwAppearance
            ) => {
                _set_appearance(appearance)
            }

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 p-12">
                <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Tailwind is alive
                    </h1>

                    <p className="mt-4 text-slate-600">
                        If you can read this, the compiler is running.
                    </p>

                    <div
                        className="border border-gray-200 p-2 my-2 rounded-[10px]"
                    // className="border border-blue-500 p-2"
                    // className="border border-blue-500 p-2"
                    // style={{
                    //     border:"1px solid red"
                    // }}
                    >
                        appearance:
                        <span
                            className={`mx-2 px-4 py-1 rounded-[10px] ${appearance ? "bg-gray-100" : "text-gray-300"}`}
                        >
                            {appearance ? <b>{appearance}</b> : <i>{`<undefined>`}</i>}
                        </span>
                    </div>
                    <div className="mt-6 flex gap-3">
                        {BUTTON_TW_APPEARANCES.map(k => (
                            <ButtonTw
                                key={k}
                                appearance={k}
                                onClick={() => _handleClick(k)}
                            >{k}</ButtonTw>
                        ))}
                        <ButtonTw
                            onClick={() => _handleClick()}
                        >clear</ButtonTw>
                        {/* <ButtonTw
                            appearance="primary"
                            onClick={() => _handleClick("primary")}
                        >
                            Primary
                        </ButtonTw> */}
                        {/* <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white shadow-sm hover:bg-emerald-500 hover:shadow-md transition">
                            Primary
                        </button> */}

                        {/* <ButtonTw
                            appearance="secondary"
                            onClick={() => _handleClick("secondary")}
                        >
                            Secondary
                        </ButtonTw> */}
                        {/* <button className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100 transition">
                            Secondary
                        </button> */}
                    </div>

                    <div className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
                        <div className="font-mono text-xs text-slate-500">
                            Tailwind v4 sanity block
                        </div>
                        <div className="mt-1">
                            Gradients · shadows · spacing · typography · hover states
                        </div>
                    </div>
                </div>
            </div>
        )
    }
