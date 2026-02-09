import { faker } from '@faker-js/faker'
import { User } from '@ns-world-lab-knx/types'

/**
 * * depends on 
 *      * [faker]
 */
export const createUser = (
    o = {} as Partial<User>
): User => {
    // const id = String(Date.now())
    return ({
        uuid: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        job: faker.person.jobTitle()
        , ...o
    } as User)
}
