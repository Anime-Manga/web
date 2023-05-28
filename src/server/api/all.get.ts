import {defineEventHandler, getQuery} from "h3";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    return await $fetch(`${API_BASE}/all`, {query: query, method: 'get'});
})