import { createRouter, defineEventHandler, useBase, readBody, getQuery} from 'h3'
import axios from "axios";
const router = createRouter()

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

router.delete('/delete', defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event);

    try{
        return (await axios.delete(`${API_BASE}/video/${name}?nameCfg=${nameCfg}`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.post('/download', defineEventHandler(async (event) => {
    const {url, nameCfg} = await readBody(event);

    try{
        return (await axios.post(`${API_BASE}/video/download`, {url, nameCfg})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/episode', defineEventHandler(async (event) => {
    const {name} = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/name/${name}`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/get', defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/video/name/${name}?nameCfg=${nameCfg}`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/progress', defineEventHandler(async (event) => {
    const params = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/progress`, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.put('/progress', defineEventHandler(async (event) => {
    const data = await readBody(event);

    try{
        return (await axios.put(`${API_BASE}/episode/progress`, data)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.put('/redownload', defineEventHandler(async (event) => {
    const {name} = getQuery(event);

    try{
        return (await axios.put(`${API_BASE}/video/redownload?name=${name}`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/register', defineEventHandler(async (event) => {
    const {id} = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/register/episodeid/${id}`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

export default useBase('/api/anime', router.handler)