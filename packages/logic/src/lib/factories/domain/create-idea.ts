import { faker } from '@faker-js/faker'
import { createID } from '../primitives'
import { Idea, IdeaWithKindAndAuthor, IdeaWithKind, HasNumberOfItems } from '@ns-world-lab-kxn/types'
import { createUser } from './create-user'
import { getRandomColour } from '../../utils'

/**
 * * depends on 
 *      * [faker]
 */
export const createIdeaWithKind = (
    o = {} as Partial<IdeaWithKind>
): Idea => {
    // const id = String(Date.now())
    return ({
        id: createID()
        , title: faker.word.sample() + ' + Idea'
        , content: faker.lorem.paragraph(1)
        , color: getRandomColour().toRgbString()
        , ...o
        , kind: "idea"
        // , author: createUser(o.)
        // , author: {
        //     uuid: faker.string.uuid(),
        //     name: faker.person.fullName(),
        //     email: faker.internet.email(),
        //     job: faker.person.jobTitle(),
        // },
        // type: 'idea',
        // position: { x: 40, y: 80 },
        // size: { width: 200, height: 200 },
    } as IdeaWithKind)
}
    , createIdeaWithAuthor = (
        o = {} as Partial<IdeaWithKindAndAuthor>
    ): IdeaWithKindAndAuthor => {
        // const id = String(Date.now())
        return ({
            ...createIdeaWithKind()
            , author: createUser(o?.author)
            , ...o
            // , author: {
            //     uuid: faker.string.uuid(),
            //     name: faker.person.fullName(),
            //     email: faker.internet.email(),
            //     job: faker.person.jobTitle(),
            // },
            // type: 'idea',
            // position: { x: 40, y: 80 },
            // size: { width: 200, height: 200 },
            // ,        title: 'Idea',
            //         content: faker.lorem.paragraph(1),
            //         color: getRandomColor(),
        } as IdeaWithKindAndAuthor)
    }
    , createIdeaWithAuthorCollection = ({
        numberOfItems
    }: HasNumberOfItems
    ) => Array.from({ length: numberOfItems }).map(() => createIdeaWithAuthor())
