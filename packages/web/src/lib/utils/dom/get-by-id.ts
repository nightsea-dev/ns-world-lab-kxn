import { ID } from "@ns-world-lab-kxn/types";


export const _getById = (
    id: ID
) => document.getElementById(id) as HTMLElement | undefined
