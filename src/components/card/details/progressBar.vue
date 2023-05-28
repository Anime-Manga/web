<template>
  <v-progress-linear
      v-model="item.percentualDownload"
      :color="getStatus"
      height="25"
      striped
  >
    <template v-slot:default="{ value }">
      <template v-if="isNil(item.stateDownload)">
        <strong>NOT YET PROCESSED</strong>
      </template>
      <template v-else-if="item.stateDownload.toUpperCase() === 'CONVERSIONING'">
        <strong>CONVERSION {{ item.percentualDownload }}%</strong>
      </template>
      <template v-else-if="item.stateDownload.toUpperCase() === 'DOWNLOADING'">
        <strong>{{ item.percentualDownload }} %</strong>
      </template>
      <template v-else>
        <strong style="color: white">{{ item.stateDownload.toUpperCase() }}</strong>
      </template>
    </template>
  </v-progress-linear>
</template>

<script setup>
//lodash
const {isNil} = useLodash();

const props = defineProps({
  item:{
    type: Object,
    required: true
  }
})
const {item} = toRefs(props);

const getStatus = computed(() => {
  switch (item.value.stateDownload) {
    case 'downloading':
      return 'primary';
    case 'conversioning':
      return 'light-blue';
    case 'completed':
      return 'success';
    case 'failed':
      return 'error';
    case 'wait conversion':
      return 'grey';
    case 'pending':
      return 'warning';
    default:
      return 'grey';
  }
});
</script>