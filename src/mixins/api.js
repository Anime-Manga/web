export default {
    methods:{
        getAll() {
            this.isLoading = true;
            fetch('/api/all', {method: 'get'})
                .then(async rs => {
                    this.data = await rs.json();
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.isLoading = false;
                })
        },
        searchLocal() {
            fetch(`/api/search-local?search=${this.search}`, {method: 'get'})
                .then(async rs => {
                    this.data = await rs.json();
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

            fetch(`/api/search-dynamic?name=${this.search}&nameCfg=${nameCfg}&type=${type}`, {method: 'get'})
                .then(async rs => {
                    this.data = await rs.json();
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