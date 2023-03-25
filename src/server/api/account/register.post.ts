import {defineEventHandler, readBody} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(body)
    return await $fetch(`${API_BASE}/auth/register`, {method: 'post', body: body});
})