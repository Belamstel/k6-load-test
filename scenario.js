/*
const endpoint = {
    list: `${baseUrl}/prescription/list`,
    shortList: `${baseUrl}/prescription/short/list`,
    release: `${baseUrl}/release`
}
let paramsJson = {
    headers: {
        "Content-Type": "application/json"
    }
}
let paramsJose = {
    headers: {
        "Content-Type": "application/jose"
    }
}
 */

export const scenario = {
    scenarios: {
        contacts: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            maxVUs: 190,
            preAllocatedVUs: 10,
            stages: [
                { target: 50, duration: '180s' },
                { target: 50, duration: '900s' },
                { target: 100, duration: '180s' },
                { target: 100, duration: '900s' },
                { target: 150, duration: '180s' },
                { target: 150, duration: '900s' },
                { target: 200, duration: '180s' },
                { target: 200, duration: '7200s' },
                { target: 0, duration: '180s' }
            ],
        },
    },
};