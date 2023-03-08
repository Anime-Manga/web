import axios from "axios";

export default {
    methods:{
        getAll() {
            this.isLoading = true;
            axios('/api/all')
                .then(res => {
                    const {data} = res;
                    this.data = data;
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },
        searchLocal() {
            axios(`/api/search-local?search=${this.search}`)
                .then(res => {
                    const {data} = res;
                    this.data = data;
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },
        searchDynamic(){
            const {nameCfg, type} = this.store.getSchemasBySelectSearch;

            axios(`/api/search-dynamic?name=${this.search}&nameCfg=${nameCfg}&type=${type}`)
                .then(res => {
                    const {data} = res;
                    this.data = data;
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.isLoading = false;
                })
        }
    }
}