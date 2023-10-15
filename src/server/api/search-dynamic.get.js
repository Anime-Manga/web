import {defineEventHandler, getQuery} from "h3";
import axios from "axios";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async (event) => {
    const {name, type, ...params} = getQuery(event)

    try{
        return (await axios.get(`${API_BASE}/${type}/list/name/${name}`, {params})).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
})