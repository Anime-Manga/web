import axios from "axios";

export default function useApi(){
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

            if (!isNil(functionThen)){
                if(returnAllObject)
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
    async function getCfg(){
        return await axios.get(`/api/schemas`, {timeout: TIMEOUT});
    }

    async function getAll(username = null){
        return await axios.get(`/api/all`, {params:{username}, timeout: TIMEOUT});
    }

    async function getAllWatchList(username){
        return await axios.get(`/api/search-watchlist`, {params: {username},timeout: TIMEOUT});
    }

    async function searchDynamic(type, name, nameCfg){
        return await axios.get(`/api/search-dynamic`, {params: {type, name, nameCfg}, timeout: TIMEOUT});
    }

    async function searchLocal(name, username = null){
        return await axios.get(`/api/search-local`, {params: {name, username}, timeout: TIMEOUT});
    }
    
    async function getByName(type, name, nameCfg){
        let result;

        if(type === 'video')
           return await axios.get(`/api/anime/get`, {params:{name, nameCfg}, timeout: TIMEOUT});
        else
            return await axios.get(`/api/manga/get`, {params:{name, nameCfg}, timeout: TIMEOUT});
    }

    async function downloadContent(type, url, nameCfg){
        let result, body = {
            url,
            nameCfg
        }

        if(type === 'video')
            return await axios.post(`/api/anime/download`, body, {timeout: TIMEOUT});
        else
            return await axios.post(`/api/manga/download`, body, {timeout: TIMEOUT});
    }

    async function reDownloadContent(type, name){
        let result;

        if(type === 'video')
            return await axios.put(`/api/anime/redownload`, null, {params:{name}, timeout: TIMEOUT});
        else
            return await axios.put(`/api/manga/redownload`, null, {params:{name}, timeout: TIMEOUT});
    }

    async function removeContent(type, name, nameCfg){
        let result;

        if(type === 'video')
            return await axios.delete(`/api/anime/delete`, {params:{name, nameCfg}, timeout: TIMEOUT});
        else
            return await axios.delete(`/api/manga/delete`, {params:{name, nameCfg}, timeout: TIMEOUT});
    }

    async function getStatus(type, name){
        let result;

        if(type === 'video')
            return await axios.get(`/api/anime/episode`, {params:{name}, timeout: TIMEOUT});
        else
            return await axios.get(`/api/manga/chapter`, {params:{name}, timeout: TIMEOUT});
    }

    async function getProgress(type, name, username, nameCfg){
        let result;

        if(type === 'video')
            return await axios.get(`/api/anime/progress`, {params:{name, username, nameCfg}, timeout: TIMEOUT});
        else
            return await axios.get(`/api/manga/progress`, {params:{name, username, nameCfg}, timeout: TIMEOUT});
    }

    async function saveProgress(type, body = null){
        let result;

        if(type === 'video')
            return await axios.put(`/api/anime/progress`, body, {timeout: TIMEOUT});
        else
            return await axios.put(`/api/manga/progress`, body, {timeout: TIMEOUT});
    }


    //account
    async function login(body){
        return await axios.post(`/api/account/login`, body, {timeout: TIMEOUT});
    }

    async function getRegister(type, id){
        let result;

        if(type === 'video')
            return await axios.get(`/api/anime/register`, {params:{id},timeout: TIMEOUT});
        else
            return await axios.get(`/api/manga/register`, {params:{id},timeout: TIMEOUT});
    }

    async function registerAccount(username, password){
        return await axios.post(`/api/account/register`, {username, password}, {timeout: TIMEOUT});
    }

    //watchlist
    async function addWatchList(username, name, nameCfg){
        return await axios.post(`/api/account/watchlist`, {username, name, nameCfg}, {timeout: TIMEOUT});
    }

    async function removeWatchList(username, name, nameCfg){
        return await axios.delete(`/api/account/watchlist`, {body: {username, name, nameCfg}, timeout: TIMEOUT});
    }
    
    return{
        apiAsync,
        getAll,
        getCfg,
        searchDynamic,
        searchLocal,
        getByName,
        downloadContent,
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