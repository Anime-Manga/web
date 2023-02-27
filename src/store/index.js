import { defineStore } from 'pinia'
import {get, has} from "lodash";

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
        getCurrentSelectSearch(state){
            return state.currentSelectSearch;
        },
        getSchemas(state){
            return state.schemas;
        },
        getSchemasBySelectSearch(state){
            const key = state.currentSelectSearch.split("-")[1];

            for (const index in state.schemas) {

                let name = get(state.schemas[index], 'name');
                let type = get(state.schemas[index], 'type');
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