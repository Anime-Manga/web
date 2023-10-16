import { createRouter, defineEventHandler, useBase, readBody, getQuery} from 'h3'
import axios from "axios";
const router = createRouter()

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

router.delete('/delete', defineEventHandler(async (event) => {
    const {name, ...params} = getQuery(event);
    const data = await readBody(event);

    try{
        return (await axios.delete(`${API_BASE}/video/${name}`, {params, data})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.post('/download', defineEventHandler(async (event) => {
    const data = await readBody(event);
    const params = getQuery(event);

    try{
        return (await axios.post(`${API_BASE}/video/download`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/episode', defineEventHandler(async (event) => {
    const {name, ...params} = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/name/${name}`, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/get', defineEventHandler(async (event) => {
    const {name, ...params} = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/video/name/${name}`, {params})).data;
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
    const params = getQuery(event);

    try{
        return (await axios.put(`${API_BASE}/episode/progress`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.put('/redownload', defineEventHandler(async (event) => {
    const params = getQuery(event);
    const data = await readBody(event);

    try{
        return (await axios.put(`${API_BASE}/video/redownload`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.put('/request-queue', defineEventHandler(async (event) => {
    const params = getQuery(event);
    const data = await readBody(event);

    try{
        return (await axios.put(`${API_BASE}/episode/queue`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.put('/blacklist', defineEventHandler(async (event) => {
    const params = getQuery(event);
    const data = await readBody(event);

    try{
        return (await axios.put(`${API_BASE}/episode/blacklist`, data, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/queue', defineEventHandler(async (event) => {
    const params = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/queue`, {params})).data;
    }catch(err){
        console.log(err);
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/all-queue', defineEventHandler(async (event) => {
    const params = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/all-queue`, {params})).data;
    }catch(err){
        console.log(err);
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.delete('/queue', defineEventHandler(async (event) => {
    const params = getQuery(event);
    const data = await readBody(event);

    try{
        return (await axios.delete(`${API_BASE}/episode/queue`, {params, data})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

router.get('/register', defineEventHandler(async (event) => {
    const {id, ...params} = getQuery(event);

    try{
        return (await axios.get(`${API_BASE}/episode/register/episodeid/${id}`, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
}))

export default useBase('/api/anime', router.handler)