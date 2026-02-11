


export const getRandom = <T>(
    arr: readonly T[]
): T | undefined => {
    if (!arr.length) {
        return
    }
    const i = Math.floor(Math.random() * arr.length);
    return arr[i];
}