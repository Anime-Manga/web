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
        <span v-if="!checkNull(idRoom)" class="link-share">
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

<script>
import {useRuntimeConfig} from "nuxt/app";
import mitt from "mitt";

import lodash from "../mixins/lodash";

import pkg from 'websocket';
const {w3cwebsocket} = pkg;

import userSession from "./userSession";
export default {
  name: "videoAnime",
  components:{
    userSession
  },
  mixins:[
    lodash
  ],
  data() {
    const runtimeConfig = useRuntimeConfig();

    return {
      hostSocket: runtimeConfig.public.socketBase,
      hostHTTP: runtimeConfig.public.httpBase,
      hostWeb: runtimeConfig.public.webBase,
      basePath: runtimeConfig.public.basePath,

      hide: "",
      data: null,

      ws: null,

      idRoom: null,
      root: null,
      currentUser: null,
      users: null,
      episode: null,
      pause: null,
      time: 0,
      room: null,
      type: null
    }
  },
  mounted() {
    this.room = mitt();

    console.log("Starting connection to WebSocket Server");
    this.ws = new w3cwebsocket(this.hostSocket);

    const _self = this;
    //sockets
    this.ws.onopen = function () {
      console.log("Successfully connected to the echo WebSocket Server");
      console.log(_self.ws)

      _self.room.emit('checkRoom');
    };

    this.ws.onmessage = function (event) {
      console.log(event);
      _self.room.emit('socket-message', event);
    }

    this.room.on('socket-message', (event) => {
      console.log("Un messaggio arrivato: ");
      console.log(event.data)

      var data = JSON.parse(event.data)
      if (data.action === 'registration') {
        this.root = data.nickname
        this.episode = this.$route.query.episode;
        this.getVideoEpisode()

      } else if (data.action === 'UpdateRoom') {
        this.idRoom = data.room.id_room
        this.users = data.room.clients
        this.time = data.room.t
        this.pause = data.room.pause

      } else if (data.action === 'loadVideo') {
        this.idRoom = data.id
        this.root = data.nickname
        this.episode = data.episode

      } else if (data.action === 'currentTime') {
        this.room.emit('currentTime')
      }
    });

    this.room.on('checkRoom', () => {
      console.log('check')
      console.log(_self.ws)

      if (this.$route.query.idroom == null)
        this.room.emit('createRoom');
      else
        this.room.emit('joinRoom');
    });

    this.room.on('createRoom', () => {
      this.currentUser = new Date().getUTCMilliseconds().toString();

      const data = {nickname: this.currentUser, episode: this.$route.query.episode};

      this.ws.send(JSON.stringify({action: 'create', data}))
      console.log('request registration');
    });

    this.room.on('joinRoom', () => {
      this.currentUser = new Date().getUTCMilliseconds().toString();
      this.sendMessage('join', {nickname: this.currentUser, idRoom: this.$route.query.idroom})
      console.log('request join');
    });

    this.room.on('pause', (statePause) => {
      this.sendMessage('updatePause', {pause: statePause, idRoom: this.idRoom})
      console.log('request updatePause');
    });

    this.room.on('time', (stateTime) => {
      this.sendMessage('updateTime', {time: stateTime, idRoom: this.idRoom})
      console.log('request updatePause');
    });

    this.room.on('currentTime', () => {
      let vid = document.getElementById("my-video");

      this.sendMessage('currentTime', {time: vid.currentTime, idRoom: this.idRoom})
      console.log('request currentTime');
    });

    //event
    let vid = document.getElementById("my-video");

    vid.addEventListener("canplaythrough", () => {

      console.log('canplaythrough');
      let vid = document.getElementById("my-video");

      if (vid.currentTime > 0)
        _self.room.emit('time', vid.currentTime);
    });
    vid.addEventListener("pause", () => {
      _self.room.emit('pause', true);
    });
    vid.addEventListener("playing", () => {
      _self.room.emit('pause', false);
    });
  },
  watch: {
    episode() {
      this.getVideoEpisode(this.episode);
    },
    time() {
      var vid = document.getElementById("my-video");
      vid.currentTime = this.time
    },
    pause() {
      let vid = document.getElementById("my-video");
      if (this.pause === true) {
        vid.pause();
      } else if (this.pause === false) {
        try {
          vid.play();
        } catch {
          vid.muted = true;
          vid.play();
        }
      }
    }
  },
  methods: {
    sendMessage(setAction, data) {
      console.log(this.ws);
      this.ws.send(JSON.stringify({action: setAction, data}))
    },
    getUrl(url) {

      if (url.includes(':')) {
        url = url.replace(/\\/g, '\\\\');
      }

      url = url.replace(this.basePath, '')

      return `${this.hostHTTP}/${url}`;
    },
    getVideoEpisode() {
      //get api internal
      fetch(`/api/anime/register?id=${this.episode}`, {method: 'get'})
          .then(async rs => {
            this.data = await rs.json()
          });
    },
    close() {
      this.ws.close();
      console.log('Closed WebSocket')

      this.ws = null;
      this.$router.push('/')
    }
  }
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