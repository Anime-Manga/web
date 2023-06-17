import { createRouter, defineEventHandler, useBase, readBody } from 'h3'
const router = createRouter()

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

router.post('/login', defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/auth/login`, {method: 'post', body: body});
}))

router.post('/register', defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/auth/register`, {method: 'post', body: body});
}))

router.delete('/watchlist', defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/auth/watchlist`, {method: 'delete', body: body});
}))

router.post('/watchlist', defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/auth/watchlist`, {method: 'post', body: body});
}))

export default useBase('/api/account', router.handler)