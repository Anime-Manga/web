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
<script>
import lodash from "../mixins/lodash";
import {useStore} from "../store";
import axios from "axios";
export default {
  name: "index",
  mixins:[
    lodash
  ],
  setup(){
    const store = useStore();

    return {store}
  },
  data(){
    return{
      select:[]
    }
  },
  mounted() {
    axios.get('api/schemas')
        .then((rs) => {
          const {data} = rs;
          this.store.setSchemas(data)
        })
  },
  computed:{
    getSchemas(){
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

      let schemas = this.store.getSchemas;

      for (const key in schemas) {
        items.push({
          'id':`search-${schemas[key].name}`,
          text:`Search ${schemas[key].name}`,
          icon:this.getIcon(schemas[key].name)
        })
      }

      return items;
    }
  },
  methods:{
    getIcon(id){
      switch (id){
        case 'animesaturn':
          return '$planet';
        case 'mangaworld':
          return '$book';
        default:
          return '';
      }
    },
    setTypeComponent(id){
      this.store.setCurrentSelectSearch(id);
    }
  }
}
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