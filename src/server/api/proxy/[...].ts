export default defineEventHandler(async event => {
    const url = getRequestURL(event);
    const path = url.pathname.replace("/api/proxy/", "") + url.search;
    

    return await proxyRequest(event, `${useRuntimeConfig().urlApi}${path}`)
})