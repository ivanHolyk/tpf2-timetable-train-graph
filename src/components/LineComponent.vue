<template>
  <div style="padding: 1rem; border: gray 1px solid; border-radius: 1rem">
    <div class="line-info">
      <p>Line {{ lineName }}</p>
      <p>Frequency: {{ convertSecondstoTime(line.frequency) }}</p>
      <button @click="editorMode = !editorMode">
        {{ editorMode ? "Exit Editor Mode" : "Enter Editor Mode" }}
      </button>
    </div>
    <div class="line-stations">
      <svg ref="svg" :width="width" :height="height"></svg>
    </div>
  </div>
</template>
<script setup>
import { useNameStore } from "@/stores/names"
import { convertSecondstoTime, parseCondition } from "@/timeTextUtil"
import { ref, computed, onMounted } from "vue"
import * as d3 from "d3"
import { useLineStore } from "@/stores/lines"
import { useTimetableStore } from "@/stores/timetable"

const props = defineProps(["line", "index"])
const nameStore = useNameStore()
const editorMode = ref(false)
const activeDep = ref(null)

const svg = ref(null)
const width = 800
const height = 600

const line = props.line
const lineName = computed(() => {
  const name = nameStore.getName(line.id)
  return name ? `${line.id} - ${name}` : line.id
})

const lineStore = useLineStore()
const timetableStore = useTimetableStore()

// Shared access
let x, y, g, margin

onMounted(() => {
  const data = transformToMareyData(lineStore.lines)
  drawMareyGraph(svg.value, data)
})

function transformToMareyData(timetable) {
  const points = []
  const stations = line.stations ?? []

  stations.forEach((station) => {
    Object.values(station.conditions.ArrDep || []).forEach((c) => {
      const { arrivalSeconds, departureSeconds } = parseCondition(
        Object.values(c),
      )
      points.push({
        stationID: nameStore.getName(station.stationID),
        time: arrivalSeconds,
        type: "arr",
      })
      points.push({
        stationID: nameStore.getName(station.stationID),
        time: departureSeconds,
        type: "dep",
      })
    })
  })

  return points
}

function drawFloatingLine(event, dep) {
  const [x1, y1] = [x(dep.time), y(dep.stationID)]

  const floatingLine = g
    .append("line")
    .attr("class", "floating-line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x1)
    .attr("y2", y1)
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4 2")

  d3.select(svg.value).on("mousemove", (event) => {
    const [mx, my] = d3.pointer(event)
    floatingLine.attr("x2", mx - margin.left).attr("y2", my - margin.top)
  })
}

function createConnection(from, to) {
  g.append("line")
    .attr("x1", x(from.time))
    .attr("y1", y(from.stationID))
    .attr("x2", x(to.time))
    .attr("y2", y(to.stationID))
    .attr("stroke", "black")
    .attr("stroke-width", 2)
}

function drawMareyGraph(svgEl, data) {
  const svgSelection = d3.select(svgEl)
  svgSelection.selectAll("*").remove()

  margin = { top: 40, right: 40, bottom: 40, left: 100 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.time))
    .range([0, innerWidth])

  y = d3
    .scalePoint()
    .domain([...new Set(data.map((d) => d.stationID))])
    .range([0, innerHeight])
    .padding(0.5)

  g = svgSelection
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  g.append("g")
    .attr("class", "axis") // ← ADD THIS
    .call(d3.axisLeft(y))

  g.append("g")
    .attr("class", "axis") // ← ADD THIS
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))

  g.append("g").call(d3.axisLeft(y))
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))

  // Draw default station-side lines (dep-arr pairs)
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

    grouped.forEach((c) => {
      if (c.arr > c.dep) {
        g.append("line")
          .attr("x1", x(c.arr))
          .attr("y1", y(c.stationID))
          .attr("x2", x(3600))
          .attr("y2", y(c.stationID))
          .attr("stroke", "black")
          .attr("stroke-width", 1)

        g.append("line")
          .attr("x1", x(0))
          .attr("y1", y(c.stationID))
          .attr("x2", x(c.dep))
          .attr("y2", y(c.stationID))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
      } else {
        g.append("line")
          .attr("x1", x(c.arr))
          .attr("y1", y(c.stationID))
          .attr("x2", x(c.dep))
          .attr("y2", y(c.stationID))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
      }
    })

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.stationID))
      .attr("r", 4)
      .attr("fill", (d) => (d.type === "arr" ? "red" : "green"))
      .on("click", (event, d) => {
        if (!editorMode.value) return

        if (d.type === "dep") {
          console.log({ d })
          activeDep.value = d
          drawFloatingLine(event, d)
        } else if (d.type === "arr" && activeDep.value) {
          console.log("there is connector about to connect")
          createConnection(activeDep.value, d)
          activeDep.value = null
          d3.select(svg.value).selectAll(".floating-line").remove()
        }
      })
  })
}
</script>
<style scoped>
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

/* 🔧 Add this to disable interaction with axis labels */
g.axis text,
g.axis line,
g.axis path {
  pointer-events: none;
}
</style>
