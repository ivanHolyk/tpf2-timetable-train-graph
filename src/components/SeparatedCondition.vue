<template>
  <div
    style="margin-bottom: 0.25rem; position: absolute"
    :style="getPaddingDrawInfoLeft()"
  >
    <div
      style="position: relative; display: flex; justify-content: center"
      :style="getDrawInfoLeft()"
    >
      <span>
        <!-- {{ index }} -->
      </span>
    </div>
  </div>
  <div
    style="margin-bottom: 0.25rem; position: absolute"
    :style="getPaddingDrawInfoRight()"
  >
    <div
      style="position: relative; display: flex; justify-content: center"
      :style="getDrawInfoRight()"
    >
      <span v-if="arrivalSeconds !== 0">
        <!-- {{ index }} -->
      </span>
    </div>
  </div>
</template>
<script setup>
import { parseCondition } from "@/timeTextUtil"
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

const { arrivalSeconds, departureSeconds } = parseCondition(
  Object.values(condition),
)
const paddingRight = getFractionBySeconds(arrivalSeconds - padding)
const paddingLeft = getFractionBySeconds(departureSeconds + padding)

function getFractionBySeconds(seconds, leftPadding = 0) {
  return (seconds / (3600 - leftPadding)) * 100
}

function getDrawInfoLeft() {
  let style = {}
  style.height = lineHeight.total()
  style.backgroundColor = "red"
  style.borderRadius = "0.5rem"

  checkBorderRadius(style, false, false)
  const left = getFractionBySeconds(departureSeconds)

  style.width = (left / paddingLeft) * 100 + "%"

  return style
}
function getDrawInfoRight() {
  let style = {}
  style.height = lineHeight.total()
  style.backgroundColor = "red"
  style.borderRadius = "0.5rem"
  style.margin = "auto"

  checkBorderRadius(style, true, false)
  if (arrivalSeconds === 0) {
    style.width = 0
  } else {
    style.width =
      (getFractionBySeconds(3600 - arrivalSeconds) /
        getFractionBySeconds(3600 - arrivalSeconds + padding)) *
        100 +
      "%"
  }
  style.marginRight = 0

  return style
}

function getPaddingDrawInfoLeft() {
  let style = {}

  style.height = lineHeight.total()
  style.borderRadius = "0.5rem"

  // style.minWidth = paddingWidth + '%';
  checkBorderRadius(style, false, true)
  if (props.displayApproachLeaveTime) {
    style.backgroundColor = "green"
  }

  style.width = paddingLeft + "%"

  style.top = (lineHeight.value + lineBottomMargin.value) * row + "rem"
  return style
}

function getPaddingDrawInfoRight() {
  let style = {}

  style.height = lineHeight.total()
  style.borderRadius = "0.5rem"

  // style.minWidth = paddingWidth + '%';
  checkBorderRadius(style, true, true)
  if (props.displayApproachLeaveTime) {
    style.backgroundColor = "green"
  }
  if (arrivalSeconds === 0) {
    const right = getFractionBySeconds(3600 - padding)
    style.marginLeft = right + "%"
    style.width = getFractionBySeconds(padding) + "%"
  } else {
    style.marginLeft = paddingRight + "%"
    style.width = getFractionBySeconds(3600 - arrivalSeconds + padding) + "%"
  }
  style.top = (lineHeight.value + lineBottomMargin.value) * row + "rem"
  return style
}
function checkBorderRadius(style, isRight, isPadding) {
  if (isPadding) {
    if (isRight) {
      style.borderTopRightRadius = "0"
      style.borderBottomRightRadius = "0"
    } else {
      style.borderTopLeftRadius = "0"
      style.borderBottomLeftRadius = "0"
    }
  } else {
    if (isRight && (arrivalSeconds != 3600 || departureSeconds != 3600)) {
      style.borderTopRightRadius = "0"
      style.borderBottomRightRadius = "0"
    } else if (arrivalSeconds != 0 && departureSeconds != 0) {
      style.borderTopLeftRadius = "0"
      style.borderBottomLeftRadius = "0"
    }
  }
}
</script>
