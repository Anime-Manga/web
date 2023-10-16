import { createRouter, defineEventHandler, useBase, readBody } from 'h3'
import axios from "axios";
const router = createRouter()

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

router.post('/login', defineEventHandler(async (event) => {
    const data = await readBody(event);
    const params = getQuery(event);

    try{
        return (await axios.post(`${API_BASE}/auth/login`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.post('/register', defineEventHandler(async (event) => {
    const data = await readBody(event);
    const params = getQuery(event);

    try{
        return (await axios.post(`${API_BASE}/auth/register`, data, { params })).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.delete('/watchlist', defineEventHandler(async (event) => {
    const data = await readBody(event);
    const params = getQuery(event);

    try{
        return (await axios.delete(`${API_BASE}/auth/watchlist`, {data, params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.post('/watchlist', defineEventHandler(async (event) => {
    const data = await readBody(event);
    const params = getQuery(event);

    try{
        return (await axios.post(`${API_BASE}/auth/watchlist`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

export default useBase('/api/account', router.handler)