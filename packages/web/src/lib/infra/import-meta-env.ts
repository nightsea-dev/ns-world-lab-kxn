export const ImportMetaEnv = {
    APP_NAME: import.meta.env.VITE_APP_NAME ?? "@ns-world-lab/web-app"
    , IS_IN_DEBUG_MODE: Boolean(import.meta.env.VITE_IS_IN_DEBUG_MODE) ?? false
    , MAX_PAYLOAD_FACTORY_ADD: Number(import.meta.env.VITE_MAX_PAYLOAD_FACTORY_ADD) || 10
    , MAX_NUMBER_OF_PAYLOADS: Number(import.meta.env.VITE_MAX_NUMBER_OF_PAYLOADS) || 100
} as const 