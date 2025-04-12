<template>
  <div>
    <table>
      <StationLinesRow
        v-for="(line, index) in station"
        :key="index"
        :line="line"
        :displayApproachLeaveTime="displayApproachLeaveTime"
      >
      </StationLinesRow>
    </table>
    <label :for="'aprroachTime' + station[0].stationID"
      >Check aprroach time padding</label
    >
    <input
      type="checkbox"
      name="aprroachTime"
      :id="'aprroachTime' + station[0].stationID"
      v-model="displayApproachLeaveTime"
    />
  </div>
</template>
<script setup>
import { ref } from "vue"

import StationLinesRow from "./StationLinesRow.vue"

const props = defineProps(["station"])
const station = props.station
const displayApproachLeaveTime = ref(false)
</script>
