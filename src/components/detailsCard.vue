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
          <v-btn
              color="warning"
              @click="download()"
          >
            <template
              v-if="isLoadingDownload"
            >
              <v-progress-circular
                  indeterminate
                  size="25"
              />
            </template>
            <template
              v-else
            >
              <v-icon>
                $download
              </v-icon>
            </template>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
              color="warning"
              class="mr-1"
              @click="reDownload()"
          >
            <template v-if="isLoadingReDownload">
              <v-progress-circular
                indeterminate
              />
            </template>
            <template
              v-else
            >
              <v-icon>
                $redownload
              </v-icon>
            </template>
          </v-btn>
          <v-btn
              color="error"
              @click="remove()"
          >
            <template v-if="isLoadingDelete">
              <v-progress-circular
                indeterminate
              />
            </template>
            <template v-else>
              <v-icon>
                $trash
              </v-icon>
            </template>
          </v-btn>
          <template v-if="!isNil(account?.user) || !isNil(item.watchList)">
            <v-btn
                color="info ml-1"
                @click="setWatchList(item.watchList)"
            >
              <v-icon>
                {{item.watchList? '$saved' : '$notSaved'}}
              </v-icon>
            </v-btn>
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
          v-if="status === 'authenticated'"
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
import {useStore} from "../store";
//store
const store = useStore();

//user
const {data: account, status} = useSession();

//api
const {downloadContent, reDownloadContent, removeContent, addWatchList, removeWatchList, getStatus} = useApi();

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
const isLoadingDownload = ref(false);
const isLoadingReDownload = ref(false);
const isLoadingDelete = ref(false);
const error = ref(null);
const date = ref(null);
const contents = ref(null);


watch(item, () => date.value = new Date());

watch(date, () => {
  if(isNil(item.value.urlPageDownload))
    {
      setTimeout(async () => {
        try{
          contents.value = await getStatus(item.value.type, item.value.name_id, item.value.nameCfg);
        }catch(err){
          console.log(err);
        }finally{
          date.value = new Date();
        }
      }, 1000);
    }
}, {immediate: true})


async function download(){
  isLoadingDownload.value = true;

  try{
    let schema = store.getSchemasBySelectSearch;

    let data = await downloadContent(item.value.type, item.value.urlPageDownload, schema.nameCfg);
    emit('updateData', data);
  }catch(err){
    console.log(err);
    error.value = `Impossible send request for download this ${item.value.urlPageDownload}`;
  }finally{
    isLoadingDownload.value = false;
  }
}

async function reDownload(){
  isLoadingReDownload.value = true;
  error.value = null;

  try{
    await reDownloadContent(item.value.type, item.value.name_id);
  }catch{
    error.value = `Impossible send request for re-download this ${item.value.urlPageDownload}`;
  }finally{
    isLoadingReDownload.value = false;
  }
}

async function remove(){
  isLoadingDelete.value = true;
  error.value = null;

  try{
    await removeContent(item.value.type, item.value.name_id, item.value.nameCfg);
    closeAndUpdate();
  }catch(err){
    console.log(err);
    error.value = `Impossible send request for remove this ${item.value.urlPageDownload}`;
  }finally{
    isLoadingDelete.value = false;
  }
}

function closeAndUpdate(){
  emit('closeDialogAndUpdate');
}

function close(){
  emit('closeDialog');
}

async function setWatchList(state){
  let username = account.value.user.name;
  try {
    if(state === true)
      await removeWatchList(username, item.value.name_id, item.value.nameCfg);
    else
      await addWatchList(username, item.value.name_id, item.value.nameCfg);

    item.value.watchList = !state;
  }catch{}
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