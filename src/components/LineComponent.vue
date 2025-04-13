<template>
  <div style="padding: 1rem; border: gray 1px solid; border-radius: 1rem">
    <div class="line-info">
      <p>Line {{ lineName }}</p>
      <p>Frequency: {{ convertSecondstoTime(line.frequency) }}</p>
    </div>
    <div class="line-stations">
      <svg ref="svg" :width="width" :height="height"></svg>
    </div>
  </div>
</template>
<script setup>
import { useNameStore } from "@/stores/names"
import {
  convertSecondstoTime,
  getRangeSeconds,
  parseCondition,
} from "@/timeTextUtil"
import { computed } from "vue"
import * as d3 from "d3"
import { ref, onMounted } from "vue"
import { useLineStore } from "@/stores/lines"
import { useTimetableStore } from "@/stores/timetable"

const props = defineProps(["line", "index"])
const nameStore = useNameStore()

const line = props.line
const lineName = computed(() => {
  const name = nameStore.getName(line.id)
  const result = name ? `${line.id} - ${name}` : line.id
  return result
})

const svg = ref(null)
const width = 800
const height = 600

const lineStore = useLineStore()
const timetableStore = useTimetableStore()

onMounted(() => {
  const data = transformToMareyData(lineStore.lines)
  console.log(data)
  drawMareyGraph(svg.value, data)
})

function transformToMareyData(timetable) {
  // Simplified sample structure — adapt as needed
  const points = []

  // timetable.forEach((line) => {
  const stations = line.stations ?? []
  // console.log(line)
  stations.forEach((station, index) => {
    Object.values(station.conditions.ArrDep || [])?.forEach((c) => {
      const { arrivalSeconds, departureSeconds } = parseCondition(
        Object.values(c),
      )
      points.push({
        // stationID: station.stationID,
        stationID: nameStore.getName(station.stationID),
        time: arrivalSeconds,
        type: "arr",
      })
      points.push({
        // stationID: station.stationID,
        stationID: nameStore.getName(station.stationID),
        time: departureSeconds,
        type: "dep",
      })
    })
  })
  // })

  return points
}

function drawMareyGraph(svgEl, data) {
  const svg = d3.select(svgEl)
  svg.selectAll("*").remove() // Clear

  const margin = { top: 40, right: 40, bottom: 40, left: 100 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.time))
    .range([0, innerWidth])

  const y = d3
    .scalePoint()
    .domain([...new Set(data.map((d) => d.stationID))])
    .range([0, innerHeight])
    .padding(0.5)

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  // Axes
  g.append("g").call(d3.axisLeft(y))
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.time))
    .attr("cy", (d) => y(d.stationID))
    .attr("r", 4)
    .attr("fill", (d) =>
      d.type === "arr" ? "red" : d.type === "dep" ? "green" : "blue",
    )

  // Group by station and line to match arrival/departure pairs
  const stationLineGroups = d3.group(data, (d) => d.stationID)

  stationLineGroups.forEach((points) => {
    const grouped = points.reduce((acc, curr, index, array) => {
      if (curr.type === "arr" && array[index + 1]?.type === "dep") {
        acc.push({
          stationID: curr.stationID,
          arr: curr.time,
          dep: array[index + 1].time,
        })
      }
      return acc
    }, [])

    console.log(grouped)
    grouped.forEach((c) => {
      if (c.arr > c.dep) {
        // Wrapped around midnight (or full cycle)
        g.append("line")
          .attr("x1", x(c.arr))
          .attr("y1", y(c.stationID))
          .attr("x2", x(3600)) // end of scale
          .attr("y2", y(c.stationID))
          .attr("stroke", "black")
          .attr("stroke-width", 1)

        g.append("line")
          .attr("x1", x(0)) // start of scale
          .attr("y1", y(c.stationID))
          .attr("x2", x(c.dep))
          .attr("y2", y(c.stationID))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
      } else {
        // Normal case
        g.append("line")
          .attr("x1", x(c.arr))
          .attr("y1", y(c.stationID))
          .attr("x2", x(c.dep))
          .attr("y2", y(c.stationID))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
      }
    })
  })
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
