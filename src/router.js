import { createRouter, createMemoryHistory } from "vue-router"

import LineList from "@/view/LineList.vue"
import StationTimetable from "@/view/StationTimetable.vue"

const routes = [
  // { path: "/", component: App },
  { path: "/lines", component: LineList },
  { path: "/stations", component: StationTimetable },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
