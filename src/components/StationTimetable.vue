<template>
  <h1>Stations</h1>

  <div v-for="(station, index) in stations" :key="index">
    <h3>
      Station - {{ station[0].stationID }}
      {{ nameStore.getName(station[0].stationID) }}
    </h3>

    <div v-for="(line, index2) in station" :key="index2" class="line-container">
      <div class="line-header">
        <div>
          <span class="line-id">
            <i class="bi bi-train-front"></i>
            <!-- Train icon -->
            <span
              >{{ line.line.lineId }} -
              {{ nameStore.getName(line.line.lineId) }}</span
            >
          </span>
        </div>
        <div>
          <span class="frequency">
            <i class="bi bi-arrow-repeat"></i>
            <!-- Frequency icon -->
            {{ convertSecondstoTime(line.line.frequency) }}
          </span>
        </div>
      </div>
      <div class="line-details">
        <span class="timetable">
          <i class="bi bi-clock"></i>
          <!-- Timetable icon -->
          {{ line.line.hasTimetable ? "Timetable Available" : "No Timetable" }}
        </span>
        <span class="conditions">
          <i class="bi bi-info-circle"></i>
          <!-- Conditions icon -->
          <ConditionsTable :conditions="line.conditions"></ConditionsTable>
        </span>
        <span class="vehicles-waiting">
          <i class="bi bi-bus-front"></i>
          <!-- Vehicles waiting icon -->
          <VehicleWaiting :vehicles="line.vehiclesWaiting"></VehicleWaiting>
        </span>
      </div>
    </div>
    <StationLines :station="station"></StationLines>

    <hr />
  </div>
</template>
<script setup>
import { useNameStore } from "@/stores/names"
import { useStationsStore } from "@/stores/stations"
import ConditionsTable from "@/components/ConditionsTable.vue"
import VehicleWaiting from "@/components/VehicleWaiting.vue"
import StationLines from "@/components/StationLines.vue"
// const props = defineProps(['stations'])
const stationStore = useStationsStore()
const stations = stationStore.getStations()

const nameStore = useNameStore()
function convertSecondstoTime(givenSeconds) {
  let dateObj = new Date(givenSeconds * 1000)
  let hours = dateObj.getUTCHours()
  let minutes = dateObj.getUTCMinutes()
  let seconds = dateObj.getSeconds()

  let timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")

  return timeString
}
</script>
<style>
.line-container {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.line-header {
  font-weight: bold;
  margin-bottom: 1rem;
  display: inline-flex;
}

.line-id,
.frequency {
  margin-right: 1rem;
}

.line-details {
  display: flex;
  justify-content: space-between;
}

.line-details span {
  margin-right: 10px;
}

.line-id i,
.frequency i,
.timetable i,
.conditions i,
.vehicles-waiting i {
  margin-right: 5px;
}
</style>
