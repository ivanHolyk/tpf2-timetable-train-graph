<template>
  Active: {{ activeCondition }}

  <div v-for="(condition, index) in conditions" :key="index">
    <div v-if="isNone(index)">
      NOOONE
      <hr />
    </div>
    <div v-if="isDebounce(index)">
      Debounce set every {{ getTimeText(condition) }}
      <hr />
    </div>
    <div v-if="isArrDep(index)">
      <table>
        <thead>
          <th>Arrival</th>
          <th>Departure</th>
        </thead>
        <tr v-for="(time, index2) in condition" :key="index2">
          <td>{{ getTime(time.slice(0, 2)) }}</td>
          <td>{{ getTime(time.slice(2)) }}</td>
        </tr>
      </table>
      <hr />
    </div>
    <div v-if="isMoreFancey(index)">bruh. idk man</div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { getTime, getTimeText } from '@/timeTextUtil'
const props = defineProps(['conditions'])
const conditions = props.conditions
const activeCondition = computed(() => conditions['type'])
const isActiveNone = () => activeCondition.value === 'None'
const isActiveDebounce = () => activeCondition.value === 'debounce'
const isActiveArrDep = () => activeCondition.value === 'ArrDep'
const isActiveMoreFancey = () => activeCondition.value === 'moreFancey'

function isNone(condition) {
  return condition === 'None'
}
function isDebounce(condition) {
  return condition === 'debounce'
}
function isArrDep(condition) {
  return condition === 'ArrDep'
}
function isMoreFancey(condition) {
  return condition === 'moreFancey'
}
</script>
