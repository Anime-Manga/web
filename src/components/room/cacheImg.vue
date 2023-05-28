<template>
  <img
      v-for="index in data.chapterPath.length"
      v-show="false"
      :src="getUrl(index - 1)"
  />
</template>

<script setup>
import _ from 'lodash'
const runtimeConfig = useRuntimeConfig();

const props = defineProps({
  data:{
    type: Object,
    required: true
  }
})

const {data} = toRefs(props);

function getUrl(index) {
  let url;

  if (!_.isNil(data.value))
    url = data.value.chapterPath[index];
  else
    return null;

  if (url.includes(':')) {
    url = url.replace(/\\/g, '\\\\');
  }

  url = url.replace(runtimeConfig.public.basePath, '')
  return `${runtimeConfig.public.httpBase}/${url}`;
}
</script>