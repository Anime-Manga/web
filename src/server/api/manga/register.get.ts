import {createError, defineEventHandler, getQuery} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const {id} = getQuery(event)
    const response = await fetch(`${API_BASE}/chapter/register/chapterid/${id}`, {method: 'get'});
    let data = await response.json();

    if (response.ok)
        return data;
    else
        throw createError({statusCode: data.status, statusMessage: data.title})
})