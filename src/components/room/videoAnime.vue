<template>
  <div class="d-flex flex-column align-center">
    <div id="contain-video" @mousemove="setShowControls()">
      <video id="my-video" :style="fullScreen? 'height: calc(100% - 75px);' : 'height: 35%;'">
        <template v-if="data != null">
          <source :src="getUrl(data.episodePath)" type="video/mp4">
        </template>
      </video>
      <div class="d-flex flex-column" v-if="showControls">
        <div class="d-flex flex-rows align-center">
          <span class="mr-2" style="color: white;">{{ currentPositionDurationLabel }}</span>
          <v-slider
            hide-details="true"
            color="white"
            v-bind:model-value="currentPositionDuration"
            @end="setCurrentPositionVideo($event, true, true)"
            :max="maxDuration"
          >
          </v-slider>
          <span class="ml-2" style="color: white;">{{ maxDurationLabel }}</span>
        </div>
        <div class="d-flex flex-row">
          <v-btn
            @click="setPlay()"
            class="mr-2"
          >
            <v-icon>
              <template v-if="!play">
                $play
              </template>
              <template v-else>
                $pause
              </template>
            </v-icon>
          </v-btn>
          <div style="max-width: 300px; width: 100%;">
            <v-slider
              hide-details="true"
              v-model="volume"
              color="white"
              step="0.01"
              max="1"
            >
              <template v-slot:prepend>
                <v-icon
                  @click="setMuted()"
                  color="white"
                >
                  <template v-if="!muted">
                    $speak
                  </template>
                  <template v-else>
                    $muted
                  </template>
                </v-icon>
              </template>
            </v-slider>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            class="ml-2"
            @click="setFullScreen()"
          >
            <v-icon>
              $fullVideo
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div class="ma-2">
      <toolTips
        v-if="!isNil(idRoom)"
        preicon="$share"
        label="Share"
        message="Done!"
        :action="copyLink()"
      />
    </div>

    <div class="d-flex justify-center" style="width: 100%">
      <template v-if="isNil(startedWs) || startedWs === false">
        <v-badge content="alpha" color="secondary">
          <v-btn color="warning" @click="startCoreWs()">
            Create room
          </v-btn>
        </v-badge>
      </template>
      <div v-else class="d-flex flex-wrap justify-center align-center">
        <div v-for="(user, index) in users" class="ma-3">
          <userSession :nickname="user.nickname" :root="index === 0" :currentUser="currentUser" />
        </div>
      </div>
    </div>
    <div class="menu" v-if="!isNil(startedWs) && (startedWs === true &&  !isNil(users) && users.length > 0 && users[0].nickname === currentUser || startedWs === false)">
      <div class="d-flex justify-center">
        <v-icon color="white" @click="showMenu = !showMenu" size="24">
          {{ showMenu ? '$arrowDown' : '$arrowUp' }}
        </v-icon>
      </div>
      <div v-if="showMenu">
        <div v-if="data" class="currentEpisode">
          Current Episopde: {{ data.episodeId }}
        </div>
        <div class="d-flex flex-row justify-space-around flex-wrap mb-2">
          <NuxtLink
            v-if="getPreviousEpisode"
            class="text-decoration-none"
            :to="`/room?type=anime&episode=${getPreviousEpisode}&nameCfg=${route.query.nameCfg}&name=${route.query.name}`"
          >
              <v-btn
                  color="primary"
              >
                <v-icon class="mr-2">
                  $arrowLeft
                </v-icon>
                Previous chapter
              </v-btn>
          </NuxtLink>

          <NuxtLink
            v-if="nextEpisode"
            :to="`/room?type=anime&episode=${nextEpisode}&nameCfg=${route.query.nameCfg}&name=${route.query.name}`"
            @click="ignoreAlertRewriteProcess = true"
            class="text-decoration-none"
          >
              <v-btn
                  color="secondary"
              >
                Next chapter
                <v-icon class="ml-2">
                  $arrowRight
                </v-icon>
              </v-btn>
          </NuxtLink>
        </div>
        <v-btn v-if="!isNil(store.getUser)" @click="saveStatusProgress()">
          Save Progress
        </v-btn>
      </div>
    </div>
  </div>
  <component
    :is="activeModal"
    :actual="data?.episodeId"
    :restore="progress?.nameEpisode"
    type="anime"
    @close="activeModal = ''"
    @confirmResume="resume()"
  />
  <notify />

  <FastDialog
    v-model="showCertificate"
    title="Problem certificate"
    text="Problem certificate, please accept it"
    textBtn="Open"
    :actionButton="actionCertificate"
  />
