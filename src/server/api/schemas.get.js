import {defineEventHandler} from "h3";
import axios from "axios";

const runtimeConfig = useRuntimeConfig();
const API_BASE = runtimeConfig.apiBase;

export default defineEventHandler(async () => {

    try{
        return (await axios.get(`${API_BASE}/cfg`)).data;
    }catch(err){
        throw createError({ statusCode: err.response.status, statusMessage: err.response.statusText })
    }
})