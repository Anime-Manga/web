<template>
  <template
      v-for="(value, index) in item"
      :key="index"
  >
    <div
      class="card-description"
        v-if="check(index) && !isNil(item[index])"
    >
      <span class="head">{{ index }}:</span><span>{{ item[index] }}</span>
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
    case 'name_id':
      return false;
    default:
      return true;
  }
}
</script>
<style lang="scss" scoped>
.card-description{
  border: #90cbd3 3px solid;
  border-radius: 10px;
  margin-bottom: 5px;
  padding: 0 5px;
  
  .head{
    position: relative;
    text-transform: uppercase;
    font-size: small;
    background-color: #90cbd3;
    color: white;
    padding: 5px;
    top: -1;
    left: -6px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 1px;
  }
}

.btn-link {
  width: 100%;
  background-color: #6c757d;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
}
</style>