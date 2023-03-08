import {createError, defineEventHandler, getQuery} from "h3";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    try {
        const {search} = getQuery(event)
        const {data} = await axios.get(`${API_BASE}/manga/list/name/${search}`);
        return data;
    }catch (error)
    {
        throw createError({ statusCode: error.response.data.status, statusMessage: error.response.data.title})
    }
})