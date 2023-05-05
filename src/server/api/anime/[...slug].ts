import { createRouter, defineEventHandler, useBase, readBody, getQuery} from 'h3'
const router = createRouter()

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

router.delete('/delete', defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event)
    return await $fetch(`${API_BASE}/video/${name}?nameCfg=${nameCfg}`, {method: 'delete'});
}))

router.post('/download', defineEventHandler(async (event) => {
    const {url, nameCfg} = await readBody(event)
    return await $fetch(`${API_BASE}/video/download`, {method: 'post', body:{url, nameCfg}});
}))

router.get('/episode', defineEventHandler(async (event) => {
    const {name} = getQuery(event)
    return await $fetch(`${API_BASE}/episode/name/${name}`, {method: 'get'});
}))

router.get('/get', defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event)
    return await $fetch(`${API_BASE}/video/name/${name}?nameCfg=${nameCfg}`, {method: 'get'});
}))

router.get('/progress', defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await $fetch(`${API_BASE}/episode/progress`, {method: 'get', query});
}))

router.put('/progress', defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/episode/progress`, {method: 'put', body});
}))

router.put('/redownload', defineEventHandler(async (event) => {
    const {name} = getQuery(event);
    return await $fetch(`${API_BASE}/video/redownload?name=${name}`, {method: 'put'});
}))

router.get('/register', defineEventHandler(async (event) => {
    const {id} = getQuery(event)
    return await $fetch(`${API_BASE}/episode/register/episodeid/${id}`, {method: 'get'});
}))

export default useBase('/api/anime', router.handler)