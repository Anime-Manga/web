<template>
  <div
      id="main"
      class="fill-height"
      style="width: 100%"
  >
    <div
        class="d-flex flex-column align-center"
    >
      <div
          v-if="type === 'anime'"
          class="ma-2"
      >
        <v-btn
            style="color: white !important;"
            color="info"
            class="ma-1"
            @click="close()"
        >
          Go to Home
        </v-btn>
        <video id="my-video" controls>
          <template v-if="episode != null && data != null">
            <source :src="getUrl(data.episodePath)" type="video/mp4">
          </template>
        </video>
      </div>
      <div
          v-if="type === 'manga' && !checkNull(data)"
          class="text-center d-flex flex-column fill-height justify-center"
      >
        <v-btn
            style="color: white !important;"
            color="info"
            class="mt-1"
            block
            @click="close()"
        >
          Go to Home
        </v-btn>
        <div id="my-manga">
          <div class="d-flex flex-row align-center justify-center">
            <div
                v-if="indexPage > 0 && (!modeMobile)"
                class="btn-page"
                @click="previousPage"
            >
              <v-icon>
                $arrowLeft
              </v-icon>
            </div>
            <template v-if="data">
              <template v-if="modeMobile">
                <div id="closeFullscreenMobile">
                  <v-icon
                      @click="closeFullscreenMobile"
                      color="white"
                  >
                    $x
                  </v-icon>
                </div>
              </template>
              <v-img
                  :src="getUrl(data.chapterPath[indexPage])"
                  class="img-page pa-1"
                  @click="changePage"
              />
            </template>
            <div
                v-if="indexPage < (data.chapterPath.length - 1) && (!modeMobile)"
                class="btn-page"
                @click="nextPage"
            >
              <v-icon>
                $arrowRight
              </v-icon>
            </div>
          </div>
          <div>
            <div
                v-if="data"
                class="currentPage"
            >
              <span class="d-block">{{$route.query.chapter}}</span>
              <span class="d-block">{{ indexPage + 1 }}/{{ data.chapterPath.length }}</span>
            </div>
          </div>
          <div class="d-flex flex-row justify-space-around flex-wrap mb-2">
            <NuxtLink
                v-if="getPreviousChapter"
                :to="`/room?type=manga&chapter=${getPreviousChapter}&manga=${$route.query.manga}`"
                class="text-decoration-none"
            >
              <v-btn
                color="primary"
              >
                <v-icon
                  class="mr-2"
                >
                  $arrowLeft
                </v-icon>
                Next chapter
              </v-btn>
            </NuxtLink>
            <div  v-else> </div>
            <NuxtLink
                v-if="nextChapter"
                :to="`/room?type=manga&chapter=${nextChapter}&manga=${$route.query.manga}`"
                class="text-decoration-none"
            >
              <v-btn
                  color="secondary"
              >
                Previous chapter
                <v-icon
                    class="ml-2"
                >
                  $arrowRight
                </v-icon>
              </v-btn>
            </NuxtLink>
          </div>
        </div>
        <v-btn
            @click="fullScreen"
        >
          full screen
        </v-btn>
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
          {{ `${hostWeb}/room?idroom=${idRoom}` }}
        </span>
      </div>

      <div class="d-flex justify-center" style="width: 100%">
        <div v-for="(user, index) in users" class="ma-3">
          <userSession :nickname="user.nickname" :root="index === 0" :currentUser="currentUser"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pkg from 'websocket';

const {w3cwebsocket} = pkg;
import axios from "axios";

import {useRuntimeConfig} from "nuxt/app";

import lodash from "../../mixins/lodash";

import userSession from "../../component/userSession";
import mitt from 'mitt';

