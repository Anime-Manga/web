import {defineEventHandler, getQuery} from "h3";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async (event) => {
    const {search} = getQuery(event)
    return await $fetch(`${API_BASE}/manga/list/name/${search}`, {method: 'get'});
})