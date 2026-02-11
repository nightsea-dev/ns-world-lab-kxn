
export type AnyFn = (...args: any) => any
export type FirstParam<T extends AnyFn> = Parameters<T>[0]
