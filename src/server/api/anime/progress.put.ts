import {defineEventHandler} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return await $fetch(`${API_BASE}/episode/progress`, {method: 'put', body});
})