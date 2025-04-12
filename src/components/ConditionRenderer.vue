<template>
  <DefaultCondition
    v-if="isDefaultCondition"
    :condition="condition"
    :displayApproachLeaveTime="props.displayApproachLeaveTime"
    :index="index"
    :lineHeight="lineHeight"
    :lineBottomMargin="lineBottomMargin"
    :row="row"
    :padding="padding"
  ></DefaultCondition>
  <SeparatedCondition
    v-if="isSeparatedCondition"
    :condition="condition"
    :displayApproachLeaveTime="props.displayApproachLeaveTime"
    :index="index"
    :lineHeight="lineHeight"
    :lineBottomMargin="lineBottomMargin"
    :row="row"
    :padding="padding"
  ></SeparatedCondition>
  <DotCondition
    v-if="isDotCondition"
    :condition="condition"
    :displayApproachLeaveTime="props.displayApproachLeaveTime"
    :index="index"
    :lineHeight="lineHeight"
    :lineBottomMargin="lineBottomMargin"
    :row="row"
    :padding="padding"
  ></DotCondition>
</template>
<script setup>
import { parseCondition, isArrivalBeforeDeparture } from "@/timeTextUtil"
import { computed } from "vue"
import DefaultCondition from "./DefaultCondition.vue"
import SeparatedCondition from "./SeparatedCondition.vue"
import DotCondition from "./DotCondition.vue"
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

const isDefaultCondition = computed(
  () =>
    isArrivalBeforeDeparture(departureSeconds, arrivalSeconds) &&
    departureSeconds != arrivalSeconds &&
    arrivalSeconds != 0,
)
const isSeparatedCondition = computed(
  () =>
    (!isArrivalBeforeDeparture(departureSeconds, arrivalSeconds) &&
      departureSeconds != arrivalSeconds) ||
    (arrivalSeconds === 0 && departureSeconds != arrivalSeconds),
)
const isDotCondition = computed(() => arrivalSeconds === departureSeconds)
</script>
