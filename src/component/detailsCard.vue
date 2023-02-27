<template>
  <v-dialog
      v-model="activator"
      width="1000"
      persistent
  >
    <v-card>
      <v-card-item
        class="pa-2 secondary"
      >
        <v-btn
            color="primary"
            @click="close()"
            class="my-1 mr-1"
        >
          <v-icon
              color="white"
          >
            $arrowLeft
          </v-icon>
        </v-btn>
        <template
            v-if="!checkNull(this.item.urlPageDownload)"
        >
          <v-btn
              color="warning"
              @click="download()"
          >
            <template
              v-if="isLoadingDownload"
            >
              <v-progress-circular
                  indeterminate
                  size="25"
              />
            </template>
            <template
              v-else
            >
              <v-icon>
                $download
              </v-icon>
            </template>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
              color="warning"
              class="mr-1"
              @click="reDownload()"
          >
            <template v-if="isLoadingReDownload">
              <v-progress-circular
                indeterminate
              />
            </template>
            <template
              v-else
            >
              <v-icon>
                $redownload
              </v-icon>
            </template>
          </v-btn>
          <v-btn
              color="error"
              @click="remove()"
          >
            <template v-if="isLoadingDelete">
              <v-progress-circular
                indeterminate
              />
            </template>
            <template v-else>
              <v-icon>
                $trash
              </v-icon>
            </template>
          </v-btn>
        </template>
      </v-card-item>
      <v-card-item class="pa-2">
        <template v-if="error">
          <alert
              type="error"
              :text="error"
          />
        </template>
      </v-card-item>
      <v-card-title class="px-0">
        <v-img
            :src="item.image ?? item.cover"
            class="card-img-top rounded-top hide-img"
            height="100"
            cover
        >
        </v-img>
        <div class="card-title">
          {{ item.name }}
        </div>
      </v-card-title>
      <v-card-text>
        <descriptionDynamic
            :item="item"
        />
        <statusDownload
            :type="type"
            :item="item"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import _ from 'lodash'

import descriptionDynamic from "./descriptionDynamic";
import statusDownload from "./statusDownload";
import alert from "./alert";

import lodash from '/mixins/lodash'
import {useStore} from "../store";

export default {
  name: "detailsCard",
  components: {
    descriptionDynamic,
    statusDownload,
    alert
  },
  setup() {
    const store = useStore();
    return {store}
  },
  emits:[
    'closeDialogAndUpdate',
    'updateData'
  ],
  props: [
    'item'
  ],
  mixins: [
    lodash
  ],
  data() {
    return {
      activator: true,
      type: '',
      isLoadingDownload:false,
      isLoadingReDownload: false,
      isLoadingDelete:false,
      error:null
    }
  },
  mounted() {
    if (this.item.typeView === 'video' || this.item.type === 'video')
      this.type = 'anime';
    else
      this.type = 'manga';
  },
  methods: {
    download(){
      this.isLoadingDownload = true;
      this.error = null;

      const {nameCfg} = this.store.getSchemasBySelectSearch;

      axios.post(`/api/${this.type}/download?url=${this.item.urlPageDownload}&nameCfg=${nameCfg}`)
          .then((res) => {
            const {data} = res;
            this.$emit('updateData', data);
          })
          .catch(() => {
            this.isLoadingDownload = false;
            this.error = `Impossible send request for download this ${this.type}`
          })
    },
    reDownload(){
      this.isLoadingReDownload = true;
      this.error = null;

      axios.put(`/api/${this.type}/redownload?name=${this.item.name_id}`)
          .catch((err) => {
            console.log(err)
            this.error = `Impossible send request for re-download this ${this.type}`
          })
          .finally(() => {
            this.isLoadingReDownload = false;
          })
    },
    remove(){
      this.isLoadingDelete = true;
      axios.delete(`/api/${this.type}/delete?name=${this.item.name_id}&nameCfg=${this.item.nameCfg}`)
          .then(res => {
            this.closeAndUpdate();
          })
        .catch((err) => {
          console.log(err)
          this.error = `Impossible send request for re-download this ${this.type}`
        })
        .finally(() => {
          this.isLoadingDelete = false;
        })
    },
    closeAndUpdate(){
      this.$emit('closeDialogAndUpdate');
    },
    close(){
      this.$emit('closeDialog');
    }
  }
}
</script>

<style lang="scss" scoped>
.hide-img {
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
}

.card-title {
  overflow-wrap: break-word !important;
  position: relative;
  width: calc(100% - 30px);
  top: -65px;
  left: 15px;
  color: white;
  font-weight: bold;
  font-size: 30px;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>