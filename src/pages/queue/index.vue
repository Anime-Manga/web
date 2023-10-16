<template>
    <div class="pa-10">
        <div class="mb-10">
            <v-table
                fixed-header
                height="300px"
            >
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Url
                        </th>
                        <th class="text-left">
                            Configuration
                        </th>
                        <th class="text-center">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in listQueueAnime"
                        :key="item.name"
                    >
                        <td>{{ item.name }}</td>
                        <td>{{ item.url }}</td>
                        <td>{{ item.nameCfg }}</td>
                        <td class="text-center">
                            <ButtonLoading
                                color="success"
                                :action="() => accept(item.url, item.nameCfg, 'video')"
                                icon="$approve"
                                class="mr-1"
                            />
                            <ButtonLoading
                                color="error"
                                :action="() => reject(item.name, item.url, item.nameCfg, 'video')"
                                icon="$x"
                                class="mr-1"
                            />
                            <ButtonLoading
                                color="black"
                                icon="$blacklist"
                                :action="() => addToBlackList(item.name, item.url, item.nameCfg, 'video')"
                            />
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
        <div>
            <v-table
                fixed-header
                height="300px"
            >
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Url
                        </th>
                        <th class="text-left">
                            Configuration
                        </th>
                        <th class="text-center">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in listQueueManga"
                        :key="item.name"
                    >
                        <td>{{ item.name }}</td>
                        <td>{{ item.url }}</td>
                        <td>{{ item.nameCfg }}</td>
                        <td class="text-center">
                            <ButtonLoading
                                color="success"
                                :action="() => accept(item.url, item.nameCfg, 'book')"
                                icon="$approve"
                                class="mr-1"
                            />
                            <ButtonLoading
                                color="error"
                                :action="() => reject(item.name, item.url, item.nameCfg, 'book')"
                                icon="$x"
                                class="mr-1"
                            />
                            <ButtonLoading
                                color="black"
                                icon="$blacklist"
                                :action="() => addToBlackList(item.name, item.url, item.nameCfg, 'book')"
                            />
                        </td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </div>
</template>

<script setup>
import { isNil } from 'lodash';

const store = useStore();
const {apiAsync, getAllQueue, downloadContent, removeQueue, blackList} = useApi();

const listQueueAnime = ref([]);
const listQueueManga = ref([]);
const username = ref();
const time = ref();
const token = ref();

watch(time, async () => {
    await apiAsync(
        getAllQueue(null, 'book'),
        (data) => listQueueManga.value = data,
        () => listQueueManga.value = [],
        null,
        null,
        true
    )
    
    await apiAsync(
        getAllQueue(null, 'video'),
        (data) => listQueueAnime.value = data,
        () => listQueueAnime.value = [],
        null,
        null,
        true
    )

    clearTimeout(token.value);
    token.value = setTimeout(() => time.value = Date.now(), 2000);
}, {immediate: true});

onBeforeMount(() => {
    const {username: newUsername} = store.getUser;
    if(isNil(newUsername))
        navigateTo('/');

    username.value = newUsername;
})

async function accept(url, nameCfg, type){
    await apiAsync(
        downloadContent({
            username: username.value
        },{
            url,
            nameCfg
        }, type),
        () => time.value = Date.now()
    )
}

async function reject(name, url, nameCfg, type){
    await apiAsync(
        removeQueue(null, {
            name,
            nameCfg,
            url
        }, type),
        () => time.value = Date.now()
    )
}

async function addToBlackList(name, url, nameCfg, type){
    await apiAsync(
        blackList(null, {
            name,
            nameCfg,
            url
        }, type),
        () => time.value = Date.now()
    )
}
</script>

<style lang="scss" scoped>

</style>