import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import MyPreset from './theme.js'
import router from './router'
import '@primeuix/styles'
import './style.css'

const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.app-dark'
        }
    },
    license: import.meta.env.VITE_PRIMEUI_LICENSE_KEY
})

app.use(router)

app.mount('#app')
