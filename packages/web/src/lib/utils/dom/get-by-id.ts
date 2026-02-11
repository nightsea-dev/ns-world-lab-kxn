import { ID } from "@ns-world-lab/types";


export const _getById = (
    id: ID
) => document.getElementById(id) as HTMLElement | undefined
