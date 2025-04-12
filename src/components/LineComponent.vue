<template>
  <div style="padding: 1rem; border: gray 1px solid; border-radius: 1rem">
    <h2>{{ lineName }}</h2>
    <div class="line-info">
      <p>Frequency: {{ line.frequency }}</p>
    </div>
    <div class="line-stations">
      <div class="line-station-name">
        <div v-for="(station, index) in line.stations" :key="index">
          {{ nameStore.getName(station.stationID) }}
        </div>
      </div>
      <div class="line-station-timetable" :style="generateGradientForTimetable()">
        <div
          v-for="(station, index) in line.stations"
          :key="index"
          style="flex-grow: 1; display: flex; align-items: center"
        >
          <div
            v-for="(condition, index2) in station.conditions?.ArrDep"
            :key="index2"
            :style="styleByCondition(condition)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useNameStore } from '@/stores/names'
import { getRangeSeconds, parseCondition } from '@/timeTextUtil'
import { computed } from 'vue'

const props = defineProps(['line', 'index'])
const nameStore = useNameStore()

const line = props.line
const lineName = computed(() => {
  const name = nameStore.getName(line.lineId)
  return name ? `${line.lineId} - ${name}` : line.lineId
})

function generateGradientForTimetable() {
  const totalMinutes = 60

  let gradientStops = []

  const addStop = (position, color) => {
    gradientStops.push(
      `white ${position}%, ${color} ${position}% calc(${position}% + 1px), white calc(${position}% + 1px)`
    )
  }
  // Loop through each 10-minute interval
  for (let i = 0; i <= totalMinutes; i++) {
    let position = (i / totalMinutes) * 100

    if (position == 100) {
      gradientStops.push(
        `white calc(${position}% - 1px), black calc(${position}% - 1px) ${position}% `
      )
    } else {
      if (i % 10 === 0) {
        // Black lines every 10 minutes
        addStop(position, 'black')
      } else if (i % 5 === 0) {
        // Dark gray lines every 5 minutes
        addStop(position, 'darkgray')
      } else {
        // Light gray lines every minute
        addStop(position, 'lightgray')
      }
    }
  }

  let gradientString = gradientStops.join(', ')

  return { backgroundColor: 'white', background: `linear-gradient(to right, ${gradientString})` }
}

const styleByCondition = (condition) => {
  condition = parseCondition(condition)
  const range = getRangeSeconds(condition)
  const totalWidthS = 60 * 60
  let style = {
    height: '0.125rem',
    backgroundColor: 'red',
    width: (range / totalWidthS) * 100 + '%',
    position: 'relative',
    left: (condition.arrivalSeconds / totalWidthS) * 100 + '%'
  }
  return style
}
</script>
<style>
.line-station-name {
  width: fit-content;
}

.line-stations {
  display: flex;
  flex-direction: row;
}

.line-station-timetable {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
</style>
