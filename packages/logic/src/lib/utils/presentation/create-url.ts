import { faker } from '@faker-js/faker'


const REACHABLE_DOMAINS = [
    'example.com',
    'wikipedia.org',
    'developer.mozilla.org',
    'github.com',
    'news.ycombinator.com',
    'stackoverflow.com',
]



export const createRandomReachableUrl = () => {
    const domain =
        REACHABLE_DOMAINS[
        faker.number.int({ min: 0, max: REACHABLE_DOMAINS.length - 1 })
        ]

    const path = faker.internet
        .domainWord()
        .toLowerCase()

    return `https://${domain}/${path}`
}

