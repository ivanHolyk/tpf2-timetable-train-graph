import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLineStore = defineStore('lines', () => {
  const lines = ref([])

  function setTimetable(timetable) {
    lines.value = Object.entries(timetable).map((e) => {
      return { ...e[1], id: e[0] }
    })
  }
  function getLines() {
    return lines
  }
  return { lines, setTimetable, getLines }
})
