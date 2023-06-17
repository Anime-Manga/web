<template>
  <div class="d-flex flex-column align-center">
    <div class="contain-video">
      <video id="my-video" controls>
        <template v-if="data != null">
          <source :src="getUrl(data.episodePath)" type="video/mp4">
        </template>
      </video>
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
        <v-btn color="warning" @click="startCoreWs()">
          Create room
        </v-btn>
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
const store = useStore();

const runtimeConfig = useRuntimeConfig();

const route = useRoute();
const router = useRouter();

const { getRegister, getStatus, getProgress, saveProgress } = useApi();

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
const pause = ref(true);
const human = ref(true);
const time = ref(0);
const showMenu = ref(false);
const episodes = ref(null);
const notSaveProgress = ref(false);
const ignoreAlertRewriteProcess = ref(false);

const showCertificate = ref(false);
const actionCertificate = ref(null);

//dialog
const activeModal = ref("");

onMounted(async () => {
  let vid = document.getElementById("my-video");

  vid.addEventListener('error', function(evt) {
    openDialogCertificate(hostHTTP.value);
  });

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

      vid.currentTime = time;
      vid.load();
    }
  }

  //event
  vid.addEventListener("canplaythrough", () => {
    let vid = document.getElementById("my-video");
    if (vid.currentTime > 0)
      room.value.emit('time', vid.currentTime);
  });
  vid.addEventListener("pause", () => {
    if(human.value === false){
      human.value = true;
      console.log('pausa ma non invio nulla');
      return;
    }
    
    room.value.emit('pause', true);
      console.log('pausa e invio');
  });
  vid.addEventListener("playing", () => {
    if(human.value === false){
      human.value = true;
      console.log('playing ma non invio nulla');
      return;
    }
    
    console.log('playing e invio');
    room.value.emit('pause', false);
  });
})

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

watch(time, () => {
  var vid = document.getElementById("my-video");
  vid.currentTime = time.value
})

watch(() => route.query.episode, async () => {
  await getProgressStatus();
  await getVideoEpisode();

  //restore
  notSaveProgress.value = false;

  console.log(startedWs, failedWs);
  if(getAdmin())
    room.value.emit('changeSource');

  
  let vid = document.getElementById("my-video");
  vid.src = getUrl(data.value.episodePath);
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
    let vid = document.getElementById("my-video");
    let currentSeconds = vid.currentTime;
    progress.value.hours = Math.floor(currentSeconds / 3600);
    currentSeconds -= progress.value.hours * 3600;

    progress.value.minutes = Math.floor(currentSeconds / 60);
    currentSeconds -= progress.value.minutes * 60;

    progress.value.seconds = Math.floor(currentSeconds);
    progress.value.nameEpisode = route.query.episode;

    progress.value = await saveProgress('video', progress.value)
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

        store.addNotify({
          message
        })
      }

      //update info general
      if(isNil(idRoom.value))
        idRoom.value = data.room.id_room
      
      users.value = data.room.clients
      time.value = data.room.t
      
      setPause(data.room.pause);

      
      if(isNil(episodes.value) && users.value[0].nickname === currentUser.value)
        getVideoEpisode();

      if(!isNil(data.room.episode) && route.query.episode !== data.room.episode)
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
  
  if (pause === true && vid.paused === false) {
    human.value = false;
    console.log('pausa!');
    vid.pause();
  } else if(pause === false && vid.paused === true){
    human.value = false;
    console.log('riprendi!');
    try {
      vid.play();
    } catch {
      vid.muted = true;
      vid.play();
    }
  }
}
function sendMessage(setAction, data) {
  console.log(ws.value);
  ws.value.send(JSON.stringify({ action: setAction, data }))
}

async function getVideoEpisode() {
  //get api internal
  data.value = await getRegister('video', route.query.episode);

  if (isNil(route.query.idroom) || getAdmin())
    episodes.value = await getStatus('video', route.query.name);
  
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
    try {
      progress.value = await getProgress('video', route.query.name, store.getUser?.username, route.query.nameCfg);
    } catch {
      progress.value = {
        nameCfg: route.query.nameCfg,
        name: route.query.name,
        nameEpisode: route.query.episode,
        username: store.getUser?.username,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
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
</script>

<style lang="scss" scoped>
.contain-video {
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