<template>
  <img
      v-for="index in data.chapterPath.length"
      v-show="false"
      :src="getUrl(index - 1)"
  />
</template>

<script>
import _ from "lodash";
import {useRuntimeConfig} from "nuxt/app";

export default {
  name: "cacheImg",
  data(){
    const runtimeConfig = useRuntimeConfig();

    return {
      hostHTTP: runtimeConfig.public.httpBase,
      basePath: runtimeConfig.public.basePath,

    }
  },
  props:[
      'data',
  ],
  methods:{
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
    }
  }
}
</script>

<style scoped>

</style>