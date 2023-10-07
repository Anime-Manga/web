import {defineEventHandler, getQuery} from "h3";
import axios from "axios";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async (event) => {
    const {search} = getQuery(event)

    try{
        return (await axios.get(`${API_BASE}/manga/list/name/${search}`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
})