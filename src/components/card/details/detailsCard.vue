<template>
  <v-dialog
      v-model="activator"
      width="1000"
      persistent
      scrollable
  >
    <v-card>
      <v-card-item
        class="pa-2 secondary"
      >
        <v-btn
            color="primary"
            @click="close()"
            class="my-1 mr-1"
        >
          <v-icon
              color="white"
          >
            $arrowLeft
          </v-icon>
        </v-btn>
        <template
            v-if="!isNil(item.urlPageDownload)"
        >
          <template v-if="useGet(store.getUser, 'role', 0) === 100">
            <ButtonLoading
              :action="download"
              color="warning"
              icon="$download"
            />
          </template>
          <template v-else>
            <ButtonRequestDownload
              :url="item.urlPageDownload"
              :nameCfg="store.getSchemasBySelectSearch.nameCfg"
              :type="item.type"
            />
          </template>
        </template>
        <template v-else>
          <ButtonLoading
              :action="reDownload"
              color="warning"
              icon="$redownload"
              class="mr-1"
            />
          <ButtonLoading
              :action="remove"
              color="error"
              icon="$trash"
            />
          <template v-if="!isNil(store.getUser) || !isNil(item.watchList)">
            <ButtonLoading
                :action="() => setWatchList(item.watchList)"
                color="info ml-1"
                :icon="item.watchList? '$saved' : '$notSaved'"
              />
          </template>
        </template>
      </v-card-item>
      <v-card-item class="pa-2">
        <template v-if="error">
          <alert
              type="error"
              :text="error"
          />
        </template>
      </v-card-item>
      <v-card-title class="px-0">
        <v-img
            :src="item.image ?? item.cover"
            class="card-img-top rounded-top hide-img"
            height="100"
            cover
        >
        </v-img>
        <div class="card-title">
          {{ item.name ?? item.name_id }}
        </div>
      </v-card-title>
      <v-card-text>
        <descriptionDynamic
          :item="item"
        />
        <getStarted
          v-if="!isNil(store.getUser)"
          class="mt-2"
          :item="item"
          :contents="contents"
        />
        <statusDownload
          :item="item"
          :contents="contents"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup>
//store
const store = useStore();

//api
const {downloadContent, reDownloadContent, removeContent, addWatchList, removeWatchList, getStatus, apiAsync} = useApi();

const emit = defineEmits(['closeDialog','closeDialogAndUpdate','updateData']);

const props = defineProps({
  item:{
    type: Object,
    required: true
  }
})

const {item} = toRefs(props);

//variables
const activator = ref(true);
const isLoadingReDownload = ref(false);
const isLoadingDelete = ref(false);
const error = ref(null);
const date = ref(null);
const contents = ref(null);
const tokenStatus = ref();


watch(item, () => date.value = new Date());

watch(date, () => {
  if(isNil(item.value.urlPageDownload))
    {
      tokenStatus.value = setTimeout(async () => {
        await apiAsync(
          getStatus({
            name: item.value.name_id
          }, item.value.type),
          (data) => contents.value = data,
          null,
          () => date.value = new Date(),
          null,
          true
        );
      }, 1000);
    }
}, {immediate: true})

async function download(){
  let schema = store.getSchemasBySelectSearch;

  await apiAsync(
    downloadContent({
      username: store.getUser?.username
    },{
      url: item.value.urlPageDownload,
      nameCfg: schema.nameCfg
    }, item.value.type),
    (data) => emit('updateData', data),
    () => error.value = `Impossible send request for download this ${item.value.urlPageDownload}`,
  );
}

async function reDownload(){
  isLoadingReDownload.value = true;
  error.value = null;

  await apiAsync(
    reDownloadContent({
      name: item.value.name_id,
      username: store.getUser?.username
    }, null, item.value.type),
    null,
    () => error.value = `Impossible send request for re-download this ${item.value.urlPageDownload}`,
    () => isLoadingReDownload.value = false
  );
}

async function remove(){
  isLoadingDelete.value = true;
  error.value = null;

  await apiAsync(
    removeContent({
      name: item.value.name_id,
      nameCfg: item.value.nameCfg
    }, null, item.value.type),
    () => {
      clearTimeout(tokenStatus.value);
      closeAndUpdate();
    },
    () => error.value = `Impossible send request for remove this ${item.value.urlPageDownload}`,
    () => isLoadingDelete.value = false
  );
}

function closeAndUpdate(){
  emit('closeDialogAndUpdate');
}

function close(){
  emit('closeDialog');
}

async function setWatchList(state){
  let username = store.getUser?.username;
  if(state === true){
    await apiAsync(
      removeWatchList(null, {
        username,
        name: item.value.name_id,
        nameCfg: item.value.nameCfg
      })
    )
  }else{
    await apiAsync(
      addWatchList(null, {
        username,
        name: item.value.name_id,
        nameCfg: item.value.nameCfg
      })
    )
  }

  item.value.watchList = !state;
}
</script>

<style lang="scss" scoped>
.hide-img {
  -webkit-filter: blur(1.5px);
  -moz-filter: blur(1.5px);
  -o-filter: blur(1.5px);
  -ms-filter: blur(1.5px);
}

.card-title {
  overflow-wrap: break-word !important;
  position: relative;
  padding: 2px 5px;
  width: calc(100% - 30px);
  top: -65px;
  left: 15px;
  color: white;
  font-weight: bold;
  font-size: 30px;
  background-color: rgb(0, 0, 0, 0.7);
  box-shadow: 0px 0px 5px 7px rgba(0, 0, 0, 0.7);
}
</style>