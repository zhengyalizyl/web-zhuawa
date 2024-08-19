import './main.css'
import { createApp } from "vue"
import App from './app.vue'
import router from './router'

import EventEmitter from "eventemitter3"


const app = createApp(App)
window._EE_ = new EventEmitter();
app.use(router)
app.mount('#root')