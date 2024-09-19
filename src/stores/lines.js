import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStatinonsStore } from '@/stores/stations'

export const useLineStore = defineStore('lines', () => {
  const lines = ref([])
  const stationStore = useStatinonsStore()

  function setTimetable(timetable) {
    stationStore.setTimetable(timetable)
    lines.value = timetable
  }
  function getLines() {
    return lines
  }
  return { lines, setTimetable, getLines }
})
