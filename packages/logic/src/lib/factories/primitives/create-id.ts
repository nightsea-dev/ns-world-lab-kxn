import { v4 as uuidv4 } from "uuid";
import { HasId, HasPartialId, ID } from "@ns-world-lab-knx/types";


/**
 * * depends on 
 *      * [uuid]
 */
export const createID = (): ID => uuidv4()

    , createIdFor = <
        T extends HasPartialId
    >(
        o = {} as T
    ): Omit<T, "id"> & HasId => ({
        ...o
        , id: o.id ?? createID()
    })

