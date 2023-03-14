import {defineEventHandler} from "h3";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    let result = await $fetch(`${API_BASE}/cfg`, {method: 'get'});
    return result;
    
})