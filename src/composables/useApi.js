import axios from "axios";

export default function useApi() {
    const { $emit } = useNuxtApp();

    const TIMEOUT = 60000;

    async function apiAsync(
        functionApi,
        functionThen = null,
        functionCatch = null,
        functionFinally = null,
        schemaStatusHttp = null,
        noNotify = false,
        returnAllObject = false
    ) {
        let rs;
        try {
            rs = await functionApi;

            if (!isNil(functionThen)) {
                if (returnAllObject)
                    await functionThen(rs);
                else
                    await functionThen(rs.data);
            }

            if (!isNil(schemaStatusHttp) && useHas(schemaStatusHttp, 200))
                $emit('api:success', schemaStatusHttp[200]);
        } catch (err) {
            const message = err.response?.data?.message ? err.response.data.message : err.message;
            const code = err.response?.status || 'unknow';

            /*if (err.response?.status === 401 && err.response?.statusText === 'express_session')
              app.store.$auth.logout();*/

            console.log('[UTILS API]: ' + message);
            if (!isNil(functionCatch))
                await functionCatch(err);

            if (noNotify === false) {
                if (!isNil(schemaStatusHttp) && useHas(schemaStatusHttp, code))
                    $emit('api:error', schemaStatusHttp[code]);
                else
                    $emit('api:error', message);
            }
        } finally {
            if (!isNil(functionFinally))
                await functionFinally(rs);
        }

        return rs;
    }

    //generic
    async function getCfg() {
        return await axios.get(`/api/schemas`, { timeout: TIMEOUT });
    }

    async function getAll(params) {
        return await axios.get(`/api/all`, { params, timeout: TIMEOUT });
    }

    async function getAllWatchList(params) {
        return await axios.get(`/api/search-watchlist`, { params, timeout: TIMEOUT });
    }

    async function searchDynamic(params) {
        return await axios.get(`/api/search-dynamic`, { params, timeout: TIMEOUT });
    }

    async function searchLocal(params) {
        return await axios.get(`/api/search-local`, { params, timeout: TIMEOUT });
    }

    async function getByName(params, type) {
        if (type === 'video')
            return await axios.get(`/api/anime/get`, { params, timeout: TIMEOUT });
        else
            return await axios.get(`/api/manga/get`, { params, timeout: TIMEOUT });
    }
    
    async function findQueue(params, type) {
        if (type === 'video')
            return await axios.get(`/api/anime/queue`, { params, timeout: TIMEOUT });
        else
            return await axios.get(`/api/manga/queue`, { params, timeout: TIMEOUT });
    }
    
    async function getAllQueue(params, type) {
        if (type === 'video')
            return await axios.get(`/api/anime/all-queue`, { params, timeout: TIMEOUT });
        else
            return await axios.get(`/api/manga/all-queue`, { params, timeout: TIMEOUT });
    }

    async function removeQueue(params, data, type) {
        if (type === 'video')
            return await axios.delete(`/api/anime/queue`, { params, data, timeout: TIMEOUT });
        else
            return await axios.delete(`/api/manga/queue`, { params, data, timeout: TIMEOUT });
    }

    async function requestDownloadContent(params, data, type) {
        if (type === 'video')
            return await axios.put(`/api/anime/request-queue`, data, { params, timeout: TIMEOUT });
        else
            return await axios.put(`/api/manga/request-queue`, data, { params, timeout: TIMEOUT });
    }

    async function downloadContent(params, data, type) {
        if (type === 'video')
            return await axios.post(`/api/anime/download`, data, { params, timeout: TIMEOUT });
        else
            return await axios.post(`/api/manga/download`, data, { params, timeout: TIMEOUT });
    }

    async function reDownloadContent(params, data, type) {
        if (type === 'video')
            return await axios.put(`/api/anime/redownload`, data, { params, timeout: TIMEOUT });
        else
            return await axios.put(`/api/manga/redownload`, data, { params, timeout: TIMEOUT });
    }

    async function removeContent(params, data, type) {
        if (type === 'video')
            return await axios.delete(`/api/anime/delete`, { params, data, timeout: TIMEOUT });
        else
            return await axios.delete(`/api/manga/delete`, { params, data, timeout: TIMEOUT });
    }

    async function getStatus(params, type) {
        if (type === 'video')
            return await axios.get(`/api/anime/episode`, { params, timeout: TIMEOUT });
        else
            return await axios.get(`/api/manga/chapter`, { params, timeout: TIMEOUT });
    }

    async function getProgress(params, type) {
        if (type === 'video')
            return await axios.get(`/api/anime/progress`, { params, timeout: TIMEOUT });
        else
            return await axios.get(`/api/manga/progress`, { params, timeout: TIMEOUT });
    }

    async function saveProgress(params, data, type) {
        if (type === 'video')
            return await axios.put(`/api/anime/progress`, data, { params, timeout: TIMEOUT });
        else
            return await axios.put(`/api/manga/progress`, data, { params, timeout: TIMEOUT });
    }


    //account
    async function login(data) {
        return await axios.post(`/api/account/login`, data, { timeout: TIMEOUT });
    }

    async function getRegister(params, type) {
        if (type === 'video')
            return await axios.get(`/api/anime/register`, { params, timeout: TIMEOUT });
        else
            return await axios.get(`/api/manga/register`, { params, timeout: TIMEOUT });
    }

    async function registerAccount(params, data) {
        return await axios.post(`/api/account/register`, data, { params, timeout: TIMEOUT });
    }

    //watchlist
    async function addWatchList(params, data) {
        return await axios.post(`/api/account/watchlist`, data, { params, timeout: TIMEOUT });
    }

    async function removeWatchList(params, data) {
        return await axios.delete(`/api/account/watchlist`, { params, data, timeout: TIMEOUT });
    }

    return {
        apiAsync,
        getAll,
        getCfg,
        searchDynamic,
        searchLocal,
        getByName,
        downloadContent,
        findQueue,
        requestDownloadContent,
        getAllQueue,
        removeQueue,
        reDownloadContent,
        removeContent,
        getStatus,
        getRegister,
        registerAccount,
        getAllWatchList,
        addWatchList,
        removeWatchList,
        getProgress,
        saveProgress,
        login
    }
}