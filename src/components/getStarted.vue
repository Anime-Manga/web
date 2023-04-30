<template>
    <div>
          <v-btn
          v-if="!isNil(contents)"
            color="primary"
            block
            class="custom-btn"
            @click="navigateTo(getPath())"
            :disabled="disabled || isNil(foundProgress)"
          >
          <div style="min-width: 100px;">
            <template v-if="isNil(foundMedia)">
              <v-progress-circular
                indeterminate
              />
            </template>
            <template v-else-if="isNil(foundProgress)">
              You aren't logged
            </template>
            <template v-else-if="disabled">
              <span>Now is disabled because {{ nameBtn }} is still downloading</span>
            </template>
            <template v-else>
              {{ foundProgress? 'resume' : 'start' }} by <b>{{ nameBtn }}</b>
            </template>
          </div>
          </v-btn>
    </div>
</template>

<script setup>
const props = defineProps({
  item:{
    type: Object,
    required: true
  },
  contents:{
    type: Array
  }
})
const {item, contents} = toRefs(props);

//user
const {data: account, status} = useSession();

//api
const {getProgress} = useApi();

const progressTracker = ref(null);
const foundProgress = ref(null);
const foundMedia = ref(null);
const nameBtn = ref(null);
const disabled = ref(false);

watch(contents, async () => {

  if(isNil(foundProgress.value))
    await setProgress();

  if(!isNil(contents.value))
  {
    if(!isNil(foundProgress.value) && foundProgress.value === true)
    {
      const found = contents.value.filter((content) => {
        if(item.value.type === 'video')
          return content.id === progressTracker.value.nameEpisode
        else
          return content.id === progressTracker.value.nameChapter
      })
      foundMedia.value = found[0];
    }else{
      foundMedia.value = contents.value[0]
    }

    disabled.value = foundMedia.value.stateDownload !== 'completed';
    setName();
  }
})

async function setProgress(){
  if(status.value === 'authenticated' && isNil(item.value.urlPageDownload))
  {
    try{
      progressTracker.value = await getProgress(item.value.type, item.value.name_id, account.value.user.name, item.value.nameCfg);
      foundProgress.value = true;
    }catch(err){
      if(err.response.status === 404)
        foundProgress.value = false;
    }
  }
}

function getPath(){
  if(item.value.type === 'video')
  {
    return `/room?type=anime&episode=${foundMedia.value.id}&nameCfg=${item.value.nameCfg}&name=${item.value.name_id}`;
  }
  else
  {
    return `/room?type=manga&chapter=${foundMedia.value.id}&nameCfg=${item.value.nameCfg}&name=${item.value.name_id}`;
  }
}

function setName(){
    if(item.value.type === 'video')
    {
      nameBtn.value = `${foundMedia.value.videoId} Season:${foundMedia.value.numberSeasonCurrent} Episode:${foundMedia.value.numberEpisodeCurrent}`;
    }
    else
    {
      nameBtn.value = `${foundMedia.value.nameManga} Volume:${foundMedia.value.currentVolume} Chapter:${foundMedia.value.currentChapter}`;
    }
}
</script>

<style lang="scss" scoped>
.custom-btn{
  color: white !important;
}
</style>