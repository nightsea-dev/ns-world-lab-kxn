import React, { useRef } from "react"
import { _effect, _memo } from "../utils"
import { _t } from "@ns-world-lab/logic"

type Entry = {
    mount: number
    dismount: number
}

const getEntry = (): Entry => ({
    mount: 0
    , dismount: 0
})

type KeyIn = string | { name: string }
type Options = {
    consoleOff?: boolean
    rest?: any[]
}

const COUNTERS = {} as Record<string, Entry>
    , getCounters = () => COUNTERS

export const useMountCounter = (
    key_IN: KeyIn
    , optionsOrConsoleOff: Options | boolean = false
) => {
    const {
        consoleOff = false
        , rest = []
    }: Options = typeof (optionsOrConsoleOff) === "boolean"
            ? {
                consoleOff: optionsOrConsoleOff
            }
            : (optionsOrConsoleOff ?? {})

    const key = _memo([key_IN], () => typeof (key_IN) === "string" ? key_IN : key_IN.name)
        , counters = COUNTERS[key] ??= getEntry()
    _effect(() => {
        counters.mount++
            ; consoleOff || console.log(_t(key + " | MOUNT"), counters.mount, ...rest)
        return () => {
            counters.dismount++
                ; consoleOff || console.log(_t(key + " | DISMOUNT"), counters.dismount, ...rest)
        }
    })

    return {
        data: {
            key
            , ...counters
        }
        , getCounters
        , reset: () => COUNTERS[key] = getEntry()
    }

}
