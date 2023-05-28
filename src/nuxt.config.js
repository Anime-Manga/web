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
        dirs: [
            {path: '@/components', pathPrefix: false}
        ],
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
        apiBase: process.env.API_BASE || 'http://localhost:5000',
        secret: 'animemanga',

        public: {
            socketBase: process.env.SOCKET_BASE || 'ws://localhost:1234/room',
            httpBase: process.env.HTTP_BASE || 'http://localhost:5002',
            basePath: process.env.BASE_PATH || '/public',
            webBase: process.env.WEB_BASE || 'http://localhost:3000'
        }
        
    },
    auth: {
        origin: process.env.ORIGIN || "http://localhost:3000",
        enableGlobalAppMiddleware: true,
        addDefaultCallbackUrl: false
    }
})
