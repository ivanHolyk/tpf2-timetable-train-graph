<template>
  <label for="timetableLoad">Load save .lua file</label>
  <input id="timetableLoad" class="btn" @change="handleLuaFileUpload" type="file" accept="text/" />

  <label for="namesLoad">Load state.csv file</label>
  <input id="namesLoad" @change="handleCsvUpload" type="file" accept="text/" />

  <RouterLink to="/linesView">Lines view</RouterLink>
  <RouterLink to="/stationsView">Stations view</RouterLink>
  <span v-show="isLoading" class="loader"></span>
  <RouterView />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLineStore } from './stores/lines'
import { useNameStore } from './stores/names'
import { parse as parseCSV } from 'csv-parse/browser/esm/sync'

const lineStore = useLineStore()
const nameStore = useNameStore()

const luaWorker = new Worker('/luaWorker.js') // classic worker
const timetableFile = ref(null)
const csvFile = ref(null)
const isLoading = ref(false)
luaWorker.onmessage = (e) => {
  try {
    console.log({ e })
    const json = JSON.parse(e.data)
    const timetable = json?.['timetable_gui.lua'] ?? {}
    console.log({ timetable })
    lineStore.setTimetable(timetable)
  } catch (err) {
    console.error('Failed to process timetable:', err)
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
    const trimmed = trimLuaWrapper(rawText)
    luaWorker.postMessage(trimmed)
  }
  reader.readAsText(timetableFile.value)
}

function handleCsvUpload(event) {
  csvFile.value = event.target.files[0]
  if (!csvFile.value) return

  const reader = new FileReader()
  reader.onload = () => {
    const csvText = reader.result
    const parsed = parseCSV(csvText, {
      columns: true,
      cast: (value, ctx) => (!ctx.header && ctx.index === 0 ? parseInt(value) : value)
    })
    nameStore.setNames(parsed)
  }
  reader.readAsText(csvFile.value)
}

function trimLuaWrapper(luaText) {
  // Remove `function data()` and trailing `end`
  return luaText.slice(16, luaText.length - 5)
}

async function loadTimetableIfExists() {
  isLoading.value = true

  try {
    const res = await fetch('/sandboxy.sav.lua')
    if (!res.ok) throw new Error('Missing sandboxy.sav.lua')
    const text = await res.text()
    luaWorker.postMessage(trimLuaWrapper(text))
  } catch (err) {
    console.warn(err.message)
  }
}

async function loadStateIfExists() {
  try {
    const res = await fetch('/state.csv')
    if (!res.ok) throw new Error('Missing state.csv')
    const csvText = await res.text()
    const names = parseCSV(csvText, {
      columns: true,
      cast: (val, ctx) => (!ctx.header && ctx.index === 0 ? parseInt(val) : val)
    })
    nameStore.setNames(names)
  } catch (err) {
    console.warn(err.message)
  }
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
