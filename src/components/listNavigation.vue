<template>
  <v-app-bar
        color="primary"
        density="compact"
        collapse
        elevation="0"
        floating
      >

        <v-icon
        class="ml-4"
      @click="show = !show"
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
          v-for="item in getSchemas"
          :key="item.id"
          :value="item"
          :to="item.route"
      >
        <template
            v-slot:prepend
        >
          <v-icon>{{item.icon}}</v-icon>
        </template>

        <v-list-item-title v-text="item.text" class="text-capitalize" />
        <v-list-item-action

        />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const {
  status
} = useAuth()
import {useStore} from "../store";

//variables
const select = ref();
const show = ref(false);

//store
const store = useStore();

//api
const {getCfg} = useApi();

const result = await getCfg();
store.setSchemas(result);

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

const getSchemas = computed(() => {
  const items = [{
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
    }]

  let schemas = store.getSchemas;

  for (const key in schemas) {
    items.push({
      'id':`search-${schemas[key].name}`,
      text:`Search ${schemas[key].name}`,
      icon: getIcon(schemas[key].name),
      route: `/search/search-${schemas[key].name}`
    })
  }

  if(status.value === 'authenticated')
  {
    items.push({
      'id':`watchList`,
      text:`WatchList`,
      icon: '$saved',
      route: '/search/search-watchlist'
    },{
      'id':`logout`,
      text:`Logout`,
      icon: '$logout',
      route: '/auth/logout'
    })
  }else{
    items.push({
      'id':`login`,
      text:`Login`,
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
</style>