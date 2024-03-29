<template>
  <div
      style="overflow: unset !important;"
  >
    <div
        class="text-center d-flex flex-column fill-height justify-center align-center"
    >
      <div id="my-manga">
        <template v-if="!modeList">
          <div class="d-flex flex-row align-center justify-center">
            <div
                v-if="indexPage > 0 && (!modeMobile) && !loadingImage"
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
                  ref="imgBook"
                  :src="getUrl()"
                  class="img-page pa-1"
                  @click="changePage"
                  :onerror="() => openDialogCertificate(hostHTTP)"
              />
              <div v-if="loadingImage" class="d-flex align-center justify-center fill-height" style="overflow: hidden;">
                <v-progress-circular
                    color="primary"
                    size="100"
                    width="10"
                    indeterminate
                />
              </div>
            </div>
            <div
                v-if="data && indexPage < (data.chapterPath.length - 1) && (!modeMobile) && !loadingImage"
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
                v-for="index in (data.chapterPath.length)"
                :src="getUrl(index - 1)"
                :id="'page-'+(index - 1)"
                ref="imgBooks"
                class="img-page"
                v-show="!loadingImage"
                :onerror="() => openDialogCertificate(hostHTTP)"
            />
            <div v-if="loadingImage" class="d-flex align-center justify-center fill-height" style="overflow: hidden;">
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
            size="24"
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
              <span class="d-block">{{ route.query.chapter }}</span>
              <span class="d-block">{{ indexPage + 1 }}/{{ data.chapterPath.length }}</span>
            </div>
          </div>
          <div class="d-flex flex-row justify-space-around flex-wrap mb-2">
            <NuxtLink
                v-if="getPreviousChapter"
                :to="`/room?type=manga&chapter=${getPreviousChapter}&nameCfg=${route.query.nameCfg}&name=${route.query.name}`"
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
            <NuxtLink
                v-if="nextChapter"
                @click="ignoreAlertRewriteProcess = true"
                :to="`/room?type=manga&chapter=${nextChapter}&nameCfg=${route.query.nameCfg}&name=${route.query.name}`"
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
              class="mr-3"
          >
            MODE: {{ modeList ? 'List' : 'Page' }}
          </v-btn>
          <v-btn
              v-if="!isNil(store.getUser)"
              @click="saveStatusProgress()"
          >
            Save Progress
          </v-btn>
        </div>
      </div>
    </div>
  </div>
  <component
    :is="activeModal"
    :actual="data?.chapterId"
    :restore="progress?.nameChapter"
    type="manga"
    @close="activeModal = ''"
    @confirmResume="resume()"
  />

  <FastDialog
    v-model="showCertificate"
    title="Problem certificate"
    text="Problem certificate, please accept it"
    textBtn="Open"
    :actionButton="actionCertificate"
  />
</template>

<script setup>
import _ from 'lodash'

const runtimeConfig = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const store = useStore();
const {getRegister, getStatus, saveProgress, getProgress, apiAsync} = useApi();

//env
const data = ref(null)
const indexPage = ref(0)
const chapters = ref([])
const modeMobile = ref(false)
const loadingImage = ref(true)
const showMenu = ref(false)
const modeList = ref(false)
const done = ref(0)
const progress = ref(null);
const notSaveProgress = ref(false);
const ignoreAlertRewriteProcess = ref(false);

const showCertificate = ref(false);
const actionCertificate = ref(null);

//dialog
const activeModal = ref("");

//refs
const imgBook = ref(null);
const imgBooks = ref(null);

//services
const hostHTTP = ref(runtimeConfig.public.httpBase);
const basePath = ref(runtimeConfig.public.basePath);

onMounted(() => {
  load();
  checkDownload();

  window.addEventListener("beforeunload", leaving);
  window.addEventListener("pagehide", leaving);
  window.addEventListener("blur", leaving);
})

onBeforeRouteLeave(async () => {
  await saveStatusProgress();

  window.removeEventListener("beforeunload", leaving);
  window.removeEventListener("pagehide", leaving);
  window.removeEventListener("blur", leaving);
})

//computed
const getPreviousChapter = computed(() => {
  if (chapters.value.length <= 0)
    return null;

  const chapterId = data.value.chapterId;

  const index = chapters.value.findIndex(chapter => chapter.id === chapterId)

  if (index > 0)
    return chapters.value[index - 1].id
  return null;
})

const nextChapter = computed(() => {
  if (chapters.value.length <= 0)
    return null;

  const chapterId = data.value.chapterId;

  const index = chapters.value.findIndex(chapter => chapter.id === chapterId)

  if (index <= chapters.value.length)
    return chapters.value[index + 1].id
  return null;
});

//watch
watch(done, () => {
  if(!isNil(data))
  {
    if (done.value >= (data.value.chapterPath.length - 1) && modeList.value)
    {
      loadingImage.value = false;
      if(!isNil(progress.value) && progress.value.nameChapter === route.query.chapter)
      {
        setTimeout(() => {
          const page = document.getElementById(`page-${progress.value.page}`);
          page.scrollIntoView({
            behavior: 'smooth'
          });
        }, 250);
      }
    }
  }
})

