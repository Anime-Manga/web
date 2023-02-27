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
      :item="checkNull(data)? item : data"
      @closeDialog="closeDialog"
      @updateData="updateData"
      @closeDialogAndUpdate="$emit('closeDialogAndUpdate')"
  />
</template>

<script>
import {Buffer} from 'buffer'

import detailsCard from "./detailsCard";

import _ from 'lodash'

import api from '/mixins/api'
import lodash from '/mixins/lodash'
import axios from "axios";
import {useStore} from "../store";

export default {
  name: "previewCard",
  components: {
    detailsCard
  },
  props: [
    'item'
  ],
  mixins: [
    api,
    lodash
  ],
  setup() {
    const store = useStore();
    return {store}
  },
  data() {
    return {
      activeModal: null,
      data: null
    }
  },
  computed: {
    getStatusDetails() {
      if (!_.isNil(this.item.exists) && this.item.exists === true) {
        return 'success'
      }
      return 'primary'
    }
  },
  methods: {
    ConvertBase64(imgBase64) {
      if (imgBase64 == null)
        return null

      let buff = Buffer.from(imgBase64);
      return buff.toString()
    },
    details() {
      if (!_.isNil(this.item.exists) && this.item.exists === true) {
        let type = null;
        if (this.item.typeView === 'video')
          type = 'anime'
        else
          type = 'manga'

        const {nameCfg} = this.store.getSchemasBySelectSearch

        axios(`/api/${type}/get?name=${this.item.name}&nameCfg=${nameCfg}`)
            .then(res => {
              const {data} = res
              this.data = data;
            })
            .finally(() => {
              this.activeModal = 'detailsCard'
            })
      } else
        this.activeModal = 'detailsCard'
    },
    closeDialog() {
      this.activeModal = null
    },
    updateData(data) {
      this.data = data;
    }
  }
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