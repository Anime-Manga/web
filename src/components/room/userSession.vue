<template>
  <v-card
      :color="this.background"
  >
    <v-card-text>
      <div class="d-flex flex-column align-center  fill-height">
        <v-icon v-if="root">$crown</v-icon>
        <v-icon>$user</v-icon>
      </div>
      <div class="card-body" style="padding: 1px 5px; margin: auto;">
        {{ nickname }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'userSession',
  props: {
    nickname: String,
    root: Boolean,
    currentUser: String
  },
  data() {
    return {
      background: 'white'
    }
  },
  mounted() {
    if (this.currentUser === this.nickname)
      this.background = 'success'
  },
  updated() {
    if (this.currentUser === this.nickname)
      this.background = 'success'
    else
      this.background = 'white'
  }
}
</script>

<style scoped>
.card-body {
  font-size: x-small;
}
</style>