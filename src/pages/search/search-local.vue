<template>
  <div
      id="main"
      class="fill-height"
  >
    <searchComponent
        typeSearch="local"
    />
  </div>
</template>

<script>
definePageMeta({ auth: false })
export default {
  name: "search-local"
}
</script>

<style scoped>

</style>