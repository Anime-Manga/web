import {defineEventHandler, getQuery} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const query = await getQuery(event)
    return await $fetch(`${API_BASE}/all/watchlist`, {method: 'get', query});
})