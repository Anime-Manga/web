import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    app:{
        head:{
            link: [
                { rel: 'stylesheet', href: '/assets-icons/css/all.min.css' }
            ]
        }
    },
    components:{
        global: true,
        dirs: ['~/components'],
    },
    modules: [
        'nuxt-icons',
        '@pinia/nuxt',
        '@nuxt/devtools',
        '@sidebase/nuxt-auth',
        'nuxt-lodash',
        //vuetify
        async (options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
              vuetify()
            ))
        },

    ],
    css: [
        'vuetify/lib/styles/main.sass',
        '~/assets/css/index.scss'
    ],
    build: {
        transpile: ['vuetify'],
    },
    runtimeConfig:{
        public: {
            apiBase: process.env.API_BASE_URL || 'http://localhost:5000',
            socketBase: process.env.SOCKET_PATH || 'ws://localhost:1234/room',
            httpBase: process.env.HTTP_PATH || 'http://localhost:5002',
            basePath: process.env.BASE_PATH || '/public',
            webBase: process.env.SHARE_ROOM || 'http://localhost:3000'
        }
    },
    auth: {
        origin: process.env.ORIGIN || "http://localhost:3000",
        enableGlobalAppMiddleware: true
    }
})
