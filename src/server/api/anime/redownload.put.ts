import {defineEventHandler, getQuery} from "h3";
import axios from "axios";

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

export default defineEventHandler(async (event) => {
    const name = await getQuery(event);
    const {data} = await axios.put(`${API_BASE}/video/redownload?name=${name}`);
    return data;
})