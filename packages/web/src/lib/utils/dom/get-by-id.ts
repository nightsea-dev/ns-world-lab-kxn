import { ID } from "@ns-world-lab-knx/types";


export const _getById = (
    id: ID
) => document.getElementById(id) as HTMLElement | undefined
