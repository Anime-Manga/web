<template>
  <v-app>
      <v-navigation-drawer
        expand-on-hover
        color="#363636"
        rail
        permanent
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
            @click="setTypeComponent(item.id)"
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
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
<script setup>
import {useStore} from "../store";

//variables
const select = ref();

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
    default:
      return '';
  }
}

function setTypeComponent(id){
  store.setCurrentSelectSearch(id);
}

const getSchemas = computed(() => {
  const items = [{
    id:'all',
    text:'All local DB',
    icon:'$database'
  },
    {
      id:'local',
      text:'Search local DB',
      icon:'$search'
    }]

  let schemas = store.getSchemas;

  for (const key in schemas) {
    items.push({
      'id':`search-${schemas[key].name}`,
      text:`Search ${schemas[key].name}`,
      icon: getIcon(schemas[key].name)
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

<style>
#main {
  background-image: url("/images/background.jpg");
  background-repeat: repeat-y;
  background-size: contain;
}
</style>