import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

import PrimeVue from 'primevue/config'
// Замени на пресет, который экспортируешь из Theme Designer
// (обычно это файл вида theme.js с definePreset внутри)
import MyPreset from './theme.js'

import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.app-dark' // поменяй селектор под свой проект, если нужно
    }
  }
})

app.mount('#app')
