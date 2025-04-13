import "./assets/main.css"

import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"

import router from "./router"

import "bootstrap-icons/font/bootstrap-icons.css"
import { createPersistedState } from "pinia-plugin-persistedstate"
const app = createApp(App)

const pinia = createPinia()
pinia.use(createPersistedState())

app.use(pinia).use(router)

app.mount("#app")
