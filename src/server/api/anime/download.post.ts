import {defineEventHandler, readBody} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const {url, nameCfg} = await readBody(event)
    return await $fetch(`${API_BASE}/video/download`, {method: 'post', body:{url, nameCfg}});
})