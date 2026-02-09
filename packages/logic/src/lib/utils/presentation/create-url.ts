import { faker } from '@faker-js/faker'


const REACHABLE_DOMAINS = [
    'example.com',
    'wikipedia.org',
    'developer.mozilla.org',
    'github.com',
    'news.ycombinator.com',
    'stackoverflow.com',
]
export const IFRAME_SAFE_URLS = [
    'https://example.com',
    'https://picsum.photos/800/600',
    'https://placehold.co/800x600',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://player.vimeo.com/video/76979871',
    'https://www.openstreetmap.org/export/embed.html',
    'https://httpbin.org/html',
    'https://www.w3schools.com/html/html_iframe.asp',
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

