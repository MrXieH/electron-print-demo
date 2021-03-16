import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const electron = window.require('electron')

const app = createApp(App)
app.config.globalProperties.$electron = electron
app.use(router).mount('#app')
