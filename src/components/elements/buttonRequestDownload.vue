<template>
    <ButtonLoading
        :action="sendRequestQueue"
        :disabled="btnDisabled"
        :color="btnDisabled? 'primary' : 'warning'"
        :loadingExternal="loading"
        :icon="btnDisabled? '$hourglass' : '$request'"
    />
</template>

<script setup>
const props = defineProps({
    name:{
        type: String
    },
    url:{
        type: String
    },
    nameCfg:{
        type: String
    },
    type: String
})

const { name, url, nameCfg, type } = toRefs(props);

const btnDisabled = ref(false);
const loading = ref(true);

const { requestDownloadContent, findQueue, apiAsync } = useApi();

async function checkQueue(){
    loading.value = true;
    await apiAsync(
        findQueue({
            name: name.value,
            url: url.value,
            nameCfg: nameCfg.value
        }, type.value),
        () => btnDisabled.value = true,
        null,
        null,
        null,
        true
    )
    loading.value = false;
}

async function sendRequestQueue(){
    await apiAsync(
        requestDownloadContent(null, {
            name: name.value,
            url: url.value,
            nameCfg: nameCfg.value
        }, type.value),
        () => btnDisabled.value = true,
        null,
        null,
        {
            200: 'The request has been sent! Please wait a few moments, thanks'
        }
    )
}

onMounted(() => checkQueue());
</script>