watch(data, () => {
  setTimeout(() => checkDownload(), 250);
})

watch(modeList, () => {
  loadingImage.value = true;

  setTimeout(() => checkDownload(), 250);
});

watch(route, async () => {
  if (data.value.chapterId !== route.query.chapter) {
    await saveStatusProgress();
    done.value = 0;
    data.value = null;
    progress.value = null;
    indexPage.value = 0;
    loadingImage.value = true;
    load();
  }

  //restore
  notSaveProgress.value = false;
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

async function leaving(){
  await saveStatusProgress();
}

async function saveStatusProgress(page = indexPage){
  if(!isNil(store.getUser) && notSaveProgress.value === false)
  {
    if(modeList.value)
    {
      const scroll = document.getElementsByClassName('contain-page')[0];
      
      for (var i = 0; i<done.value; i++) {
        const img = document.getElementById('page-'+i)
        if(scroll.scrollTop <= img.offsetTop)
        {
          progress.value.page = i;
          break;
        }
      }
    }else
      progress.value.page = page;

    progress.value.name = route.query.name;
    progress.value.nameChapter = data.value.chapterId;

    await apiAsync(
      saveProgress(null, progress.value, 'book'),
      (data) => progress.value = data
    );
  }
}

function checkDownload() {
  if (!_.isNil(imgBook.value)) {
    imgBook.value.onload = function () {
      loadingImage.value = false;
    }
  } else if (!_.isNil(imgBooks.value)) {
    for (const img of imgBooks.value) {
      if(img.complete)
      {
        done.value += 1;
      }else{
        img.onload = function () {
          done.value += 1;
        }
        }
        img.onerror = function () {
          done.value += 1;
        }
    }
  }
}

function changePage(event) {
  const maxWidthPage = event.srcElement.width
  const currentPositionX = event.offsetX;

  if (currentPositionX > (maxWidthPage / 2))
    nextPage();
  else
    previousPage();
}

function previousPage() {
  if (indexPage.value > 0) {
    loadingImage.value = true;
    checkDownload();
    indexPage.value -= 1;
    setScrollTop();
  }
}
function nextPage() {
  if (indexPage.value < (data.value.chapterPath.length - 1)) {
    loadingImage.value = true;
    checkDownload();
    indexPage.value += 1;
    setScrollTop();
  }
}

function setScrollTop() {
  const scroll = document.getElementsByClassName('contain-page')[0];
  scroll.scrollTop = 0;
}

function fullScreen() {
  const elem = document.getElementById('my-manga');
  try {
    elem.requestFullscreen();
  } catch {
    modeMobile.value = true;
    elem.classList.add('fullscreen-mobile');
  }
}

function getUrl(index = indexPage.value) {
  let url;
  if (!_.isNil(data.value))
    url = data.value.chapterPath[index];
  else
    return null;
  if (url.includes(':')) {
    url = url.replace(/\\/g, '\\\\');
  }
  url = url.replace(basePath.value, '')

  if(url[0] === '/')
    return `${hostHTTP.value}${url}`;

  return `${hostHTTP.value}/${url}`;
}

function closeFullscreenMobile() {
  const elem = document.getElementById('my-manga');
  elem.classList.remove('fullscreen-mobile');
  modeMobile.value = false;
}

async function load() {
  if(!isNil(store.getUser))
  {
    await apiAsync(
      getProgress({
        name: route.query.name,
        username: store.getUser?.username,
        nameCfg: route.query.nameCfg
      }, 'book'),
      (data) => progress.value = data,
      () => {
        progress.value = {
          nameCfg: route.query.nameCfg,
          name: route.query.name,
          nameChapter: route.query.chapter,
          username: store.getUser?.username,
          page: 0
        }
      },
      null,
      null,
      true
    );
  }
  
  await apiAsync(
    getRegister({
      id: route.query.chapter
    }, 'book'),
    (rs) => data.value = rs
  )
  
  if(!isNil(progress.value) && progress.value.nameChapter === useGet(data.value, 'chapterId'))
    indexPage.value = progress.value.page;
  else
    indexPage.value = 0;

  await apiAsync(
    getStatus({
      name: route.query.name
    }, 'book'),
    (data) => chapters.value = data,
      null,
      null,
      null,
      true
  );
  
  if(!isNil(progress.value))
  {
    if(progress.value.nameChapter !== data.value.chapterId && ignoreAlertRewriteProcess.value === false)
      activeModal.value = "rewriteProgressDialog";
    else
      ignoreAlertRewriteProcess.value = false;
  }
}

function resume(){
  activeModal.value = '';
  notSaveProgress.value = true;
  router.push(`/room?type=manga&chapter=${progress.value.nameChapter}&nameCfg=${route.query.nameCfg}&name=${route.query.name}`)
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
  z-index: 3;

  #closeFullscreenMobile {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    right: 0;
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
  z-index: 3;
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