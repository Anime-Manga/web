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

<script>
import videoAnime from "../../component/videoAnime";
import bookManga from "../../component/bookManga";

export default {
  name: 'room',
  components: {
    videoAnime,
    bookManga
  },
  computed: {
    getType(){
      return this.$route.query.type;
    }
  }
}
</script>