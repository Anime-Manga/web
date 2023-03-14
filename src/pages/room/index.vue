<template>
  <div
      id="main"
      class="fill-height"
      style="width: 100%"
  >
      <template v-if="getType === 'anime'">
        <videoAnime />
      </template>
    <template v-if="getType === 'manga'">
      <bookManga />
    </template>
  </div>
</template>

<script setup>
const route = useRoute();

const getType = computed(() => {
  return route.query.type;
});
</script>