</template>

<script setup>
import {DateTime} from 'luxon';

const { $emit } = useNuxtApp()
const store = useStore();

const runtimeConfig = useRuntimeConfig();

const route = useRoute();
const router = useRouter();

const { getRegister, getStatus, getProgress, saveProgress, apiAsync } = useApi();

const { hostSocket, ws, room, started: startedWs, failed: failedWs, startWs, stopWs } = useWs();

const hostHTTP = ref(runtimeConfig.public.httpBase);
const hostWeb = ref(runtimeConfig.public.webBase);
const basePath = ref(runtimeConfig.public.basePath);

const progress = ref(null);
const data = ref(null);
const idRoom = ref(null);
const root = ref(null);
const currentUser = ref(null);
const users = ref(null);
const showMenu = ref(false);
const episodes = ref(null);
const notSaveProgress = ref(false);
const ignoreAlertRewriteProcess = ref(false);

//player
const play = ref(false);
const volume = ref(0.25);
const muted = ref(false);
const fullScreen = ref(false);
const showControls = ref(true);
const tokenShowControls = ref();
const currentPositionDuration = ref(0);
const maxDuration = ref(0);

const showCertificate = ref(false);
const actionCertificate = ref(null);

//dialog
const activeModal = ref("");

onMounted(async () => {
  let vid = document.getElementById("my-video");

  const {error} = await useFetch(hostHTTP.value, {method: 'get'})
  
  if(!isNil(error.value) && useGet(error.value, 'statusCode', 200) === 500){
    openDialogCertificate(hostHTTP.value);
  }

  window.addEventListener("beforeunload", leaving);
  window.addEventListener("pagehide", leaving);
  window.addEventListener("blur", leaving);

  if(!isNil(route.query.idroom))
    startCoreWs();
  else
  {
    //get
    await getProgressStatus();
    await getVideoEpisode();

    
    if (isNil(route.query.idroom) && !isNil(progress.value)) {
      let time = (progress.value.hours * 3600) + (progress.value.minutes * 60) + progress.value.seconds;

      setCurrentPositionVideo(time);
    }
  }
  vid.load();
  
  vid.addEventListener("timeupdate", () => {
    let vid = document.getElementById("my-video");
    
    if(play.value && vid.currentTime > currentPositionDuration.value )
      currentPositionDuration.value = vid.currentTime;

    maxDuration.value = vid.duration;
  });

  document.getElementById('contain-video').addEventListener('fullscreenchange', (event) => {
    setCloseFullScreen();
  });
  
  watch(() => route.query.episode, async () => {
    if(!isNil(route.query.episode)){
      await getProgressStatus();
      await getVideoEpisode();

      //restore
      notSaveProgress.value = false;

      console.log(startedWs, failedWs);
      if(getAdmin())
        room.value.emit('changeSource');

      
      let vid = document.getElementById("my-video");
      vid.src = getUrl(data.value.episodePath);
    }
  }, {immediate: true})
})

function setCurrentPositionVideo(time, reusume = false, broadcast = false){
  var vid = document.getElementById("my-video");
  vid.currentTime = time;
  currentPositionDuration.value = time;

  if(reusume){
    if(play.value)
      setPlay();
    setPlay();
  }
}

onBeforeRouteLeave(async () => {
  stopWs();
  await saveStatusProgress();
  
  window.removeEventListener("beforeunload", leaving);
  window.removeEventListener("pagehide", leaving);
  window.removeEventListener("blur", leaving);
})

//computed
const getPreviousEpisode = computed(() => {
  if (episodes.value.length <= 0)
    return null;

  const episodeId = data.value.episodeId;

  const index = episodes.value.findIndex(episode => episode.id === episodeId)

  if (index > 0)
    return episodes.value[index - 1].id
  return null;
})

const nextEpisode = computed(() => {
  if (episodes.value.length <= 0)
    return null;

  const episodeId = data.value.episodeId;

  const index = episodes.value.findIndex(episode => episode.id === episodeId)

  if ((index + 1) < episodes.value.length)
    return episodes.value[index + 1].id
  return null;
});

//watch
watch(failedWs, () => {
  if(failedWs.value === true){
    openDialogCertificate(hostSocket.value.replace('wss', 'https'));
  }
})

//functions
function openDialogCertificate(url){
    actionCertificate.value = () => {
      const target = window.open(url, '_blank');

      const token = setInterval(() => {
        if(target.closed === true){
          showCertificate.value = false;
          reloadNuxtApp();
          clearInterval(token);
        }
      }, 250);
    };
    showCertificate.value = true;
}

