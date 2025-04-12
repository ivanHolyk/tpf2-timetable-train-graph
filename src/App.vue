<template>
  <label for="timetableLoad">Load save .lua file</label>
  <input
    id="timetableLoad"
    class="btn"
    @change="handleLuaFileUpload"
    type="file"
    accept="text/"
  />

  <label for="namesLoad">Load state.csv file</label>
  <input id="namesLoad" @change="handleCsvUpload" type="file" accept="text/" />

  <RouterLink to="/linesView"
    >Lines view {{ lineStore.lines.length }}</RouterLink
  >
  <RouterLink to="/stationsView"
    >Stations view {{ stationStore.stations.length }}</RouterLink
  >
  <span v-show="isLoading" class="loader"></span>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useLineStore } from "./stores/lines"
import { useNameStore } from "./stores/names"
import { parse as parseCSV } from "csv-parse/browser/esm/sync"
import { useStationsStore } from "./stores/stations"
import { useTimetabletore } from "./stores/timetable"

const lineStore = useLineStore()
const nameStore = useNameStore()
const stationStore = useStationsStore()
const timetableStore = useTimetabletore()

const luaWorker = new Worker("/luaWorker.js") // classic worker
const timetableFile = ref(null)
const csvFile = ref(null)
const isLoading = ref(false)

luaWorker.onmessage = (e) => {
  try {
    console.log({ e })
    const json = JSON.parse(e.data)
    const timetable = json?.["timetable_gui.lua"] ?? {}
    console.log(timetable.timetable)
    timetableStore.setTimetable(timetable.timetable)
  } catch (err) {
    console.error("Failed to process timetable:", err)
  }
  isLoading.value = false
}

function handleLuaFileUpload(event) {
  timetableFile.value = event.target.files[0]
  if (!timetableFile.value) return
  isLoading.value = true
  const reader = new FileReader()
  reader.onload = () => {
    const rawText = reader.result
    luaWorker.postMessage(rawText)
  }
  reader.readAsText(timetableFile.value)
}

async function loadTimetableIfExists() {
  isLoading.value = true

  try {
    const res = await fetch("/sandboxy.sav.lua")
    if (!res.ok) throw new Error("Missing sandboxy.sav.lua")
    const text = await res.text()
    luaWorker.postMessage(text)
  } catch (err) {
    console.warn(err.message)
  }
}

function parseAndSetCsv(csvText) {
  const parsed = parseCSV(csvText, {
    columns: true,
    cast: (val, ctx) => (!ctx.header && ctx.index === 0 ? parseInt(val) : val),
  })
  nameStore.setNames(parsed)
}

async function loadStateIfExists() {
  try {
    const res = await fetch("/state.csv")
    if (!res.ok) throw new Error("Missing state.csv")
    const csvText = await res.text()
    parseAndSetCsv(csvText)
  } catch (err) {
    console.warn(err.message)
  }
}

function handleCsvUpload(event) {
  csvFile.value = event.target.files[0]
  if (!csvFile.value) return

  const reader = new FileReader()
  reader.onload = () => {
    parseAndSetCsv(reader.result)
  }
  reader.readAsText(csvFile.value)
}

onMounted(() => {
  loadTimetableIfExists()
  loadStateIfExists()
})
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #00bd7e;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
