<template>
  <div style="margin-bottom: 0.25rem; position: absolute" :style="getPaddingDrawInfo()">
    <div style="position: relative; display: flex; justify-content: center" :style="getDrawInfo()">
      <span>
        <!-- {{ index }} -->
      </span>
    </div>
  </div>
  <div
    v-if="isDotZero"
    style="margin-bottom: 0.25rem; position: absolute"
    :style="getPaddingDrawInfo(isDotZero)"
  >
    <div
      style="position: relative; display: flex; justify-content: center"
      :style="getDrawInfo(true)"
    >
      <span>
        <!-- {{ index }} -->
      </span>
    </div>
  </div>
</template>
<script setup>
import { parseCondition } from '@/timeTextUtil'
import { computed } from 'vue'
const props = defineProps([
  'condition',
  'displayApproachLeaveTime',
  'index',
  'padding',
  'lineHeight',
  'lineBottomMargin',
  'row'
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

const isDotZero = computed(() => arrivalSeconds === 0 || departureSeconds === 60 * 60)

function getFractionBySeconds(seconds, leftPadding = 0) {
  return (seconds / (3600 - leftPadding)) * 100
}

function getDrawInfo() {
  let style = {}
  style.height = style.width = lineHeight.total()
  style.backgroundColor = 'red'
  style.borderRadius = '1rem'
  style.margin = 'auto'

  return style
}

function getPaddingDrawInfo(drawLastDot) {
  let style = {}

  style.height = lineHeight.total
  style.borderRadius = '1rem'

  style.width = paddingWidth + '%'

  if (props.displayApproachLeaveTime) {
    style.backgroundColor = 'green'
  }

  style.marginLeft = drawLastDot ? 100 + paddingLeft + '%' : paddingLeft + '%'

  style.top = (lineHeight.value + lineBottomMargin.value) * row + 'rem'
  return style
}
</script>
