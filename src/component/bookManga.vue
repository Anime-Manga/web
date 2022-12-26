<template>
  <div
      style="overflow: unset !important;"
  >
    <div
        class="text-center d-flex flex-column fill-height justify-center align-center"
    >
      <v-btn
          style="color: white !important;"
          color="info"
          class="mt-1"
          @click="close()"
      >
        Go to Home
      </v-btn>
      <div id="my-manga">
        <template v-if="!modeList">
          <cacheImg
              v-if="data"
              :data="data"
          />
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
            <div class="contain-page text-center">
              <img
                  v-show="data && loadingImage === false"
                  ref="img-book"
                  :src="getUrl()"
                  class="img-page pa-1"
                  @click="changePage"
              />
              <div v-if="loadingImage" class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                    color="primary"
                    size="100"
                    width="10"
                    indeterminate
                />
              </div>
            </div>
            <div
                v-if="data && indexPage < (data.chapterPath.length - 1) && (!modeMobile)"
                class="btn-page"
                @click="nextPage"
            >
              <v-icon>
                $arrowRight
              </v-icon>
            </div>
          </div>
        </template>
        <template v-else>
          <div
              class="contain-page"
          >
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
            <img
                ref="img-books"
                class="img-page"
                v-show="!loadingImage"
                v-for="index in (data.chapterPath.length)"
                :src="getUrl(index - 1)"
            />
            <div v-if="loadingImage" class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                  bg-color="secondary"
                  color="primary"
                  size="100"
                  width="10"
                  indeterminate
              >
                <span style="color: white; font-weight: bold">{{ done + '/' + data.chapterPath.length }}</span>
              </v-progress-circular>
            </div>
          </div>
        </template>
      </div>
      <div
          class="menu"
      >
        <v-icon
            color="white"
            @click="showMenu = !showMenu"
        >
          {{ showMenu ? '$arrowDown' : '$arrowUp' }}
        </v-icon>
        <div
            v-if="showMenu"
        >
          <div>
            <div
                v-if="data"
                class="currentPage"
            >
              <span class="d-block">{{ $route.query.chapter }}</span>
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
                Previous chapter
              </v-btn>
            </NuxtLink>
            <div v-else></div>
            <NuxtLink
                v-if="nextChapter"
                :to="`/room?type=manga&chapter=${nextChapter}&manga=${$route.query.manga}`"
                class="text-decoration-none"
            >
              <v-btn
                  color="secondary"
              >
                Next chapter
                <v-icon
                    class="ml-2"
                >
                  $arrowRight
                </v-icon>
              </v-btn>
            </NuxtLink>
          </div>
          <v-btn
              @click="fullScreen"
              class="mr-3"
          >
            full screen
          </v-btn>
          <v-btn
              @click="modeList = !modeList"
          >
            MODE: {{ modeList ? 'List' : 'Page' }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from "../mixins/lodash";

import axios from "axios";
import {useRuntimeConfig} from "nuxt/app";
import _ from 'lodash'

import cacheImg from "./cacheImg";

export default {
  name: "bookManga",
  components: {
    cacheImg
  },
  mixins: [
    lodash
  ],
  data() {
    const runtimeConfig = useRuntimeConfig();

    return {
      hostHTTP: runtimeConfig.public.httpBase,
      basePath: runtimeConfig.public.basePath,

      data: null,
      indexPage: 0,
      chapters: [],
      modeMobile: false,
      loadingImage: true,
      showMenu: false,
      modeList: false,
      done: 0
    }
  },
  mounted() {
    this.load();
    this.checkDownload();
  },
  updated() {
    if (this.data.chapterId !== this.$route.query.chapter) {
      this.done = 0;
      this.loadingImage = true;
      this.load();
    }
  },
  watch: {
    done() {
      if (this.done === (this.data.chapterPath.length - 1))
        this.loadingImage = false;
    },
    data() {
      this.checkDownload();
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
    checkDownload() {
      const _self = this

      if (!_.isNil(this.$refs["img-book"])) {
        this.$refs["img-book"].onload = function () {
          _self.loadingImage = false;
        }
      } else if (this.$refs["img-books"]) {
        for (const img of this.$refs["img-books"]) {
          img.onload = function () {
            _self.done += 1;
          }
        }
      }
    },
    changePage(event) {
      const maxWidthPage = event.srcElement.width
      const currentPositionX = event.offsetX;

      if (currentPositionX > (maxWidthPage / 2))
        this.nextPage();
      else
        this.previousPage();
    },
    previousPage() {
      if (this.indexPage > 0) {
        this.loadingImage = true;
        this.checkDownload();
        this.indexPage -= 1;
        this.setScrollTop();
      }
    },
    nextPage() {
      if (this.indexPage < (this.data.chapterPath.length - 1)) {
        this.loadingImage = true;
        this.checkDownload();
        this.indexPage += 1;
        this.setScrollTop();
      }
    },
    setScrollTop() {
      const scroll = document.getElementsByClassName('contain-page')[0];
      scroll.scrollTop = 0;
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
    getUrl(index = this.indexPage) {
      let url;

      if (!_.isNil(this.data))
        url = this.data.chapterPath[index];
      else
        return null;

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
    load() {
      axios.get(`/api/manga/register?id=${this.$route.query.chapter}`)
          .then(rs => {
            this.indexPage = 0;
            this.data = rs.data
          });
      axios.get(`/api/manga/chapter?name=${this.$route.query.manga}`)
          .then(rs => {
            this.chapters = rs.data
          });
    },
    close() {
      this.$router.push('/')
    }
  }
}
</script>


<style lang="scss" scoped>
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

.contain-page {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

.img-page {
  cursor: pointer;
  width: 100%;
  display: block
}

#my-manga:not(:root):fullscreen {
  .contain-page {
    height: 100vh;
    margin: auto;

    display: flex;
    flex-direction: column;
    align-items: center;

    .img-page {
      width: calc(100vh - 100px);
    }
  }
}

.btn-link {
  font-style: unset;
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

  .contain-page {
    height: 100vh;

    .img-page {
      z-index: 1;
    }
  }
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

  &.active {
    bottom: 0;
  }
}
</style>