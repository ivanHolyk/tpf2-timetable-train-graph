<template>
  <div v-for="(vehicle, index) in vehicles" :key="index">
    <p>{{ index }} - {{ nameStore.getName(index) }}</p>

    <p v-if="vehicle.arrivalTime">Arrival: {{ vehicle.arrivalTime }}</p>
    <p>Departure: {{ vehicle.departureTime }}</p>
    <p v-if="vehicle.slot">
      Slot:
      <span>Arr: {{ getTime(vehicle.slot.slice(0, 2)) }}</span>
      <span>Dep: {{ getTime(vehicle.slot.slice(2)) }}</span>
    </p>
    <hr />
  </div>
</template>
<script setup>
import { useNameStore } from '@/stores/names'
import { getTime } from '@/timeTextUtil'
const props = defineProps(['vehicles'])
const vehicles = props.vehicles
const nameStore = useNameStore()
</script>
