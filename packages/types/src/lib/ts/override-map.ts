import { KeyOf } from "./key-of.types";





export type OverrideMap<
  Base extends Record<PropertyKey, any>,
  Override extends Partial<Record<keyof Base, any>> | undefined = undefined
  , Ex extends KeyOf<Base> | never = never
> = Omit<
  {
    [K in keyof Base]:
    Override extends undefined
    ? Base[K]
    : (
      K extends keyof Override
      ? (Override[K] extends never | undefined ? Base[K] : Override[K])
      : Base[K]
    )
  }
  , Ex
>