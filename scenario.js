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
            maxVUs: 90,
            preAllocatedVUs: 10,
            stages: [
                { target: 1, duration: '1s' }
            ],
        },
    },
};