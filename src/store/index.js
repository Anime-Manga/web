import { defineStore } from 'pinia'
import _  from "lodash";

export const useStore = defineStore('store', {
    state: () => ({
        currentSelectSearch:null,
        schemas: []
    }),
    actions: {
        setSchemas(schemas){
          this.schemas = schemas
        },
        setCurrentSelectSearch(id){
            if(id === this.currentSelectSearch)
                this.currentSelectSearch = null;
            else
                this.currentSelectSearch = id;
        }
    },
    getters: {
        getSchemas(state){
            return state.schemas;
        },
        getSchemasBySelectSearch(state){
            const key = state.currentSelectSearch.split("-")[1];

            for (const index in state.schemas) {

                let name = _.get(state.schemas[index], 'name');
                let type = _.get(state.schemas[index], 'type');
                if(name === key)
                {
                    return {
                        nameCfg: index,
                        type
                    };
                }
            }
            return null;
        }
    },
})