import { User } from "@ns-world-lab-knx/types"
import { createUser } from '../factories'
import { _t } from "../utils"

let firstFetch = true

const waitMs = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// fake api call
const _fetchUsers = async (
    n = 25
): Promise<User[]> => {
    console.log(`${_t()} Call API to fetch users`)
    if (!firstFetch) {
        await waitMs(5000)
    } else {
        firstFetch = false
    }

    await waitMs(30)

    return Array.from({ length: n }).map(() => createUser())
    // return Array.from({ length: 25 }).map(() => ({
    //     id: faker.string.uuid(),
    //     name: faker.person.fullName(),
    //     email: faker.internet.email(),
    //     job: faker.person.jobTitle(),
    // }))
}



/**
 * * faked [API]
 */
export const API = {
    fetchUsers: _fetchUsers
}