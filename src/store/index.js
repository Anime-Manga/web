import { defineStore } from 'pinia'
import { DateTime } from 'luxon';
import _  from "lodash";

export const useStore = defineStore('store', {
    state: () => ({
        currentSelectSearch:null,
        schemas: [],
        notifications:[]
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
        },
        addNotify(notify){
            notify.id = DateTime.now().toMillis();
            this.notifications.push(notify);
        },
        removeNotify(id){
            this.notifications = useFilter(this.notifications, (notify) => notify.id !== id);
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
        },
        getNotifications(state){
            return state.notifications;
        }
    },
})