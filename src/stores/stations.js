import { ref } from 'vue'
import { defineStore } from 'pinia'
import { isArray } from 'lodash'
export const useStatinonsStore = defineStore('stations', () => {
  const stations = ref([])

  function pushStation(station) {
    stations.value.push(station)
  }
  function getStations() {
    return stations
  }
  function setTimetable(timetable) {
    let tempStations = Object.values(timetable).map((line) => getStationsFromLine(line))

    console.log(tempStations)

    tempStations = tempStations.map((s) => {
      return flatArray(s)
    })
    console.log(tempStations)
    tempStations = tempStations.flat()
    console.log(tempStations)

    let result = Object.groupBy(tempStations, ({ stationID }) => stationID)
    console.log(result)
    stations.value = result
  }

  return { stations, pushStation, getStations, setTimetable }
})
function flatArray(arr) {
  let result = []
  if (isArray(arr)) {
    arr.forEach((a) => {
      if (isStation(a)) {
        result.push(a)
      } else result.push(flatArray(a).flat())
    })
  } else {
    console.error(arr)
    for (const key in arr) {
      if (isStation(arr[key])) {
        result.push(arr[key])
      }
    }
  }
  // console.log(result)
  return result
}

function isStation(o) {
  return o.conditions ? true : false
}
function getStationsFromLine(line) {
  let result = []
  let st = flatArray(line.stations)
  st.forEach((s) => {
    if (isStation(s)) {
      s.line = {}
      s.line.frequency = line.frequency
      s.line.hasTimetable = line.hasTimetable
      s.line.lineId = line.lineId
      result.push(s)
    }
  })
  return result
}
