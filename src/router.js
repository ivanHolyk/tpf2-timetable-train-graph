import { createRouter, createMemoryHistory } from "vue-router"

import LineList from "./components/LineList.vue"
import StationTimetable from "./components/StationTimetable.vue"

const routes = [
  { path: "/linesView", component: LineList },
  { path: "/stationsView", component: StationTimetable },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
