<template>
  <v-expansion-panels
      v-if="isNil(item.urlPageDownload)"
      v-model="showStatus"
      class="mt-3"
  >
    <v-expansion-panel>
      <v-expansion-panel-title
        color="primary"
        style="color: white !important;"
        collapse-icon="$sortUp"
        expand-icon="$sortDown"
      >
        {{showStatus === 0? 'Hide status download' : 'Show status download'}}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <template v-if="error && isNil(contents)">
          <alert
              type="error"
              text="Impossible download information for content"
          />
        </template>
        <template v-else-if="isNil(contents)">
          <div class="d-flex justify-center">
            <v-progress-circular
              indeterminate
              size="60"
              width="10"
              color="primary"
            />
          </div>
        </template>
        <template v-else>
          <v-expansion-panels
            variant="accordion"
            multiple
          >
            <v-expansion-panel
              v-for="content in contents"
              :key="content.version"
              bg-color="secondary"
              collapse-icon="$sortUp"
              expand-icon="$sortDown"
            >
              <template  #title>
                {{(item.type === 'video')? 'Season' : 'Volume'}} {{ content.version }}
              </template>
              
              <template #text>
                <div
                  class="pa-1 d-flex flex-column"
                  v-for="media in content.elements"
                >
                  <template v-if="item.type === 'video'">
                    <span>Episode: {{media.numberEpisodeCurrent}}</span>
                  </template>
                  <template v-else>
                    <span>Chapter: {{media.currentChapter}}</span>
                  </template>
                  <progressBar
                      :item="media"
                  />
                  <template v-if="media.stateDownload && media.stateDownload.toUpperCase() === 'COMPLETED'">
                    <template v-if="item.type === 'video'">
                      <div class="my-3">
                        <NuxtLink :to="'/room?type=anime&episode='+media.id">
                          <v-btn
                              color="primary"
                              block
                          >
                            <v-icon
                                color="white"
                            >
                              $clapperboard
                            </v-icon>
                          </v-btn>
                        </NuxtLink>
                      </div>
                    </template>
                    <template v-else>
                      <div class="my-3">
                        <NuxtLink :to="`/room?type=manga&chapter=${media.id}&manga=${item.name_id}`">
                          <v-btn
                              color="primary"
                              block
                          >
                            <v-icon
                                color="white"
                            >
                              $book
                            </v-icon>
                          </v-btn>
                        </NuxtLink>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import _ from 'lodash'
//variables
const showStatus = ref(null)
const contents = ref(null)
const date = ref(null)
const error = ref(null)

//lodash
const {isNil} = useLodash();

//api
const {getStatus} = useApi();

//props
const props = defineProps({
  item:{
    type: Object,
    required: true
  }
})

const {item} = toRefs(props);

watch(item, () => date.value = new Date());

watch(date, () => {
  if(_.isNil(item.value.urlPageDownload))
    {
      setTimeout(async () => {
        try{
          const result = await getStatus(item.value.type, item.value.name_id);
          contents.value = colletion(result);
        }catch(err){
          console.log(err);
        }finally{
          date.value = new Date();
        }
      }, 1000);
    }
}, {immediate: true})

function colletion(result){
  let collection = [];
  for (const object of result) {
    let version;
    if(_.has(object, 'currentVolume'))
      version = object.currentVolume;
    else
      version = object.numberSeasonCurrent;


    let find = collection.filter(item => {
      if(version === item.version)
        return true;
      
      return false;
    })

    if(find.length >0)
      find[0].elements.push(object);
    else
    collection.push({
        version,
        elements:[object] 
      });
  }
  
  return collection;
}
</script>

<style scoped>
.card-download{
  color: white !important;
}
.btn-room{
  background-color: #90cbd3;
  padding: 10px;
  text-decoration: none;
  color: white;
  border-radius: 5px;
}
</style>