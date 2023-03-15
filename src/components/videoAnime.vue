<template>
  <div
      class="d-flex flex-column align-center"
  >
    <v-btn
        style="color: white !important;"
        color="info"
        class="ma-1"
        @click="close()"
    >
      Go to Home
    </v-btn>
    <div class="contain-video">
      <video id="my-video" controls>
        <template v-if="episode != null && data != null">
          <source :src="getUrl(data.episodePath)" type="video/mp4">
        </template>
      </video>
    </div>
    <div
        class="ma-2"
    >
        <span v-if="!isNil(idRoom)" class="link-share">
          <v-icon
              class="mr-3"
          >
            $share
          </v-icon>
          {{ `${hostWeb}/room?idroom=${idRoom}&type=anime` }}
        </span>
    </div>

    <div class="d-flex justify-center" style="width: 100%">
      <div v-for="(user, index) in users" class="ma-3">
        <userSession :nickname="user.nickname" :root="index === 0" :currentUser="currentUser"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import mitt from "mitt";
import pkg from 'websocket';
const {w3cwebsocket} = pkg;

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const {getRegister} = useApi();
const {isNil} = useLodash();

const hostSocket = ref(runtimeConfig.public.socketBase);
const hostHTTP = ref(runtimeConfig.public.httpBase);
const hostWeb = ref(runtimeConfig.public.webBase);
const basePath = ref(runtimeConfig.public.basePath);
const hide = ref("");
const data = ref(null);
const ws = ref(null);
const idRoom = ref(null);
const root = ref(null);
const currentUser = ref(null);
const users = ref(null);
const episode = ref(null);
const pause = ref(null);
const time = ref(0);
const room = ref(null);
const type = ref(null);

onMounted(() => {
  room.value = mitt();
  console.log("Starting connection to WebSocket Server");

  ws.value = new w3cwebsocket(hostSocket.value);

  //sockets
  ws.value.onopen = function () {
    console.log("Successfully connected to the echo WebSocket Server");
    console.log(ws.value)
    room.value.emit('checkRoom');
  };
  ws.value.onmessage = function (event) {
    console.log(event);
    room.value.emit('socket-message', event);
  }
  room.value.on('socket-message', (event) => {
    console.log("Un messaggio arrivato: ");
    console.log(event.data)
    var data = JSON.parse(event.data)
    if (data.action === 'registration') {
      root.value = data.nickname
      episode.value = route.query.episode;
      getVideoEpisode();

    } else if (data.action === 'UpdateRoom') {
      idRoom.value = data.room.id_room
      users.value = data.room.clients
      time.value = data.room.t
      pause.value = data.room.pause
    } else if (data.action === 'loadVideo') {
      idRoom.value = data.id
      root.value = data.nickname
      episode.value = data.episode
    } else if (data.action === 'currentTime') {
      room.value.emit('currentTime')
    }
  });
  room.value.on('checkRoom', () => {
    console.log('check')
    console.log(ws.value)
    if (route.query.idroom == null)
      room.value.emit('createRoom');
    else
      room.value.emit('joinRoom');
  });
  room.value.on('createRoom', () => {
    currentUser.value = new Date().getUTCMilliseconds().toString();
    const data = {nickname: currentUser.value, episode: route.query.episode};
    ws.value.send(JSON.stringify({action: 'create', data}))
    console.log('request registration');
  });
  room.value.on('joinRoom', () => {
    currentUser.value = new Date().getUTCMilliseconds().toString();
    sendMessage('join', {nickname: currentUser.value, idRoom: route.query.idroom})
    console.log('request join');
  });
  room.value.on('pause', (statePause) => {
    sendMessage('updatePause', {pause: statePause, idRoom: idRoom.value})
    console.log('request updatePause');
  });
  room.value.on('time', (stateTime) => {
    sendMessage('updateTime', {time: stateTime, idRoom: idRoom.value})
    console.log('request updatePause');
  });
  room.value.on('currentTime', () => {
    let vid = document.getElementById("my-video");
    sendMessage('currentTime', {time: vid.currentTime, idRoom: idRoom.value})
    console.log('request currentTime');
  });

  //event
  let vid = document.getElementById("my-video");
  vid.addEventListener("canplaythrough", () => {
    console.log('canplaythrough');
    let vid = document.getElementById("my-video");
    if (vid.currentTime > 0)
      room.value.emit('time', vid.currentTime);
  });
  vid.addEventListener("pause", () => {
    room.value.emit('pause', true);
  });
  vid.addEventListener("playing", () => {
    room.value.emit('pause', false);
  });
})

watch(episode, () => {
  getVideoEpisode(episode.value);
});

watch(time, () => {
  var vid = document.getElementById("my-video");
  vid.currentTime = time.value
})

watch(pause, () => {
  let vid = document.getElementById("my-video");
  if (pause.value === true) {
    vid.pause();
  } else if (pause.value === false) {
    try {
      vid.play();
    } catch {
      vid.muted = true;
      vid.play();
    }
  }
})

function sendMessage(setAction, data) {
  console.log(ws.value);
  ws.value.send(JSON.stringify({action: setAction, data}))
}

function getUrl(url) {
  if (url.includes(':')) {
    url = url.replace(/\\/g, '\\\\');
  }
  url = url.replace(basePath.value, '')
  return `${hostHTTP.value}/${url}`;
}

async function getVideoEpisode() {
  //get api internal
  data.value = await getRegister('video', episode.value);
}

function close() {
  ws.value.close();
  console.log('Closed WebSocket')
  ws.value = null;
  router.push('/')
}
</script>

<style lang="scss" scoped>
.contain-video{
  width: 70%;
}
.link-share {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
}

#my-video {
  width: 100%;
  height: auto;
}
</style>