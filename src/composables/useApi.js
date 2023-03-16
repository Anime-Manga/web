export default function useApi(){
    const TIMEOUT = 2000;

    function parse(value)
    {
        if(typeof value === 'string')
            return JSON.parse(value);

        return value;
    }

    //generic
    async function getCfg(){
        const result = await $fetch(`/api/schemas`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function getAll(){
        const result = await $fetch(`/api/all`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function searchDynamic(type, name, nameCfg){
        const result = await $fetch(`/api/search-dynamic`, {query: {type, name, nameCfg}, method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function searchLocal(name){
        const result = await $fetch(`/api/search-local`, {query: {name}, method: 'get', timeout: TIMEOUT});
        return parse(result);
    }
    
    async function getByName(type, name, nameCfg){
        let result;

        if(type === 'video')
           result = await $fetch(`/api/anime/get`, {query:{name, nameCfg}, method: 'get', timeout: TIMEOUT});
        else
            result = await $fetch(`/api/manga/get`, {query:{name, nameCfg}, method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function downloadContent(type, url, nameCfg){
        let result, body = {
            url,
            nameCfg
        }

        if(type === 'video')
            result = await $fetch(`/api/anime/download`, {method: 'post', body: JSON.stringify(body), timeout: TIMEOUT});
        else
            result = await $fetch(`/api/manga/download`, {method: 'post', body: JSON.stringify(body), timeout: TIMEOUT});
        return parse(result);
    }

    async function reDownloadContent(type, name){
        let result;

        if(type === 'video')
            result = await $fetch(`/api/anime/redownload`, {query:{name}, method: 'put', timeout: TIMEOUT});
        else
            result = await $fetch(`/api/manga/redownload`, {query:{name}, method: 'put', timeout: TIMEOUT});
      return parse(result);
    }

    async function removeContent(type, name, nameCfg){
        let result;

        if(type === 'video')
            result = await $fetch(`/api/anime/delete`, {query:{name, nameCfg}, method: 'delete', timeout: TIMEOUT});
        else
            result = await $fetch(`/api/manga/delete`, {query:{name, nameCfg}, method: 'delete', timeout: TIMEOUT});
      return parse(result);
    }

    async function getStatus(type, name){
        let result;

        if(type === 'video')
            result = await $fetch(`/api/anime/episode`, {query:{name}, method: 'get', timeout: TIMEOUT});
        else
            result = await $fetch(`/api/manga/chapter`, {query:{name}, method: 'get', timeout: TIMEOUT});
      return parse(result);
    }

    async function getRegister(type, id){
        let result;

        if(type === 'video')
            result = await $fetch(`/api/anime/register`, {query:{id},method: 'get', timeout: TIMEOUT});
        else
            result = await $fetch(`/api/manga/register`, {query:{id},method: 'get', timeout: TIMEOUT});
      return parse(result);
    }
    
    return{
        getAll,
        getCfg,
        searchDynamic,
        searchLocal,
        getByName,
        downloadContent,
        reDownloadContent,
        removeContent,
        getStatus,
        getRegister
    }
}