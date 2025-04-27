import { createRouter, createWebHistory } from "vue-router"

import LineList from "@/view/LineList.vue"
import StationTimetable from "@/view/StationTimetable.vue"

const routes = [
  // { path: "/", component: App },
  { path: "/lines", component: LineList },
  { path: "/stations", component: StationTimetable },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
