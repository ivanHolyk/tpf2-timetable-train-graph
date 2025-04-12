import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useStatinonsStore } from '@/stores/stations'
import { useLineStore } from './lines'

export const useTimetabletore = defineStore('timetable', () => {
  const timetable = ref([])
  const stationStore = useStatinonsStore()
  const lineStore = useLineStore()

  function setTimetable(timetable) {
    stationStore.setTimetable(timetable)
    lineStore.setTimetable(timetable)
    timetable.value = timetable
  }

  return { timetable, setTimetable }
})