function getUrl(url) {
  if (url.includes(':')) {
    url = url.replace(/\\/g, '\\\\');
  }
  url = url.replace(basePath.value, '')
  return `${hostHTTP.value}/${url}`;
}

async function leaving() {
  await saveStatusProgress();
}

async function saveStatusProgress() {
  if (!isNil(store.getUser) && notSaveProgress.value === false) {
    let currentSeconds = currentPositionDuration.value;
    progress.value.hours = Math.floor(currentSeconds / 3600);
    currentSeconds -= progress.value.hours * 3600;

    progress.value.minutes = Math.floor(currentSeconds / 60);
    currentSeconds -= progress.value.minutes * 60;

    progress.value.seconds = Math.floor(currentSeconds);
    progress.value.nameEpisode = route.query.episode;

    await apiAsync(
      saveProgress(null, progress.value, 'video'),
      (data) => progress.value = data
    )
  }
}

function startCoreWs() {
  room.value.on('socket-message', (event) => {
    console.log("Un messaggio arrivato: ");
    console.log(event.data)
    var data = JSON.parse(event.data)
    if (data.action === 'registration') {
      root.value = data.nickname
    } else if (data.action === 'UpdateRoom') {

      //notify
      if(!isEmpty(data.message)){
        let message = 'unknow';
        if(data.message.type === 'updatePause')
          message = `${data.message.nickname} has set ${data.message.pause? 'paused' : 'started'} video`;
        else if(data.message.type === 'changeSource')
          message = `${data.message.nickname} has change episode`;

        $emit('api:message', {title: 'WS say', message});
      }

      //update info general
      if(isNil(idRoom.value))
        idRoom.value = data.room.id_room
      
      users.value = data.room.clients

      setCurrentPositionVideo(data.room.t);
      setPause(data.room.pause);

      
      if(isNil(episodes.value) && users.value[0].nickname === currentUser.value)
        getVideoEpisode();

      if(!isNil(data.room.episode) && (route.query.episode !== data.room.episode || isNil(route.query.episode)))
      {
        router.push({
          path: route.fullPath,
          query:{...route.query, episode: data.room.episode}
        })
      }
    } else if (data.action === 'loadVideo') {
      root.value = data.nickname

      router.push({
        path: route.fullPath,
        query:{...route.query, episode: data.episode}
      })
    } else if (data.action === 'currentTime') {
      room.value.emit('currentTime')
    }
  });

  room.value.on('checkRoom', () => {
    if (route.query.idroom == null)
      room.value.emit('createRoom');
    else
      room.value.emit('joinRoom');
  });

  room.value.on('createRoom', () => {
    currentUser.value = useGet(store.getUser, 'username', new Date().getUTCMilliseconds().toString());
    const data = { nickname: currentUser.value, episode: route.query.episode };
    ws.value.send(JSON.stringify({ action: 'create', data }))
    console.log('request registration');
  });

  room.value.on('joinRoom', () => {
    currentUser.value = useGet(store.getUser, 'username', new Date().getUTCMilliseconds().toString());
    sendMessage('join', { nickname: currentUser.value, idRoom: route.query.idroom })
    console.log('request join');
  });

  room.value.on('pause', (statePause) => {
    sendMessage('updatePause', { pause: statePause, idRoom: idRoom.value, nickname: currentUser.value})
    console.log('request updatePause');
  });

  room.value.on('time', (stateTime) => {
    sendMessage('updateTime', { time: stateTime, idRoom: idRoom.value})
    console.log('request updateTime');
  });

  room.value.on('currentTime', () => {
    let vid = document.getElementById("my-video");
    sendMessage('currentTime', { time: vid.currentTime, idRoom: idRoom.value })
    console.log('request currentTime');
  });

  room.value.on('changeSource', () => {
    const data = { episode: route.query.episode, idRoom: idRoom.value, nickname: currentUser.value };
    ws.value.send(JSON.stringify({ action: 'changeSource', data}))
    console.log('request change source');
  });

  startWs();
}

function setPause(pause){
  let vid = document.getElementById("my-video");
  
  if (pause === true) {
    play.value = false;
    vid.pause();
  } else {
    play.value = true;
    try {
      vid.play();
    } catch {
      setMuted();
      vid.play();
    }
  }
}

function sendMessage(setAction, data) {
  console.log(ws.value);
  ws.value.send(JSON.stringify({ action: setAction, data }))
}

