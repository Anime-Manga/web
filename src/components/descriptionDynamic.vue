<template>
  <template
      v-for="(value, index) in item"
      :key="index"
  >
    <div
        v-if="check(index)"
    >
      <h6>{{ index }}:</h6>
      <p class="card-text">{{ item[index] }}</p>
      <hr>
    </div>
  </template>
  <template v-if="!isNil(item.urlPageDownload)">
    <a :href="item.urlPageDownload" target="_blank">
      <v-btn
          class="btn-link"
      >
        <v-icon
            size="15"
            color="white"
        >
          $link
        </v-icon>
      </v-btn>
    </a>
  </template>
</template>

<script setup>
const {isNil} = useLodash()

const props = defineProps({
  item:{
    type: Object,
    required: true
  }
})

const {item} = toRefs(props);

function check(index) {
  switch (index) {
    case 'urlPageDownload':
    case 'typeView':
    case 'exists':
    case 'image':
    case 'name':
    case '_id':
    case 'nameCfg':
    case 'type':
    case 'cover':
    case 'url_page':
    case 'watchList':
      return false;
    default:
      return true;
  }
}
</script>
<style lang="scss" scoped>
.btn-link {
  width: 100%;
  background-color: #6c757d;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
}
</style>