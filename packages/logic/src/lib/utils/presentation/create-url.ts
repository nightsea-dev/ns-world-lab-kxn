import { faker } from '@faker-js/faker'
import { getRandom } from '../js'
import { createImageSource } from './create-image-source'


const REACHABLE_DOMAINS = [
    'example.com',
    'wikipedia.org',
    'developer.mozilla.org',
    'github.com',
    'news.ycombinator.com',
    'stackoverflow.com',
]
export const IFRAME_SAFE_URLS = [
    'https://www.youtube.com/embed/dQw4w9WgXcQ'
    , "https://www.youtube.com/embed/aqz-KE-bpKQ"
    , "https://www.youtube.com/embed/jfKfPfyJRdk"
    , "https://www.youtube.com/embed/lTRiuFIWV54"
    , "https://www.youtube.com/embed/GRxofEmo3HA"
    , 'https://player.vimeo.com/video/76979871'
    , 'https://httpbin.org/html'
    , "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    , "https://en.wikipedia.org/wiki/Special:Random"
    , "https://c.xkcd.com/random/comic/"
    , createImageSource

    // , "https://www.youtube.com/embed/21X5lGlDOfg"
    // 'https://example.com',
    // 'https://picsum.photos/800/600',
    // 'https://placehold.co/800x600',
    // 'https://www.openstreetmap.org/export/embed.html',
    // 'https://www.w3schools.com/html/html_iframe.asp',

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

    , getRandomUrl = (): string => {
        const v = getRandom(IFRAME_SAFE_URLS)!
        return typeof (v) === "function"
            ? v() : v
    }



