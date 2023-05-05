import {defineEventHandler} from "h3";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async (event) => {
    let result = await $fetch(`${API_BASE}/cfg`, {method: 'get'});
    return result;
    
})