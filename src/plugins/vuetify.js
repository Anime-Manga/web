//vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors'
import { fa } from 'vuetify/iconsets/fa'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        ssr: false,
        components,
        directives,
        theme: {
            themes: {
                light: {
                    colors:{
                        primary: '#90cbd3',
                        secondary: '#202020',
                        info: colors.teal.lighten1,
                        warning: colors.amber.base,
                        error: '#F3565D',
                        success: '#5cb85c',
                    }
                },
            },
        },
        icons:{
            defaultSet: 'fa',
            aliases: {
                show: 'fa-solid fa-eye',
                hide: 'fa-solid fa-eye-slash',
                database:'fa-solid fa-database',
                search:'fa-solid fa-search',
                planet: 'fa-solid fa-earth-europe',
                book: 'fa-solid fa-book',
                x:'fa-solid fa-xmark',
                arrowLeft:'fa-solid fa-arrow-left',
                arrowRight: 'fa-solid fa-arrow-right',
                link: 'fa-solid fa-link',
                download: 'fa-solid fa-download',
                redownload: 'fa-solid fa-rotate-left',
                trash: 'fa-solid fa-trash-can',
                sortUp: 'fa-solid fa-angle-up',
                sortDown: 'fa-solid fa-angle-down',
                error: 'fa-solid fa-circle-exclamation',
                clapperboard:'fa-solid fa-clapperboard',
                user: 'fa-solid fa-user',
                crown: 'fa-solid fa-crown',
                share: 'fa-solid fa-square-share-nodes',
                arrowUp: 'fa-solid fa-arrow-up',
                arrowDown: 'fa-solid fa-arrow-down',
                video: 'fa-solid fa-film',
                login: 'fa-solid fa-right-to-bracket',
                logout: 'fa-solid fa-right-from-bracket',
                saved: 'fa-solid fa-bookmark',
                notSaved:'fa-regular fa-bookmark'
            },
            sets: {
                fa
            }
        }
    })
    nuxtApp.vueApp.use(vuetify)
})