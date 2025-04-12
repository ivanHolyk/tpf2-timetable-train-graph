import { ref } from "vue"
import { defineStore } from "pinia"
import { useStationsStore } from "@/stores/stations"
import { useLineStore } from "./lines"

export const useTimetabletore = defineStore("timetable", () => {
  const timetable = ref()
  const stationStore = useStationsStore()
  const lineStore = useLineStore()

  function setTimetable(t) {
    stationStore.setTimetable(t)
    lineStore.setTimetable(t)
    timetable.value = t
  }

  return { timetable, setTimetable }
})
