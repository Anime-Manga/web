import {defineEventHandler, getQuery} from "h3";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async (event) => {
    const {name, nameCfg, type} = getQuery(event)
    return await $fetch(`${API_BASE}/${type}/list/name/${name}?nameCfg=${nameCfg}`, {method: 'get'});
})