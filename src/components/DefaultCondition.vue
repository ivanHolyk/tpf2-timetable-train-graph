<template>
  <div
    style="margin-bottom: 0.25rem; position: absolute"
    :style="getPaddingDrawInfo(condition)"
  >
    <div
      style="position: relative; display: flex; justify-content: center"
      :style="getDrawInfo(condition)"
    >
      <span>
        <!-- {{ index }} -->
        {{ getRangeText(condition) }}</span
      >
    </div>
  </div>

  <div
    v-if="thereIsSecondPart"
    style="margin-bottom: 0.25rem; position: absolute"
    :style="getPaddingDrawInfo(condition)"
  >
    <div
      style="position: relative; display: flex; justify-content: center"
      :style="getDrawInfo(condition)"
    >
      <span>
        <!-- {{ index }} -->
        {{ getRangeText(condition) }}</span
      >
    </div>
  </div>
</template>
<script setup>
import {
  getRangeText,
  parseCondition,
  isArrivalBeforeDeparture,
} from "@/timeTextUtil"
import { computed } from "vue"
const props = defineProps([
  "condition",
  "displayApproachLeaveTime",
  "index",
  "padding",
  "lineHeight",
  "lineBottomMargin",
  "row",
])

const lineHeight = props.lineHeight
const condition = props.condition
const index = props.index
const padding = props.padding
const lineBottomMargin = props.lineBottomMargin
const row = props.row

const { arrivalSeconds, departureSeconds } = parseCondition(condition)

const paddingLeft = getFractionBySeconds(arrivalSeconds - padding)
const paddingRight = getFractionBySeconds(departureSeconds + padding)
const paddingWidth = paddingRight - paddingLeft

const thereIsSecondPart = computed(
  () =>
    !isArrivalBeforeDeparture(departureSeconds, arrivalSeconds) &&
    departureSeconds != arrivalSeconds,
)

function getFractionBySeconds(seconds, leftPadding = 0) {
  return (seconds / (3600 - leftPadding)) * 100
}

function getDrawInfo() {
  let style = {}
  style.height = lineHeight
  style.backgroundColor = "red"
  style.borderRadius = "0.5rem"
  style.margin = "auto"

  if (isArrivalBeforeDeparture(departureSeconds, arrivalSeconds)) {
    const width = getFractionBySeconds(departureSeconds - arrivalSeconds)
    style.width = (width / paddingWidth) * 100 + "%"
  } else {
    const left = getFractionBySeconds(departureSeconds)
    const right = getFractionBySeconds(arrivalSeconds)

    style.background =
      "linear-gradient(to right,  red " +
      left +
      "%, transparent " +
      left +
      "%, transparent " +
      right +
      "%, red " +
      right +
      "%)"
  }
  return style
}

function getPaddingDrawInfo() {
  let style = {}

  style.height = lineHeight.value + lineHeight.value
  style.borderRadius = "0.5rem"

  style.minWidth = paddingWidth + "%"

  if (props.displayApproachLeaveTime) {
    style.backgroundColor = "green"
  }

  if (arrivalSeconds === departureSeconds) {
    style.marginLeft = paddingRight + "%"
  } else if (isArrivalBeforeDeparture(departureSeconds, arrivalSeconds)) {
    style.marginLeft = paddingLeft + "%"
    style.minWidth = paddingWidth + "%"
  } else {
    const left = getFractionBySeconds(departureSeconds)
    const right = getFractionBySeconds(arrivalSeconds)
    style.background =
      "linear-gradient(to right,  red " +
      left +
      "%, transparent " +
      left +
      "%, transparent " +
      right +
      "%, red " +
      right +
      "%)"
  }

  style.top = (lineHeight.value + lineBottomMargin.value) * row + "rem"
  return style
}
</script>