async function getVideoEpisode() {
  
  await apiAsync(
    getRegister({
      id: route.query.episode
    }, 'video'),
    (rs) => data.value = rs
  );

  if (isNil(route.query.idroom) || getAdmin()){
    await apiAsync(
      getStatus({
        name: route.query.name
      }, 'video'),
      (data) => episodes.value = data,
      null,
      null,
      null,
      true
    )
  }
  
  if(!isNil(progress.value))
  {
    console.log(progress.value.nameEpisode, data.value.episodeId, ignoreAlertRewriteProcess.value);
    if(progress.value.nameEpisode !== data.value.episodeId && ignoreAlertRewriteProcess.value === false)
      activeModal.value = "rewriteProgressDialog";
    else
      ignoreAlertRewriteProcess.value = false;
  }
}

async function getProgressStatus() {
  if (!isNil(store.getUser)) {
    await apiAsync(
      getProgress({
        name: route.query.name,
        username: store.getUser?.username,
        nameCfg: route.query.nameCfg
      }, 'video'),
      (data) => progress.value = data,
      () => {
        progress.value = {
          nameCfg: route.query.nameCfg,
          name: route.query.name,
          nameEpisode: route.query.episode,
          username: store.getUser?.username,
          hours: 0,
          minutes: 0,
          seconds: 0
        }
      },
      null,
      null,
      true
    );
  }
}

function resume(){
  activeModal.value = '';
  notSaveProgress.value = true;
  router.push(`/room?type=anime&episode=${progress.value.nameEpisode}&nameCfg=${route.query.nameCfg}&name=${route.query.name}`)
}

function getAdmin(){
  if(!isNil(users.value) && users.value.length > 0 && users.value[0].nickname === currentUser.value && !isNil(startedWs) && startedWs.value === true && failedWs.value === false)
    return true;
  return false;
}

function copyLink(){
  try{
    navigator.clipboard.writeText(`${hostWeb.value}/room?idroom=${idRoom.value}&type=anime&name=${route.query.name}`);
  }catch(err){
    console.warn(err);
    console.log(`Copy by here please: ${hostWeb.value}/room?idroom=${idRoom.value}&type=anime&name=${route.query.name}`);
  }
}

//controls video
function setPlay(){
  let vid = document.getElementById("my-video");
  play.value = !play.value;

  if(!play.value){
    vid.pause();
    setTimeout(() => room.value.emit('time', vid.currentTime), 250);
  }else{
    vid.currentTime = currentPositionDuration.value;
    vid.play();
  }

  room.value.emit('pause', !play.value);
}

watch(volume, (val) => {
  let vid = document.getElementById("my-video");

  if(val === 0 && muted.value === false)
    muted.value = true;
  else if(muted.value === true)
    setMuted();

  vid.volume = val;
})

function setMuted(){
  let vid = document.getElementById("my-video");

  muted.value = !muted.value;
  vid.muted = muted.value;
}

function setFullScreen(){
  if(fullScreen.value === false){
    let vid = document.getElementById("contain-video");

    if (vid.requestFullscreen) {
      vid.requestFullscreen();
    } else if (vid.webkitRequestFullscreen) { /* Safari */
      vid.webkitRequestFullscreen();
    } else if (vid.msRequestFullscreen) { /* IE11 */
      vid.msRequestFullscreen();
    }
    
    fullScreen.value = true;
  }else{
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    fullScreen.value = false;
  }
}

function setShowControls(){
  clearTimeout(tokenShowControls.value);
  if(fullScreen.value === true){
    tokenShowControls.value = setTimeout(() => {
      showControls.value = false;
    }, 3000);
    showControls.value = true;
  }
}

function setCloseFullScreen(){
  clearTimeout(tokenShowControls.value);
  showControls.value = true;
}

const maxDurationLabel = computed(() => DateTime.fromSeconds(maxDuration.value, {zone: 'utc'}).toLocaleString(DateTime.TIME_24_WITH_SECONDS));
const currentPositionDurationLabel = computed(() => DateTime.fromSeconds(currentPositionDuration.value, {zone: 'utc'}).toLocaleString(DateTime.TIME_24_WITH_SECONDS));
</script>

<style lang="scss" scoped>
#contain-video {
  width: 70%;
}

#my-video {
  width: 100%;
  height: auto;
}

.menu {
  padding: 5px 10px 10px 10px;
  z-index: 1;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.5s;
  text-align: center;

  .currentEpisode {
    font-weight: bold;
    color: white;
  }

  &.active {
    bottom: 0;
  }
}
</style>