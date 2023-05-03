<template>
  <v-timeline 
    v-if="!isNil(contents)"
    side="end"
    align="start" 
    id="timeline-download"
  >
    <v-timeline-item
      v-for="content in contents"
      :dot-color="!isNil(foundMedia) && content.id < foundMedia.id? '#90cbd3' : getState(content.stateDownload)"
      :icon="!isNil(foundMedia) && content.id < foundMedia.id? '$check' : ''"
      icon-color="white"
    >
      <template v-slot:opposite v-if="!isNil(foundMedia) && content.id === foundMedia.id">
        <v-btn
            color="primary"
            block
            width="80"
            class="custom-btn"
            @click="navigateTo(getPath())"
            :disabled="disabled || isNil(foundProgress)"
          >
          <div style="min-width: 100px;">
            <template v-if="isNil(foundProgress)">
              You aren't logged
            </template>
            <template v-else-if="disabled">
              <span>It is still downloading</span>
            </template>
            <template v-else>
              {{ foundProgress? 'resume' : 'start' }}
            </template>
          </div>
        </v-btn>
      </template>
      <span
        :id="content.id"
      >
        {{ content.id }}
      </span>
    </v-timeline-item>
  </v-timeline>
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

watch(foundMedia, (newVal, oldVal) => {

  if(isNil(oldVal) || newVal.id !== oldVal.id){
    var contentId = document.getElementById(foundMedia.value.id);

    contentId.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}, {deep: true})

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

function getState(state){
  switch(state){
    case 'completed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
      return 'error';
    default:
      return 'info';
  }
}
</script>

<style lang="scss" scoped>
#timeline-download{
  max-height: 300px;
  overflow-y: auto;
}

.custom-btn{
  color: white !important;
}
</style>