<template>
  <ClientOnly>
    <v-app-bar
      id="menu"
      color="primary"
      density="compact"
      collapse
      elevation="0"
      floating
    >

      <v-icon
        class="ml-4"
        @click="show = !show"
        size="24"
      >
        $menu
      </v-icon>
    </v-app-bar>
    <v-navigation-drawer
        expand-on-hover
        color="#363636"
        rail
        temporary
        v-model="show"
    >
      <v-list
          density="compact"
          class="list-items"
          :selected="select"
          nav
      >
        <v-list-item
            v-for="item in listItems"
            :key="item.id"
            :to="item.route"
        >
          <template
              v-slot:prepend
          >
            <v-icon size="24">{{item.icon}}</v-icon>
          </template>

          <v-list-item-title v-text="item.text" class="text-capitalize" />
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<script setup>
//variables
const select = ref();
const show = ref(false);

//store
const store = useStore();

//api
const {getCfg, apiAsync} = useApi();

onBeforeMount(async () => {
  await apiAsync(
    getCfg(),
    (data) => store.setSchemas(data)
  );
})

function getIcon(id){
  switch (id){
    case 'animesaturn':
      return '$planet';
    case 'mangaworld':
      return '$book';
    case 'mangaworldadult':
      return '$bookSkull';
    default:
      return '';
  }
}

const listItems = computed(() => {
  let schemas = store.getSchemas;

  let items = [{
    id:'all',
    text:'All local DB',
    icon:'$database',
    route: '/search/all'
  },
  {
    id:'local',
    text:'Search local DB',
    icon:'$search',
    route: '/search/search-local'
  }];

  for (const key in schemas) {
    items.push({
      'id':`search-${schemas[key].name}`,
      text:`Search ${schemas[key].name}`,
      icon: getIcon(schemas[key].name),
      route: `/search/search-${schemas[key].name}`
    })
  }

  if(!isNil(store.getUser))
  {
    items.push({
      id:'watchList',
      text:'WatchList',
      icon: '$saved',
      route: '/search/search-watchlist'
    },{
      id:'logout',
      text:'Logout',
      icon: '$logout',
      route: '/auth/logout'
    })

    if(useGet(store.getUser, 'role', 0) === 100){
      items.push({
        id:'queue',
        text:'request',
        icon: '$request',
        route: '/queue'
      })
    }
  }else{
    items.push({
      id:'login',
      text:'Login',
      icon: '$login',
      route: '/auth/login'
    })
  }

  return items;
})
</script>

<style lang="scss" scoped>
.list-items{
  color: white !important;
}

#menu{
  z-index: 2 !important;
}
</style>