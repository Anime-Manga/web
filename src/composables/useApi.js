export default function useApi(){
    const runtimeConfig = useRuntimeConfig()
    const API_BASE = runtimeConfig.public.apiBase;
    const TIMEOUT = 2000;

    function parse(value)
    {
        if(typeof value === 'string')
            return JSON.parse(value);

        return value;
    }

    //generic
    async function getCfg(){
        const result = await $fetch(`${API_BASE}/cfg`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function getAll(){
        const result = await $fetch(`${API_BASE}/all`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function searchDynamic(type, name, nameCfg){
        const result = await $fetch(`${API_BASE}/${type}/list/name/${name}?nameCfg=${nameCfg}`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function searchLocal(name){
        const result = await $fetch(`${API_BASE}/search?name=${name}`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }
    
    async function getByName(type, name, nameCfg){
        let result;

        if(type === 'video')
           result = await $fetch(`${API_BASE}/video/name/${name}?nameCfg=${nameCfg}`, {method: 'get', timeout: TIMEOUT});
        else
            result = await $fetch(`${API_BASE}/book/name/${name}?nameCfg=${nameCfg}`, {method: 'get', timeout: TIMEOUT});
        return parse(result);
    }

    async function downloadContent(type, url, nameCfg){
        let result, body = {
            url,
            nameCfg
        }

        if(type === 'video')
            result = await $fetch(`${API_BASE}/video/download`, {method: 'post', body: JSON.stringify(body), timeout: TIMEOUT});
        else
            result = await $fetch(`${API_BASE}/book/download`, {method: 'post', body: JSON.stringify(body), timeout: TIMEOUT});
        return parse(result);
    }

    async function reDownloadContent(type, name){
        let result;

        if(type === 'video')
            result = await $fetch(`${API_BASE}/video/redownload?name=${name}`, {method: 'put', timeout: TIMEOUT});
        else
            result = await $fetch(`${API_BASE}/book/redownload?name=${name}`, {method: 'put', timeout: TIMEOUT});
      return parse(result);
    }

    async function removeContent(type, name, nameCfg){
        let result;

        if(type === 'video')
            result = await $fetch(`${API_BASE}/video/${name}?nameCfg=${nameCfg}`, {method: 'delete', timeout: TIMEOUT});
        else
            result = await $fetch(`${API_BASE}/book/${name}?nameCfg=${nameCfg}`, {method: 'delete', timeout: TIMEOUT});
      return parse(result);
    }

    async function getStatus(type, name){
        let result;

        if(type === 'video')
            result = await $fetch(`${API_BASE}/episode/name/${name}`, {method: 'get', timeout: TIMEOUT});
        else
            result = await $fetch(`${API_BASE}/chapter/name/${name}`, {method: 'get', timeout: TIMEOUT});
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
        getStatus
    }
}