<template>
  <v-card
      width="18rem"
      class="mr-2 ml-1 my-2"
  >
    <div
      class="identity-type"
    >
      <template v-if="item.typeView === 'video' || item.type === 'video'">
        <v-icon>$video</v-icon>
      </template>
      <template v-else>
        <v-icon>$book</v-icon>
      </template>
    </div>
    <v-img
        :src="item.image ?? item.cover"
        class="card-img-top rounded-top"
        height="400"
        cover
    />
    <v-card-title>
      {{ item.name ?? item.name_id }}
    </v-card-title>
    <v-card-actions>
      <v-btn
          :class="getStatusDetails"
          block
          @click="details()"
      >
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
  <component
      :is="activeModal"
      :item="isNil(data)? item : data"
      @closeDialog="closeDialog"
      @updateData="updateData"
      @closeDialogAndUpdate="$emit('closeDialogAndUpdate')"
  />
</template>

<script setup>
import {Buffer} from 'buffer'
import _ from 'lodash'
import {useStore} from "../store";
const {isNil} = useLodash();
//store
const store = useStore();

//api
const {getByName} = useApi();

//variabvles
const activeModal = ref(null);
const data = ref(null);

const props = defineProps({
  item:{
    type: Object,
    required: true
  }
})

const {item} = toRefs(props);

//emits
defineEmits(['closeDialogAndUpdate']);

const getStatusDetails = computed(() => {
  if (!_.isNil(item.value.exists) && item.value.exists === true) {
    return 'success'
  }
  return 'primary'
});

function ConvertBase64(imgBase64) {
  if (imgBase64 == null)
    return null

  let buff = Buffer.from(imgBase64);
  return buff.toString()
}

async function details() {
  if (!_.isNil(item.value.exists) && item.value.exists === true) {
    const {nameCfg} = store.getSchemasBySelectSearch

    data.value = getByName(item.value.typeView, item.value.name, nameCfg)
    activeModal.value = 'detailsCard'
  } else
    activeModal.value = 'detailsCard'
}

function closeDialog() {
  activeModal.value = null
}

function updateData(result) {
  data.value = result;
}
</script>

<style lang="scss" scoped>
.identity-type{
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  top: 0;
  background-color: white;
  width: 50px;
  height: 50px;
  z-index: 1;
}
</style >