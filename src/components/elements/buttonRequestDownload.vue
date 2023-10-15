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
    url:{
        type: String
    },
    nameCfg:{
        type: String
    },
    type: String
})

const { url, nameCfg, type } = toRefs(props);

const btnDisabled = ref(false);
const loading = ref(true);

const { requestDownloadContent, findQueue, apiAsync } = useApi();

async function checkQueue(){
    loading.value = true;
    await apiAsync(
        findQueue({
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
            url: url.value,
            nameCfg: nameCfg.value
        }, type.value),
        () => btnDisabled.value = true
    )
}

onMounted(() => checkQueue());
</script>