export default {
  name: 'room',
  components: {
    userSession
  },
  mixins: [
    lodash
  ],
  data() {
    const runtimeConfig = useRuntimeConfig();

    return {
      hide: "",
      data: null,

      hostSocket: runtimeConfig.public.socketBase,
      hostHTTP: runtimeConfig.public.httpBase,
      hostWeb: runtimeConfig.public.webBase,
      basePath: runtimeConfig.public.basePath,

      ws: null,

      idRoom: null,
      root: null,
      currentUser: null,
      users: null,
      episode: null,
      pause: null,
      time: 0,
      room: null,
      type: null,

      indexPage: 0,
      chapters: [],
      modeMobile: false
    }
  },
  mounted() {
    this.type = this.$route.query.type;

    if (this.type === 'manga') {
      this.load();
    } else if (this.type === 'anime') {
      this.room = mitt();

      console.log("Starting connection to WebSocket Server");
      this.ws = new w3cwebsocket(this.hostSocket);

      const _self = this;
      //sockets
      this.ws.onopen = function () {
        console.log("Successfully connected to the echo WebSocket Server");

        console.log(_self.ws)

        _self.room.emit('checkRoom');

        _self.load();
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
        var vid = document.getElementById("my-video");

        this.sendMessage('currentTime', {time: vid.currentTime, idRoom: this.idRoom})
        console.log('request currentTime');
      });

      //event
      var vid = document.getElementById("my-video");

      vid.addEventListener("canplaythrough", () => {

        console.log('canplaythrough');
        var vid = document.getElementById("my-video");

        if (vid.currentTime > 0)
          _self.room.emit('time', vid.currentTime);
      });
      vid.addEventListener("pause", () => {
        _self.room.emit('pause', true);
      });
      vid.addEventListener("playing", () => {
        _self.room.emit('pause', false);
      });
    }
  },
  computed: {
    getPreviousChapter() {
      if (this.chapters.length <= 0)
        return null;

      const chapterId = this.data.chapterId;

      const index = this.chapters.findIndex(chapter => chapter.id === chapterId)

      if (index > 0)
        return this.chapters[index - 1].id

      return null;
    },
    nextChapter() {
      if (this.chapters.length <= 0)
        return null;

      const chapterId = this.data.chapterId;

      const index = this.chapters.findIndex(chapter => chapter.id === chapterId)

      if (index <= this.chapters.length)
        return this.chapters[index + 1].id

      return null;
    }
  },
  methods: {
    changePage(event) {
      const maxWidthPage = event.srcElement.width
      const currentPositionX = event.offsetX;

      if (currentPositionX > (maxWidthPage / 2))
        this.nextPage();
      else
        this.previousPage();
    },
    previousPage() {
      if (this.indexPage > 0)
        this.indexPage -= 1;
    },
    nextPage() {
      if (this.indexPage < (this.data.chapterPath.length - 1))
        this.indexPage += 1;
    },
    fullScreen() {
      const elem = document.getElementById('my-manga');
      try {
        elem.requestFullscreen();
      } catch {
        this.modeMobile = true;
        elem.classList.add('fullscreen-mobile');
      }
    },
    sendMessage(setAction, data) {
      console.log(this.ws);
      this.ws.send(JSON.stringify({action: setAction, data}))
    },
    load() {
      if (this.type === "anime" && this.$route.query.episode != null && this.data == null) {
        this.episode = this.$route.query.episode;
      } else if (this.type === "manga") {
        axios.get(`/api/manga/register?id=${this.$route.query.chapter}`)
            .then(rs => {
              this.indexPage = 0;
              this.data = rs.data
            });
        axios.get(`/api/manga/chapter?name=${this.$route.query.manga}`)
            .then(rs => {
              this.chapters = rs.data
            });
      }
    },
    getVideoEpisode() {
      //get api internal
      axios.get(`/api/anime/register?id=${this.episode}`)
          .then(rs => {
            this.data = rs.data
          });
    },
    getUrl(url) {

      if (url.includes(':')) {
        url = url.replace(/\\/g, '\\\\');
      }

      url = url.replace(this.basePath, '')

      return `${this.hostHTTP}/${url}`;
    },
    closeFullscreenMobile() {
      const elem = document.getElementById('my-manga');
      elem.classList.remove('fullscreen-mobile');
      this.modeMobile = false;
    },
    close() {
      if (this.type === 'anime') {
        this.ws.close();
        console.log('Closed WebSocket')

        this.ws = null;
      }
      this.$router.push('/')
    }
  },
  watch: {
    $route(to, from) {
      this.load();
    },
    episode() {
      this.getVideoEpisode(this.episode);
    },
    time() {
      var vid = document.getElementById("my-video");
      vid.currentTime = this.time
    },
    pause() {
      var vid = document.getElementById("my-video");
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
  }
}
</script>

<style lang="scss" scoped>
.link-share {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
}

#my-video {
  width: 100%;
  height: auto;
}

.btn-page {
  height: 200px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  color: white !important;
  padding: 5px;
  cursor: pointer;
}

#my-manga {
  width: calc(100vh - 316px);
}

.img-page {
  cursor: pointer;
  height: calc(100vh - 180px);
}
.btn-link{
  font-style: unset;
}

#my-manga:not(:root):fullscreen .img-page {
  height: calc(100vh - 100px);
}

  .currentPage {
  font-size: large;
  font-weight: bold;
  color: white;
}

#my-manga.fullscreen-mobile {
  width: 100%;
  background-color: black;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1;

  #closeFullscreenMobile {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    padding: 10px;
  }

  .img-page {
    z-index: 1;
    height: calc(100vh - 135px);
  }
}
</style>