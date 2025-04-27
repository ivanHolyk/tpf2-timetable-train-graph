<template>
  <h1>Lines</h1>
  <div style="display: flex; flex-direction: column; gap: 1rem">
    <LineComponent
      v-for="(line, index) in lines"
      :key="index"
      :line="line"
      :index="index"
    ></LineComponent>
  </div>
</template>
<script setup>
import { useLineStore } from "@/stores/lines"
import { useRoute } from "vue-router"
import { computed } from "vue"
import LineComponent from "@/components/LineComponent.vue"
import { useNameStore } from "@/stores/names"

const lineStore = useLineStore()
const route = useRoute()
const nameStore = useNameStore()

const lineFilter = computed(() => {
  const q = route.query.line
  if (!q) return null
  const arr = Array.isArray(q) ? q : q.split(",")
  return arr.map((x) => x.trim()).filter(Boolean)
})

const lines = computed(() => {
  const allLines = lineStore.getLines()

  if (!lineFilter.value) return allLines.value
  return allLines.value.filter((line) => {
    return (
      line.id.includes(lineFilter.value) ||
      nameStore
        .getName(line.id)
        .toLowerCase()
        .includes(lineFilter.value[0].toLowerCase())
    )
  })
})
</script>
