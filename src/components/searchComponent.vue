<template>
  <div>
    <div
        class="ma-auto"
        id="banner"
        :style="getStyleBanner"
    >
      <v-img
          :src="getPathImages"
          class="logo"
          height="200"
      />
    </div>
    <div
        v-if="typeSearch !== 'all' && typeSearch !== 'search-watchlist' && !isNil(typeSearch)"
        class="ma-auto mt-5"
        style="width: 50%; min-width: 200px"
    >
      <v-text-field
          v-model="search"
          variant="solo"
          label="Search"
          hide-details
          single-line
          color="primary"
          append-inner-icon="$search"
          :loading="isLoading"
          @click:append-inner="clickSearch()"
          v-on:keydown.enter="clickSearch()"
      />
    </div>
    <div>
      <div
          v-if="isLoading"
          class="d-flex flex-wrap justify-center"
      >
        <preview-card-loading
            v-for="index in 9"
            :key="index"
        />
      </div>
      <template
          v-else-if="data && data.length > 0"
      >
        <div class="d-flex flex-column">
          <div>
            <v-pagination
                v-model="page"
                class="my-4"
                color="white"
                :length="pages.length"
                prev-icon="arrow-left"
                next-icon="arrow-right"
            />
          </div>
          <div class="d-flex flex-row flex-wrap justify-center">
            <preview-card
                v-for="item in pages[page - 1]"
                :key="item.name"
                :item="item"
                @closeDialogAndUpdate="clickSearch()"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
//variables
import {watch} from "vue";
import {useStore} from "../store";
import _ from 'lodash'
const {isNil} = useLodash();

const {
  signOut,
  data: account
} = useSession()

const router = useRouter();

let data = ref([]);
let pages = ref([]);
let isLoading = ref(false);
let search = ref('');
let page = ref();

//props
const props = defineProps({
  typeSearch:{
    type: String,
    required: true
  }
})
const {typeSearch} = toRefs(props);
//store
const store = useStore();

onMounted(() => {
  store.setCurrentSelectSearch(typeSearch.value)

  if(typeSearch.value === 'all' || typeSearch.value === 'search-watchlist')
    clickSearch();
})
//api
const {getAll, searchLocal, searchDynamic, getAllWatchList} = useApi();

watch(data, () => {
  setPages();
})

const getPathImages = computed( () => {
  switch (typeSearch.value) {
    case null:
    case 'all':
    case "local":
    case "search-watchlist":
      return "/images/bar-anime.jpg";
    case "search-animesaturn":
      return "/images/logo_animesaturn.png";
    case "search-mangaworld":
      return "/images/MangaWorldLogo.svg";
  }
});

const getStyleBanner = computed(() => {
  switch (typeSearch.value) {
    case null:
    case 'all':
    case "local":
    case "search-watchlist":
      return "width: 100%;";
    case "search-animesaturn":
      return "width: 25%;";
    case "search-mangaworld":
      return "width: 50%;";
  }
});

function setPages() {
  let dataPaginated = [];
  let pagesPaginated = [];
  if (!_.isNil(data.value)) {
    for (const item of data.value) {
      if (pagesPaginated.length > 11) {
        dataPaginated.push(pagesPaginated)
        pagesPaginated = [];
      }
      pagesPaginated.push(item);
    }

    if (pagesPaginated.length > 0)
    dataPaginated.push(pagesPaginated)

    pages.value = dataPaginated;
    page.value = pages.value.length > 0 ? 1 : 0;
    isLoading.value = false;
  }
}

async function clickSearch() {
  isLoading.value = true;
  try{
    switch (typeSearch.value) {
      case 'all':
        data.value = await getAll(account?.value?.user?.name);
        break;
      case "local":
        data.value = await searchLocal(search.value, account?.value?.user?.name);
        break;

      case "search-watchlist":
        data.value = await getAllWatchList(account?.value?.user?.name)
        break;
      default:
        const schema = store.getSchemasBySelectSearch;
        data.value = await searchDynamic(schema.type, search.value, schema.nameCfg);
    }
  }finally{
    isLoading.value = false;
  }
}
</script>

<style scoped>
.logo {
  height: 220px;
  width: 100%;
  object-fit: contain;
}
</style>