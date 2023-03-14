import {defineEventHandler, getQuery} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const {name, nameCfg} = getQuery(event)
    return await $fetch(`${API_BASE}/video/name/${name}?nameCfg=${nameCfg}`, {method: 'get'});
})