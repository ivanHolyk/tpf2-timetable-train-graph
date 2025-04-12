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
import LineComponent from "./LineComponent.vue"

const lineStore = useLineStore()
const lines = lineStore.getLines()
</script>
