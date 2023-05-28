import { createRouter, defineEventHandler, useBase, readBody, getQuery} from 'h3'
const router = createRouter()

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

router.get('/chapter', defineEventHandler(async (event) => {
    const {name} = getQuery(event)
    return await $fetch(`${API_BASE}/chapter/name/${name}`, {method: 'get'});
}))

router.delete('/delete', defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event)
    return await $fetch(`${API_BASE}/book/${name}?nameCfg=${nameCfg}`, {method: 'delete'});
}))

router.post('/download', defineEventHandler(async (event) => {
    const {url, nameCfg} = await readBody(event)
    return await $fetch(`${API_BASE}/book/download`, {body:{url, nameCfg}, method:'post'});
}))

router.get('/get', defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event)
    return await $fetch(`${API_BASE}/book/name/${name}?nameCfg=${nameCfg}`, {method: 'get'});
}))

router.get('/progress', defineEventHandler(async (event) => {
    const query = getQuery(event)
    return await $fetch(`${API_BASE}/chapter/progress`, {method: 'get', query});
}))

router.put('/progress', defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/chapter/progress`, {method: 'put', body});
}))

router.put('/redownload', defineEventHandler(async (event) => {
    const {name} = getQuery(event);
    return await $fetch(`${API_BASE}/book/redownload?name=${name}`, {method: 'put'});
}))

router.get('/register', defineEventHandler(async (event) => {
    const {id} = getQuery(event)
    return await $fetch(`${API_BASE}/chapter/register/chapterid/${id}`, {method: 'get'});
}))

export default useBase('/api/manga', router.handler)